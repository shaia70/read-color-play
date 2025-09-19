-- Delete coupon usage records for Donny Simon
DELETE FROM public.coupon_usage 
WHERE user_id = 'b260dc66-6876-4dbd-91f3-da50fa39c651';

-- Delete security audit log entries for coupon redemption by Donny Simon
DELETE FROM public.security_audit_log 
WHERE user_id = 'b260dc66-6876-4dbd-91f3-da50fa39c651' 
  AND action = 'coupon_redeemed';