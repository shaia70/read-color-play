-- Delete coupon usage records for Donny Simon (latest attempt)
DELETE FROM public.coupon_usage 
WHERE user_id IN (
  SELECT id FROM public.users 
  WHERE name ILIKE '%דוני סימון%' OR name ILIKE '%donny simon%'
);