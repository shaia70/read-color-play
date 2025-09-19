-- Create function to revoke service access
CREATE OR REPLACE FUNCTION public.revoke_service_access(user_id uuid, service_name text)
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
    RAISE EXCEPTION 'Access denied: only admin/teacher or service role can revoke access';
  END IF;

  -- Validate service name
  IF service_name NOT IN ('flipbook', 'bina', 'both') THEN
    RAISE EXCEPTION 'Invalid service_name: % (must be flipbook, bina, or both)', service_name;
  END IF;

  -- Revoke access based on service type
  IF service_name = 'flipbook' OR service_name = 'both' THEN
    UPDATE public.users 
    SET 
      paid_for_flipbook = false,
      flipbook_access_expires_at = NULL,
      flipbook_access_granted_at = NULL,
      updated_at = NOW()
    WHERE id = user_id;
  END IF;

  IF service_name = 'bina' OR service_name = 'both' THEN
    UPDATE public.users 
    SET 
      paid_for_bina = false,
      bina_access_expires_at = NULL,
      bina_access_granted_at = NULL,
      updated_at = NOW()
    WHERE id = user_id;
  END IF;

  -- Update legacy fields for backward compatibility
  UPDATE public.users 
  SET 
    has_paid = (COALESCE(paid_for_flipbook, false) OR COALESCE(paid_for_bina, false)),
    access_expires_at = CASE 
      WHEN COALESCE(paid_for_flipbook, false) AND COALESCE(paid_for_bina, false) THEN 
        GREATEST(COALESCE(flipbook_access_expires_at, '1970-01-01'::timestamp), COALESCE(bina_access_expires_at, '1970-01-01'::timestamp))
      WHEN COALESCE(paid_for_flipbook, false) THEN flipbook_access_expires_at
      WHEN COALESCE(paid_for_bina, false) THEN bina_access_expires_at
      ELSE NULL
    END
  WHERE id = user_id;

  -- Log the access revocation
  PERFORM public.log_security_event(
    'revoke_service_access',
    'users',
    jsonb_build_object(
      'target_user', user_id,
      'service', service_name,
      'by', auth.uid()
    )
  );
END;
$$;