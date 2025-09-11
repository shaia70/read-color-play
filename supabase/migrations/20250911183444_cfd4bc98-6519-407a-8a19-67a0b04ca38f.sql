-- Create a test coupon for free access
INSERT INTO public.coupons (
  code,
  discount_type,
  discount_amount,
  is_active,
  access_duration_days,
  max_uses,
  current_uses
) VALUES (
  'FREE2025',
  'fixed',
  70,
  true,
  30,
  100,
  0
) ON CONFLICT (code) DO NOTHING;