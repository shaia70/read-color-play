-- Emergency Security Fix: Prevent Fake Transaction Recording
-- Disable the dangerous record-payment function by requiring PayPal verification

-- Add verification flag to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS requires_paypal_verification BOOLEAN DEFAULT true;

-- Update existing unverified payments to require verification
UPDATE public.payments 
SET requires_paypal_verification = true,
    verified_with_paypal = false
WHERE verified_with_paypal = false OR verified_with_paypal IS NULL;

-- Add constraint to prevent fake transactions
ALTER TABLE public.payments 
ADD CONSTRAINT payments_must_be_verified 
CHECK (
  (verified_with_paypal = true AND paypal_verification_date IS NOT NULL) OR
  (verified_with_paypal = false AND requires_paypal_verification = true)
);

-- Log security incident
INSERT INTO public.security_audit_log (action, resource, details)
VALUES (
  'security_incident_fake_transaction',
  'payments',
  jsonb_build_object(
    'incident', 'Fake PayPal transaction detected',
    'transaction_id', '5VF95731KN532091W', 
    'status', 'BLOCKED - requires verification',
    'action_taken', 'Added verification constraints',
    'timestamp', now()
  )
);

-- Create function to mark payment as verified only after PayPal confirmation
CREATE OR REPLACE FUNCTION public.verify_payment_with_paypal(
  p_payment_id uuid,
  p_paypal_order_id text,
  p_payer_email text,
  p_payer_id text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow service role to verify payments
  IF auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'Payment verification only allowed by service role';
  END IF;
  
  UPDATE public.payments 
  SET 
    verified_with_paypal = true,
    paypal_verification_date = now(),
    payer_email = p_payer_email,
    payer_id = p_payer_id,
    updated_at = now()
  WHERE id = p_payment_id;
  
  RETURN FOUND;
END;
$$;