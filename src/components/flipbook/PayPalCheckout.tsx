
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomButton } from "../ui/CustomButton";
import { CreditCard, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onConfirmPayment: (userId: string) => Promise<void>;
}

const PayPalCheckout = ({ amount, onSuccess, onCancel, onConfirmPayment }: PayPalCheckoutProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { recordPayment } = usePaymentVerification();
  const [isProcessing, setIsProcessing] = useState(false);
  const isHebrew = language === 'he';

  const returnUrl = encodeURIComponent(`${window.location.origin}/flipbook?payment=success`);
  const cancelUrl = encodeURIComponent(`${window.location.origin}/flipbook?payment=cancel`);
  
  // TODO: Replace with correct PayPal payment ID for 60 NIS
  // Current ID might be configured for 70 NIS - needs updating from PayPal dashboard
  const paypalLink = `https://www.paypal.com/ncp/payment/UPDATE_WITH_CORRECT_ID?return=${returnUrl}&cancel_return=${cancelUrl}`;

  // Check for PayPal success on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success' && user?.id && !isProcessing) {
      console.log('PayPal success detected, auto-recording payment...');
      handleAutoPaymentRecord();
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user?.id]);

  const handleAutoPaymentRecord = async () => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    try {
      const transactionId = `paypal_auto_${Date.now()}_${user.id.slice(0, 8)}`;
      console.log('Auto-recording PayPal payment:', { userId: user.id, transactionId, amount });
      
      await recordPayment(user.id, transactionId, amount);
      onSuccess();
    } catch (error) {
      console.error('Auto payment recording failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalClick = () => {
    window.open(paypalLink, '_blank');
    console.log("Opening PayPal payment link");
  };

  const handlePaymentConfirmation = async () => {
    if (!user?.id) {
      console.error('No user ID available');
      alert(isHebrew ? 'לא נמצא משתמש מחובר' : 'No user logged in');
      return;
    }

    setIsProcessing(true);
    console.log('=== MANUAL PAYMENT CONFIRMATION ===');
    console.log('User ID:', user.id);
    
    try {
      await onConfirmPayment(user.id);
      onSuccess();
      
    } catch (err) {
      console.error('Confirmation error:', err);
      // Don't show generic alert, the hook will show appropriate toast messages
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4 text-center">
          {isHebrew ? "תשלום באמצעות PayPal" : "Payment via PayPal"}
        </h3>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-shelley-green mb-2">
            {amount} ₪
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
                ? "רק אם השלמת תשלום ב-PayPal:"
                : "Only if you completed payment via PayPal:"
              }
            </p>
            
            <CustomButton 
              variant="green" 
              size="lg" 
              icon={<CreditCard className="w-6 h-6" />} 
              className="w-full text-base py-3 h-14 min-h-0 font-bold"
              onClick={handlePaymentConfirmation}
              disabled={isProcessing}
            >
              {isProcessing 
                ? (isHebrew ? "בודק..." : "Checking...")
                : (isHebrew ? "בדיקת תשלום במערכת" : "Check Payment in System")
              }
            </CustomButton>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="mt-4 text-gray-500 hover:text-gray-700 underline text-sm block mx-auto"
        >
          {isHebrew ? "ביטול" : "Cancel"}
        </button>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            {isHebrew 
              ? "⚠️ הכפתור 'בדיקת תשלום במערכת' רק בודק אם יש תשלום קיים - הוא לא יוצר תשלום חדש!"
              : "⚠️ The 'Check Payment in System' button only verifies existing payments - it doesn't create new ones!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayPalCheckout;
