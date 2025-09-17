
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
  const [paymentId, setPaymentId] = useState('');
  const [showPaymentIdInput, setShowPaymentIdInput] = useState(false);
  const isHebrew = language === 'he';

  const returnUrl = `${window.location.origin}/flipbook?payment=success`;
  const cancelUrl = `${window.location.origin}/flipbook`;
  
  // PayPal Smart Payment Buttons setup - no return URL needed
  const getPayPalLink = (amount: number) => {
    // Create a secure payment session that doesn't rely on URL params
    if (amount <= 5) {
      // PayPal link for 5 NIS discount price - removed return URLs
      return `https://www.paypal.com/ncp/payment/CQXVLC4MF9E3N`;
    }
    // Default PayPal link for 60 NIS - removed return URLs  
    return `https://www.paypal.com/ncp/payment/A56X3XMDJAEEC`;
  };
  
  const paypalLink = getPayPalLink(amount);

  // Remove all URL-based payment detection - security vulnerability
  useEffect(() => {
    // Clean any payment parameters from URL on component mount
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('payment') || urlParams.has('paymentId') || urlParams.has('PayerID') || urlParams.has('token')) {
      console.log('SECURITY: Removing payment parameters from URL');
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

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
    setShowPaymentIdInput(true);
    console.log("Opening PayPal payment link - user will need to enter payment ID manually");
  };

  const handlePayPalVerificationWithId = async () => {
    if (!user?.id) {
      alert(isHebrew ? 'לא נמצא משתמש מחובר' : 'No user logged in');
      return;
    }

    if (!paymentId.trim()) {
      alert(isHebrew ? 'אנא הזן את מזהה התשלום מPayPal' : 'Please enter the PayPal payment ID');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Verifying PayPal payment with ID:', { userId: user.id, paymentId, amount });
      
      const verified = await verifyPayPalPayment(user.id, paymentId.trim(), amount);
      if (verified) {
        onSuccess();
      } else {
        alert(isHebrew ? 'אימות התשלום נכשל. ודא שמזהה התשלום נכון.' : 'Payment verification failed. Please check the payment ID.');
      }
    } catch (error) {
      console.error('PayPal verification failed:', error);
      alert(isHebrew ? 'שגיאה באימות התשלום. אנא בדוק את מזהה התשלום.' : 'Payment verification error. Please check the payment ID.');
    } finally {
      setIsProcessing(false);
    }
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

          {showPaymentIdInput && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3 text-center">
                {isHebrew 
                  ? "לאחר השלמת התשלום בPayPal, הזן את מזהה התשלום (Payment ID) כאן:"
                  : "After completing PayPal payment, enter the Payment ID here:"
                }
              </p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder={isHebrew ? "מזהה תשלום מPayPal" : "PayPal Payment ID"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
                
                <CustomButton 
                  variant="green" 
                  size="lg" 
                  icon={<CreditCard className="w-6 h-6" />} 
                  className="w-full text-base py-3 h-14 min-h-0 font-bold"
                  onClick={handlePayPalVerificationWithId}
                  disabled={isProcessing || !paymentId.trim()}
                >
                  {isProcessing 
                    ? (isHebrew ? "מאמת תשלום..." : "Verifying Payment...")
                    : (isHebrew ? "אמת תשלום PayPal" : "Verify PayPal Payment")
                  }
                </CustomButton>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3 text-center">
              {isHebrew 
                ? "אם יש לך גישה קיימת - בדוק במערכת:"
                : "If you have existing access - check in system:"
              }
            </p>
            
            <CustomButton 
              variant="outline" 
              size="lg" 
              icon={<CreditCard className="w-6 h-6" />} 
              className="w-full text-base py-3 h-14 min-h-0 font-bold"
              onClick={handlePaymentConfirmation}
              disabled={isProcessing}
            >
              {isProcessing 
                ? (isHebrew ? "בודק..." : "Checking...")
                : (isHebrew ? "בדיקת גישה קיימת" : "Check Existing Access")
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
                ? "🔒 המערכת מאמתת כל תשלום ישירות מול PayPal API. לאחר התשלום, תקבל מזהה תשלום (Payment ID) שיש להזין לאימות. גישה מותרת רק לאחר אימות מלא של התשלום."
                : "🔒 The system verifies every payment directly with PayPal API. After payment, you'll receive a Payment ID that must be entered for verification. Access is granted only after full payment verification."
              }
            </p>
            {showPaymentIdInput && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-800">
                  {isHebrew 
                    ? "💡 איך למצוא את מזהה התשלום: לאחר התשלום בPayPal, חפש ב'Transaction ID' או 'Payment ID' במייל האישור או בהיסטוריית התשלומים"
                    : "💡 How to find Payment ID: After PayPal payment, look for 'Transaction ID' or 'Payment ID' in confirmation email or payment history"
                  }
                </p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default PayPalCheckout;
