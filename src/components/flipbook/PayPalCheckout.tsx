
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomButton } from "../ui/CustomButton";
import { CreditCard, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { supabase } from "@/integrations/supabase/client";

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onConfirmPayment: (userId: string) => Promise<void>;
}

const PayPalCheckout = ({ amount, onSuccess, onCancel, onConfirmPayment }: PayPalCheckoutProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { verifyPayPalPayment } = usePaymentVerification();
  const [isProcessing, setIsProcessing] = useState(false);
  const isHebrew = language === 'he';

  const returnUrl = `${window.location.origin}/flipbook?payment=success`;
  const cancelUrl = `${window.location.origin}/flipbook`;
  
  // Dynamic PayPal payment links based on amount
  const getPayPalLink = (amount: number) => {
    // Different PayPal payment links for different amounts
    if (amount <= 5) {
      // PayPal link for 5 NIS discount price
      return `https://www.paypal.com/ncp/payment/CQXVLC4MF9E3N?return=${returnUrl}&cancel_return=${cancelUrl}`;
    }
    // Default PayPal link for 60 NIS
    return `https://www.paypal.com/ncp/payment/A56X3XMDJAEEC?return=${returnUrl}&cancel_return=${cancelUrl}`;
  };
  
  const paypalLink = getPayPalLink(amount);

  // Check for PayPal success on component mount and verify with PayPal API
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const paymentId = urlParams.get('paymentId') || urlParams.get('PayerID') || urlParams.get('token'); // PayPal sends different params
    
    if (paymentStatus === 'success' && user?.id && !isProcessing) {
      console.log('PayPal success detected, checking for payment ID...');
      
      if (paymentId) {
        console.log('PayPal payment ID found, verifying with PayPal API:', paymentId);
        handlePayPalVerification(paymentId);
      } else {
        console.error('No PayPal payment ID found in URL - cannot verify payment without valid payment ID');
        alert(isHebrew ? 'לא נמצא מזהה תשלום מפייפאל. אנא בצע תשלום מחדש.' : 'No PayPal payment ID found. Please make payment again.');
      }
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user?.id, isProcessing]);

  const handlePayPalVerification = async (paymentId: string) => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    try {
      console.log('Verifying PayPal payment:', { userId: user.id, paymentId, amount });
      
      const verified = await verifyPayPalPayment(user.id, paymentId, amount);
      if (verified) {
        onSuccess();
      } else {
        alert(isHebrew ? 'אימות התשלום נכשל. אנא בצע תשלום מחדש.' : 'Payment verification failed. Please make payment again.');
      }
    } catch (error) {
      console.error('PayPal verification failed:', error);
      alert(isHebrew ? 'שגיאה באימות התשלום. אנא בצע תשלום מחדש.' : 'Payment verification error. Please make payment again.');
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
          {isHebrew ? "תשלום באמצעות כרטיס אשראי או PayPal" : "Payment via Credit Card or PayPal"}
        </h3>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-shelley-green mb-2">
            {amount} ₪
          </div>
          <p className="text-gray-600">
            {isHebrew 
              ? "לחץ על הכפתור למעבר לתשלום" 
              : "Click the button to proceed to payment"
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
            {isHebrew ? "תשלום בכרטיס אשראי או PayPal" : "Pay with Credit Card or PayPal"}
          </CustomButton>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3 text-center">
              {isHebrew 
                ? "רק אם השלמת תשלום בכרטיס אשראי או PayPal:"
                : "Only if you completed payment via Credit Card or PayPal:"
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

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              {isHebrew 
                ? "🔒 המערכת מאמתת כל תשלום ישירות מול PayPal API. גישה מותרת רק לאחר אימות מלא של התשלום."
                : "🔒 The system verifies every payment directly with PayPal API. Access is granted only after full payment verification."
              }
            </p>
          </div>
      </div>
    </div>
  );
};

export default PayPalCheckout;
