-- Update coupon discount amounts to reflect new price of 60 NIS
UPDATE public.coupons 
SET discount_amount = 60
WHERE code IN ('FREE2025', 'FLIPBOOK2025') 
  AND discount_amount = 70;