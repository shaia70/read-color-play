-- Delete coupon usage for PHYSICALBOOKTEST7 from specific users
DELETE FROM public.coupon_usage 
WHERE coupon_code = 'PHYSICALBOOKTEST7'
  AND user_id IN (
    SELECT id FROM public.users 
    WHERE name IN ('דוני סימון', 'shaikey', 'Doni Simon', 'Shaikey')
      OR email ILIKE '%doni%'
      OR email ILIKE '%shaikey%'
      OR email ILIKE '%simondon%'
  );

-- Log the deletion for audit purposes
INSERT INTO public.security_audit_log (action, resource, details)
VALUES (
  'delete_coupon_usage_retry',
  'coupon_usage',
  jsonb_build_object(
    'coupon_code', 'PHYSICALBOOKTEST7',
    'users', ARRAY['דוני סימון', 'shaikey'],
    'reason', 'Admin requested deletion - retry'
  )
);