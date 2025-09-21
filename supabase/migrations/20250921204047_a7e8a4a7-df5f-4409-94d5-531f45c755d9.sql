-- Fix the transaction ID for legitimate payment
-- Update the payment record with the correct PayPal transaction ID

UPDATE public.payments 
SET 
  paypal_transaction_id = '5XE03844WW957952U',
  verified_with_paypal = false,
  requires_paypal_verification = true,
  status = 'pending'
WHERE paypal_transaction_id = '5VF95731KN532091W';

-- Log the correction
INSERT INTO public.security_audit_log (action, resource, details)
VALUES (
  'payment_id_correction',
  'payments',
  jsonb_build_object(
    'incident', 'Corrected PayPal transaction ID',
    'old_transaction_id', '5VF95731KN532091W',
    'correct_transaction_id', '5XE03844WW957952U',
    'user_id', 'b82ff5a1-d0b3-4554-b7c1-39316c2bc113',
    'action', 'Updated to correct PayPal ID, requires re-verification',
    'timestamp', now()
  )
);