-- Fix status constraint and security issue properly

-- First check what status values are allowed
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_schema = 'public' 
AND constraint_name LIKE '%payments%status%';

-- Update the fake transaction to 'pending' status (which is allowed)
UPDATE public.payments 
SET 
  verified_with_paypal = false,
  requires_paypal_verification = true,
  status = 'pending'
WHERE paypal_transaction_id = '5VF95731KN532091W';

-- Revoke access for the user with unverified payment
UPDATE public.users 
SET 
  paid_for_flipbook = false,
  flipbook_access_expires_at = NULL,
  has_paid = false
WHERE id = 'b82ff5a1-d0b3-4554-b7c1-39316c2bc113';

-- Log this security incident
INSERT INTO public.security_audit_log (action, resource, details)
VALUES (
  'security_fix_fake_transaction',
  'payments',
  jsonb_build_object(
    'incident', 'Blocked fake PayPal transaction',
    'fake_transaction_id', '5VF95731KN532091W',
    'real_paypal_id', '5XE03844WW957952U', 
    'user_affected', 'b82ff5a1-d0b3-4554-b7c1-39316c2bc113',
    'action_taken', 'Revoked access, marked as pending verification',
    'severity', 'HIGH',
    'timestamp', now()
  )
);