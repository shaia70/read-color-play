-- Add service-specific fields to users table to separate flipbook and bina course
ALTER TABLE public.users 
ADD COLUMN registered_for_flipbook boolean DEFAULT false,
ADD COLUMN registered_for_bina boolean DEFAULT false,
ADD COLUMN paid_for_flipbook boolean DEFAULT false,
ADD COLUMN paid_for_bina boolean DEFAULT false,
ADD COLUMN flipbook_access_expires_at timestamp with time zone,
ADD COLUMN bina_access_expires_at timestamp with time zone,
ADD COLUMN flipbook_access_granted_at timestamp with time zone,
ADD COLUMN bina_access_granted_at timestamp with time zone;

-- Add service_type field to payments table to track which service each payment is for
ALTER TABLE public.payments 
ADD COLUMN service_type text DEFAULT 'flipbook';

-- Add check constraint for valid service types
ALTER TABLE public.payments 
ADD CONSTRAINT valid_service_type CHECK (service_type IN ('flipbook', 'bina', 'both'));

-- Migrate existing data: assume current registrations are for flipbook
UPDATE public.users 
SET 
  registered_for_flipbook = true,
  paid_for_flipbook = has_paid,
  flipbook_access_expires_at = access_expires_at,
  flipbook_access_granted_at = access_granted_at
WHERE email IS NOT NULL;

-- Update existing payments to be flipbook payments
UPDATE public.payments 
SET service_type = 'flipbook' 
WHERE service_type IS NULL;

-- Create function to grant service-specific access
CREATE OR REPLACE FUNCTION public.grant_service_access(
  user_id uuid, 
  service_name text, 
  duration_days integer DEFAULT 30, 
  amount numeric DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  caller_role text;
BEGIN
  -- Determine caller role (may be null for service role)
  SELECT public.get_current_user_role() INTO caller_role;

  -- Only allow service role (no auth.uid()) or admin/teacher users
  IF auth.uid() IS NULL THEN
    -- likely service role call, allow
    NULL;
  ELSIF caller_role NOT IN ('admin','teacher') THEN
    RAISE EXCEPTION 'Access denied: only admin/teacher or service role can grant access';
  END IF;

  -- Validate service name
  IF service_name NOT IN ('flipbook', 'bina', 'both') THEN
    RAISE EXCEPTION 'Invalid service_name: % (must be flipbook, bina, or both)', service_name;
  END IF;

  -- Validate duration
  IF duration_days IS NULL OR duration_days < 1 OR duration_days > 400 THEN
    RAISE EXCEPTION 'Invalid duration_days: % (must be 1-400)', duration_days;
  END IF;

  -- Grant access based on service type
  IF service_name = 'flipbook' OR service_name = 'both' THEN
    UPDATE public.users 
    SET 
      registered_for_flipbook = true,
      paid_for_flipbook = true,
      flipbook_access_granted_at = NOW(),
      flipbook_access_expires_at = NOW() + INTERVAL '1 day' * duration_days,
      updated_at = NOW()
    WHERE id = user_id;
  END IF;

  IF service_name = 'bina' OR service_name = 'both' THEN
    UPDATE public.users 
    SET 
      registered_for_bina = true,
      paid_for_bina = true,
      bina_access_granted_at = NOW(),
      bina_access_expires_at = NOW() + INTERVAL '1 day' * duration_days,
      updated_at = NOW()
    WHERE id = user_id;
  END IF;

  -- Update legacy fields for backward compatibility
  UPDATE public.users 
  SET 
    has_paid = (paid_for_flipbook OR paid_for_bina),
    access_granted_at = CASE 
      WHEN service_name = 'flipbook' THEN flipbook_access_granted_at
      WHEN service_name = 'bina' THEN bina_access_granted_at
      WHEN service_name = 'both' THEN GREATEST(flipbook_access_granted_at, bina_access_granted_at)
      ELSE access_granted_at
    END,
    access_expires_at = CASE 
      WHEN service_name = 'flipbook' THEN flipbook_access_expires_at
      WHEN service_name = 'bina' THEN bina_access_expires_at
      WHEN service_name = 'both' THEN GREATEST(flipbook_access_expires_at, bina_access_expires_at)
      ELSE access_expires_at
    END,
    payment_amount = amount
  WHERE id = user_id;

  -- Log the access grant
  PERFORM public.log_security_event(
    'grant_service_access',
    'users',
    jsonb_build_object(
      'target_user', user_id,
      'service', service_name,
      'duration_days', duration_days,
      'amount', amount,
      'by', auth.uid()
    )
  );
END;
$$;

-- Create function to check if user has access to specific service
CREATE OR REPLACE FUNCTION public.has_service_access(
  user_id uuid, 
  service_name text
)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT CASE 
    WHEN service_name = 'flipbook' THEN 
      (paid_for_flipbook = true AND (flipbook_access_expires_at IS NULL OR flipbook_access_expires_at > NOW()))
    WHEN service_name = 'bina' THEN 
      (paid_for_bina = true AND (bina_access_expires_at IS NULL OR bina_access_expires_at > NOW()))
    ELSE false
  END
  FROM public.users 
  WHERE id = user_id;
$$;