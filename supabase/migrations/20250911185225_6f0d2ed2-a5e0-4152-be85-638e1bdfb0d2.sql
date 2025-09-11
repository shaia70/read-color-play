-- Fix the validate_coupon function to resolve ambiguous column reference
CREATE OR REPLACE FUNCTION public.validate_coupon(coupon_code text)
 RETURNS TABLE(valid boolean, discount_amount numeric, discount_type text, message text, access_duration_days integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  coupon_record RECORD;
  user_already_used BOOLEAN;
BEGIN
  SELECT * INTO coupon_record 
  FROM public.coupons 
  WHERE code = validate_coupon.coupon_code AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::numeric, ''::text, 'קוד קופון לא תקין'::text, 30::integer;
    RETURN;
  END IF;
  
  IF coupon_record.expires_at IS NOT NULL AND coupon_record.expires_at < NOW() THEN
    RETURN QUERY SELECT false, 0::numeric, ''::text, 'קוד הקופון פג תוקף'::text, 30::integer;
    RETURN;
  END IF;
  
  IF coupon_record.max_uses IS NOT NULL AND coupon_record.current_uses >= coupon_record.max_uses THEN
    RETURN QUERY SELECT false, 0::numeric, ''::text, 'קוד הקופון הגיע למספר השימושים המקסימלי'::text, 30::integer;
    RETURN;
  END IF;
  
  -- Fixed: explicitly reference the table column to avoid ambiguity
  SELECT EXISTS(
    SELECT 1 FROM public.coupon_usage cu
    WHERE cu.user_id = auth.uid() AND cu.coupon_code = validate_coupon.coupon_code
  ) INTO user_already_used;
  
  IF user_already_used THEN
    RETURN QUERY SELECT false, 0::numeric, ''::text, 'כבר השתמשת בקופון זה'::text, 30::integer;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT true, coupon_record.discount_amount, coupon_record.discount_type, 'קופון תקין!'::text, COALESCE(coupon_record.access_duration_days, 30)::integer;
END;
$$;