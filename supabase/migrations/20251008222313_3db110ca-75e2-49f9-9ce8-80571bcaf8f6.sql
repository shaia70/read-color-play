-- Get the user ID for agdlsakgasdlgsdjlkg
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user by name
  SELECT id INTO target_user_id FROM public.users WHERE name = 'agdlsakgasdlgsdjlkg';
  
  IF target_user_id IS NULL THEN
    RAISE NOTICE 'User not found: agdlsakgasdlgsdjlkg';
  ELSE
    -- Delete the coupon usage record
    DELETE FROM public.coupon_usage 
    WHERE user_id = target_user_id 
      AND coupon_code = 'FLIPBOOK5NIS';
    
    -- Reset the user's flipbook access if it was granted by this coupon
    UPDATE public.users 
    SET 
      paid_for_flipbook = false,
      flipbook_access_expires_at = NULL,
      flipbook_access_granted_at = NULL,
      has_paid = (paid_for_bina = true), -- Keep has_paid true if they paid for bina
      access_expires_at = CASE 
        WHEN paid_for_bina = true THEN bina_access_expires_at
        ELSE NULL
      END
    WHERE id = target_user_id;
    
    RAISE NOTICE 'Coupon FLIPBOOK5NIS removed for user agdlsakgasdlgsdjlkg';
  END IF;
END $$;