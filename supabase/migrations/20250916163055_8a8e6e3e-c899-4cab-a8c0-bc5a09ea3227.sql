-- Create a new 5 NIS coupon code for the flipbook
INSERT INTO public.coupons (
  code,
  discount_amount,
  discount_type,
  access_duration_days,
  max_uses,
  is_active
) VALUES (
  'FLIPBOOK5NIS',
  500, -- 5 NIS (amounts appear to be in agorot: 500 agorot = 5 NIS)
  'fixed',
  30, -- 30 days access
  100, -- Can be used 100 times
  true
);