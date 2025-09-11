-- Create a specific function for coupon redemption that doesn't require admin/teacher roles
CREATE OR REPLACE FUNCTION public.redeem_coupon_access(
  p_user_id uuid, 
  p_duration_days integer, 
  p_coupon_code text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- This function is specifically for coupon redemption and doesn't require special roles
  -- Only allow authenticated users to redeem coupons for themselves
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied: can only redeem coupons for yourself';
  END IF;

  -- Validate duration - allow up to 10 years for permanent access coupons
  IF p_duration_days IS NULL OR p_duration_days < 1 OR p_duration_days > 3650 THEN
    RAISE EXCEPTION 'Invalid duration_days: % (must be 1-3650)', p_duration_days;
  END IF;

  -- Grant access to the user
  UPDATE public.users 
  SET 
    access_granted_at = NOW(),
    access_expires_at = NOW() + INTERVAL '1 day' * p_duration_days,
    access_duration_days = p_duration_days,
    payment_amount = 0, -- Free via coupon
    has_paid = true,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Log the coupon redemption
  PERFORM public.log_security_event(
    'coupon_redeemed',
    'users',
    jsonb_build_object(
      'user_id', p_user_id,
      'coupon_code', p_coupon_code,
      'duration_days', p_duration_days,
      'access_expires_at', NOW() + INTERVAL '1 day' * p_duration_days
    )
  );
END;
$$;