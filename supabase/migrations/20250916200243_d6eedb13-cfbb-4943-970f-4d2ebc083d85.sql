-- Create a function to reset user testing data (admin only)
CREATE OR REPLACE FUNCTION public.reset_user_testing_data(p_user_name text, p_coupon_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  target_user_id UUID;
BEGIN
  -- Only allow admins or service role to reset testing data
  IF auth.uid() IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Access denied: Only admins can reset testing data';
    END IF;
  END IF;

  -- Get the user ID
  SELECT id INTO target_user_id FROM public.users WHERE name = p_user_name;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: %', p_user_name;
  END IF;

  -- Delete coupon usage records
  DELETE FROM public.coupon_usage 
  WHERE user_id = target_user_id AND coupon_code = p_coupon_code;
  
  -- Reset user access
  UPDATE public.users 
  SET 
    has_paid = false,
    paid_for_flipbook = false,
    paid_for_bina = false,
    access_expires_at = NULL,
    flipbook_access_expires_at = NULL,
    bina_access_expires_at = NULL,
    access_granted_at = NULL,
    flipbook_access_granted_at = NULL,
    bina_access_granted_at = NULL,
    payment_amount = NULL
  WHERE id = target_user_id;
  
  -- Log the reset action
  PERFORM public.log_security_event(
    'reset_user_testing_data',
    'users',
    jsonb_build_object(
      'target_user', target_user_id,
      'user_name', p_user_name,
      'coupon_code', p_coupon_code,
      'reset_by', auth.uid()
    )
  );
  
  RAISE LOG 'Reset testing data for user % with coupon %', p_user_name, p_coupon_code;
END;
$function$;

-- Reset the specific user's testing data
SELECT public.reset_user_testing_data('דוני סימון', 'FLIPBOOK5NIS');