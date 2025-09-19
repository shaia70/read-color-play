-- Delete coupon usage for user "דוני סימון"
DELETE FROM public.coupon_usage 
WHERE user_id IN (
  SELECT id FROM public.users WHERE name = 'דוני סימון'
);

-- Also reset user access if needed
UPDATE public.users 
SET 
  has_paid = false,
  paid_for_flipbook = false,
  paid_for_bina = false,
  access_expires_at = NULL,
  flipbook_access_expires_at = NULL,
  bina_access_expires_at = NULL,
  access_granted_at = NULL,
  flipbook_access_granted_at = NULL,
  bina_access_granted_at = NULL,
  payment_amount = NULL
WHERE name = 'דוני סימון';