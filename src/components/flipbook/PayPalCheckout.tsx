
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomButton } from "../ui/CustomButton";
import { CreditCard, ExternalLink } from "lucide-react";

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PayPalCheckout = ({ amount, onSuccess, onCancel }: PayPalCheckoutProps) => {
  const { language } = useLanguage();
  const isHebrew = language === 'he';

  // יצירת return URL שמחזיר לעמוד הפליפבוק
  const returnUrl = encodeURIComponent(`${window.location.origin}/flipbook?payment=success`);
  const cancelUrl = encodeURIComponent(`${window.location.origin}/flipbook?payment=cancel`);
  
  // לינק PayPal עם return URLs
  const paypalLink = `https://www.paypal.com/ncp/payment/A56X3XMDJAEEC?return=${returnUrl}&cancel_return=${cancelUrl}`;

  const handlePayPalClick = () => {
    // פתיחת לינק PayPal בחלון חדש
    window.open(paypalLink, '_blank');
    
    // הצגת הודעה למשתמש
    console.log("Opening PayPal payment link with return URL");
  };

  const handlePaymentConfirmation = () => {
    // כאן המשתמש מאשר שהוא ביצע את התשלום
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 text-center">
          {isHebrew ? "תשלום באמצעות PayPal" : "Payment via PayPal"}
        </h3>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-shelley-green mb-2">
            ${amount}
          </div>
          <p className="text-gray-600">
            {isHebrew 
              ? "לחץ על הכפתור למעבר לתשלום PayPal" 
              : "Click the button to proceed to PayPal payment"
            }
          </p>
        </div>

        <div className="space-y-4">
          <CustomButton 
            variant="blue" 
            size="lg" 
            icon={<ExternalLink className="w-6 h-6" />} 
            className="w-full text-base py-3 h-14 min-h-0 font-bold"
            onClick={handlePayPalClick}
          >
            {isHebrew ? "תשלום PayPal" : "Pay with PayPal"}
          </CustomButton>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3 text-center">
              {isHebrew 
                ? "או לחץ כאן אם כבר השלמת את התשלום:"
                : "Or click here if you've already completed payment:"
              }
            </p>
            
            <CustomButton 
              variant="green" 
              size="lg" 
              icon={<CreditCard className="w-6 h-6" />} 
              className="w-full text-base py-3 h-14 min-h-0 font-bold"
              onClick={handlePaymentConfirmation}
            >
              {isHebrew ? "אישור השלמת התשלום" : "Confirm Payment Completed"}
            </CustomButton>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="mt-4 text-gray-500 hover:text-gray-700 underline text-sm block mx-auto"
        >
          {isHebrew ? "ביטול" : "Cancel"}
        </button>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {isHebrew 
              ? "💡 לאחר התשלום תועבר אוטומטית חזרה לעמוד זה. אם זה לא קורה, לחץ על 'אישור השלמת התשלום'"
              : "💡 After payment you'll be automatically redirected back to this page. If not, click 'Confirm Payment Completed'"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayPalCheckout;
