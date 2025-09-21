-- Fix security warnings and strengthen payment verification

-- Fix search_path issue in the function
DROP FUNCTION IF EXISTS public.verify_payment_with_paypal(uuid, text, text, text);
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

-- Mark the suspicious transaction as requiring verification
UPDATE public.payments 
SET 
  verified_with_paypal = false,
  requires_paypal_verification = true,
  status = 'requires_verification'
WHERE paypal_transaction_id = '5VF95731KN532091W';

-- Revoke access for unverified payments
UPDATE public.users 
SET 
  paid_for_flipbook = false,
  flipbook_access_expires_at = NULL,
  has_paid = false
WHERE id = 'b82ff5a1-d0b3-4554-b7c1-39316c2bc113';

-- Add audit trail for this security incident  
INSERT INTO public.security_audit_log (action, resource, details)
VALUES (
  'revoked_access_fake_transaction',
  'users',
  jsonb_build_object(
    'user_id', 'b82ff5a1-d0b3-4554-b7c1-39316c2bc113',
    'reason', 'Unverified PayPal transaction',
    'fake_transaction_id', '5VF95731KN532091W',
    'real_transaction_id', '5XE03844WW957952U',
    'action', 'Access revoked until proper verification',
    'timestamp', now()
  )
);