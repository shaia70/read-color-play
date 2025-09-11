-- Grant unlimited access to paying users
UPDATE public.users 
SET 
  access_expires_at = NOW() + INTERVAL '100 years',
  access_duration_days = 36500, -- 100 years
  updated_at = NOW()
WHERE email IN ('shelley3@gmail.com', 'shai.aharonov@gmail.com') 
  AND has_paid = true;