-- Update FLIPBOOK5NIS coupon to make final price 5 NIS (55 NIS discount)
UPDATE public.coupons 
SET discount_amount = 5500  -- 55 NIS discount (55 * 100 agorot)
WHERE code = 'FLIPBOOK5NIS';