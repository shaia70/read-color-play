-- Remove coupon usage record for FLIPBOOK5NIS for user דוני סימון to allow retesting
DELETE FROM public.coupon_usage 
WHERE user_id = 'b260dc66-6876-4dbd-91f3-da50fa39c651' 
AND coupon_code = 'FLIPBOOK5NIS';