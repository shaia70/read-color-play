-- Create a special coupon for flipbook with unlimited access
-- Using a unique prefix to differentiate from course coupons
INSERT INTO public.coupons (
  code,
  discount_type,
  discount_amount,
  is_active,
  access_duration_days,
  max_uses,
  current_uses
) VALUES (
  'FLIPBOOK2025',
  'fixed',
  70,
  true,
  3650, -- 10 years = practically unlimited
  1000,
  0
) ON CONFLICT (code) DO UPDATE SET
  access_duration_days = 3650,
  is_active = true;