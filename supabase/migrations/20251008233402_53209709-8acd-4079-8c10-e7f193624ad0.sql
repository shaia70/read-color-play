-- Fix PHYSICALBOOKTEST7 coupon discount amount from 8200 (agorot) to 82 (shekels)
UPDATE public.coupons 
SET discount_amount = 82
WHERE code = 'PHYSICALBOOKTEST7';

-- Log the correction
INSERT INTO public.security_audit_log (action, resource, details)
VALUES (
  'fix_coupon_amount',
  'coupons',
  jsonb_build_object(
    'coupon_code', 'PHYSICALBOOKTEST7',
    'old_amount', 8200,
    'new_amount', 82,
    'reason', 'Converting from agorot to shekels'
  )
);