-- Add service_type to coupons table to distinguish between flipbook and physical book coupons
ALTER TABLE public.coupons 
ADD COLUMN IF NOT EXISTS service_type text NOT NULL DEFAULT 'flipbook';

-- Add check constraint for service_type
ALTER TABLE public.coupons 
DROP CONSTRAINT IF EXISTS coupons_service_type_check;

ALTER TABLE public.coupons 
ADD CONSTRAINT coupons_service_type_check 
CHECK (service_type IN ('flipbook', 'physical_book', 'both'));

-- Create index for faster lookups by service type
CREATE INDEX IF NOT EXISTS idx_coupons_service_type 
ON public.coupons(service_type, is_active);

-- Update validate_coupon function to check service_type
CREATE OR REPLACE FUNCTION public.validate_coupon(coupon_code text, p_service_type text DEFAULT 'flipbook')
RETURNS TABLE(valid boolean, discount_amount numeric, discount_type text, message text, access_duration_days integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  coupon_record RECORD;
  user_already_used BOOLEAN;
BEGIN
  SELECT * INTO coupon_record 
  FROM public.coupons 
  WHERE code = validate_coupon.coupon_code 
    AND is_active = true
    AND (service_type = p_service_type OR service_type = 'both');
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::numeric, ''::text, 'קוד קופון לא תקין או לא מתאים לשירות זה'::text, 30::integer;
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
$function$;

-- Insert 3 new coupons for physical book
-- 1. 25% discount coupon
INSERT INTO public.coupons (code, discount_amount, discount_type, service_type, is_active, access_duration_days)
VALUES ('PHYSICALBOOK25', 25, 'percentage', 'physical_book', true, 30)
ON CONFLICT (code) DO UPDATE SET
  discount_amount = 25,
  discount_type = 'percentage',
  service_type = 'physical_book',
  is_active = true;

-- 2. 50 NIS discount coupon
INSERT INTO public.coupons (code, discount_amount, discount_type, service_type, is_active, access_duration_days)
VALUES ('PHYSICALBOOK50NIS', 5000, 'fixed', 'physical_book', true, 30)
ON CONFLICT (code) DO UPDATE SET
  discount_amount = 5000,
  discount_type = 'fixed',
  service_type = 'physical_book',
  is_active = true;

-- 3. Testing coupon - reduces price to 7 NIS (89 - 82 = 7)
INSERT INTO public.coupons (code, discount_amount, discount_type, service_type, is_active, access_duration_days)
VALUES ('PHYSICALBOOKTEST7', 8200, 'fixed', 'physical_book', true, 30)
ON CONFLICT (code) DO UPDATE SET
  discount_amount = 8200,
  discount_type = 'fixed',
  service_type = 'physical_book',
  is_active = true;