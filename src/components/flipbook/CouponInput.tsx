import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomButton } from "../ui/CustomButton";
import { Input } from "../ui/input";
import { Gift, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CouponInputProps {
  userId: string;
  onSuccess: () => void;
}

const CouponInput = ({ userId, onSuccess }: CouponInputProps) => {
  const { language } = useLanguage();
  const [couponCode, setCouponCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const isHebrew = language === 'he';

  const handleCouponSubmit = async () => {
    if (!couponCode.trim()) {
      toast({
        variant: "destructive",
        title: isHebrew ? 'שגיאה' : 'Error',
        description: isHebrew ? 'אנא הכנס קוד קופון' : 'Please enter coupon code'
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('=== VALIDATING COUPON ===');
      console.log('Coupon code:', couponCode);
      console.log('User ID:', userId);

      // Validate the coupon using the database function
      const { data: validationResult, error: validationError } = await supabase
        .rpc('validate_coupon', { coupon_code: couponCode.trim() });

      console.log('Coupon validation result:', { validationResult, validationError });

      if (validationError) {
        throw validationError;
      }

      if (!validationResult || validationResult.length === 0) {
        throw new Error('No validation result returned');
      }

      const result = validationResult[0];
      
      if (!result.valid) {
        toast({
          variant: "destructive",
          title: isHebrew ? 'קוד קופון לא תקין' : 'Invalid coupon code',
          description: result.message || (isHebrew ? 'קוד הקופון לא תקף' : 'Coupon code is not valid')
        });
        return;
      }

      // Grant access to the user using the coupon-specific function
      console.log('Granting access with coupon:', result);
      
      const { error: accessError } = await supabase
        .rpc('redeem_coupon_access', {
          p_user_id: userId,
          p_duration_days: result.access_duration_days || 30,
          p_coupon_code: couponCode.trim()
        });

      if (accessError) {
        throw accessError;
      }

      // Record coupon usage
      const { error: usageError } = await supabase
        .from('coupon_usage')
        .insert({
          user_id: userId,
          coupon_code: couponCode.trim()
        });

      if (usageError) {
        console.error('Error recording coupon usage:', usageError);
        // Don't throw - access was already granted
      }

      // Note: Coupon usage count should be updated by a database trigger or function

      toast({
        title: isHebrew ? 'קופון הופעל בהצלחה!' : 'Coupon activated successfully!',
        description: isHebrew 
          ? `קיבלת גישה חינמית לתוכן ל-${result.access_duration_days || 30} ימים`
          : `You received free access to content for ${result.access_duration_days || 30} days`
      });

      onSuccess();
      
    } catch (error) {
      console.error('Coupon processing error:', error);
      
      toast({
        variant: "destructive",
        title: isHebrew ? 'שגיאה בעיבוד הקופון' : 'Coupon processing error',
        description: isHebrew 
          ? 'אירעה שגיאה בעיבוד הקופון. נסה שוב.'
          : 'An error occurred while processing the coupon. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mb-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-shelley-green" />
          <h3 className="text-lg font-bold">
            {isHebrew ? "יש לך קוד קופון?" : "Have a coupon code?"}
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder={isHebrew ? "הכנס קוד קופון" : "Enter coupon code"}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="text-center font-mono"
              disabled={isProcessing}
            />
          </div>
          
          <CustomButton 
            variant="green" 
            size="lg" 
            icon={isProcessing ? <Loader className="w-5 h-5 animate-spin" /> : <Gift className="w-5 h-5" />}
            className="w-full"
            onClick={handleCouponSubmit}
            disabled={isProcessing || !couponCode.trim()}
          >
            {isProcessing 
              ? (isHebrew ? "מעבד..." : "Processing...")
              : (isHebrew ? "הפעל קופון" : "Activate Coupon")
            }
          </CustomButton>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          {isHebrew 
            ? "קופון תקף יעניק לך גישה חינמית לתוכן"
            : "Valid coupon will grant you free access to content"
          }
        </p>
      </div>
    </div>
  );
};

export default CouponInput;