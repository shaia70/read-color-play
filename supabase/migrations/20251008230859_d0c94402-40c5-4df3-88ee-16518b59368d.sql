-- Update the PHYSICALBOOK50NIS coupon to have a discount of 39 ILS
UPDATE public.coupons 
SET 
  discount_amount = 39,
  updated_at = NOW()
WHERE code = 'PHYSICALBOOK50NIS';