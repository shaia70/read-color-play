-- Delete coupon usage for PHYSICALBOOKTEST7 from Doni Simon
DELETE FROM public.coupon_usage 
WHERE coupon_code = 'PHYSICALBOOKTEST7'
  AND user_id IN (
    SELECT id FROM public.users 
    WHERE name IN ('דוני סימון', 'Doni Simon')
      OR email ILIKE '%doni%'
      OR email ILIKE '%simondon%'
  );

-- Log the deletion
INSERT INTO public.security_audit_log (action, resource, details)
VALUES (
  'delete_coupon_usage_doni',
  'coupon_usage',
  jsonb_build_object(
    'coupon_code', 'PHYSICALBOOKTEST7',
    'user', 'דוני סימון',
    'reason', 'Admin requested deletion'
  )
);