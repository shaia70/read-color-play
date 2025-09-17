
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomButton } from "../ui/CustomButton";
import { CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";

// PayPal SDK types
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => {
        render: (selector: string) => void;
      };
    };
  }
}

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  onConfirmPayment: (userId: string) => Promise<void>;
}

const PayPalCheckout = ({ amount, onSuccess, onCancel, onConfirmPayment }: PayPalCheckoutProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { recordPayment, confirmPaymentCompletion } = usePaymentVerification();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const isHebrew = language === 'he';
  
  // PayPal Smart Buttons setup
  const renderPayPalButtons = () => {
    if (!paypalLoaded || !window.paypal || !user?.id) return null;

    return window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay',
        height: 55
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toString(),
              currency_code: 'ILS'
            },
            description: isHebrew ? 'גישה לספר דיגיטלי' : 'Digital Book Access'
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        setIsProcessing(true);
        try {
          console.log('PayPal payment approved:', data);
          
          // Capture the payment
          const order = await actions.order.capture();
          console.log('PayPal order captured:', order);
          
          const transactionId = order.id;
          const paymentAmount = parseFloat(order.purchase_units[0].amount.value);
          
          // Record payment in our system
          await recordPayment(user.id, transactionId, paymentAmount);
          onSuccess();
          
        } catch (error) {
          console.error('PayPal payment processing failed:', error);
          alert(isHebrew ? 'שגיאה בעיבוד התשלום. אנא נסה שוב.' : 'Payment processing failed. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert(isHebrew ? 'שגיאה בתהליך התשלום' : 'Payment process error');
        setIsProcessing(false);
      },
      onCancel: () => {
        console.log('PayPal payment cancelled');
        setIsProcessing(false);
      }
    });
  };

  // Load PayPal SDK
  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    // Using PayPal sandbox client ID for testing
    script.src = 'https://www.paypal.com/sdk/js?client-id=ATseWJk1Mz_1Y5pOdBGdz7Fz8gJl4n8qVtGJmQD8cJGTVvK_J7RQpbXKm8GqQr7gQn5RnMzQ5FZQ1Vz5&currency=ILS&components=buttons';
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      setPaypalLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      alert(isHebrew ? 'שגיאה בטעינת מערכת התשלומים' : 'Failed to load payment system');
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [isHebrew]);

  // Render PayPal buttons when loaded
  useEffect(() => {
    if (paypalLoaded && user?.id) {
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      if (paypalButtonContainer) {
        paypalButtonContainer.innerHTML = '';
        renderPayPalButtons().render('#paypal-button-container');
      }
    }
  }, [paypalLoaded, user?.id, amount]);

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
      await confirmPaymentCompletion(user.id);
      
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
          {paypalLoaded ? (
            <div>
              <p className="text-center mb-4 text-gray-700">
                {isHebrew ? "תשלום בכרטיס אשראי או PayPal" : "Pay with Credit Card or PayPal"}
              </p>
              <div id="paypal-button-container" className="w-full"></div>
              {isProcessing && (
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600">
                    {isHebrew ? "מעבד תשלום..." : "Processing payment..."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shelley-blue mx-auto mb-4"></div>
              <p className="text-gray-600 mb-4">
                {isHebrew ? "מערכת תשלומים טוען..." : "Payment system loading..."}
              </p>
              <p className="text-xs text-gray-500">
                {isHebrew 
                  ? "אם הטעינה נתקעת, נסה לרענן את הדף"
                  : "If loading is stuck, try refreshing the page"
                }
              </p>
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
                ? "🔒 המערכת מטפלת בכל התשלום אוטומטית ובטוח דרך PayPal. פשוט לחץ על כפתור התשלום ותקבל גישה מיד לאחר אישור התשלום."
                : "🔒 The system handles all payments automatically and securely through PayPal. Simply click the payment button and get access immediately after payment approval."
              }
            </p>
          </div>
      </div>
    </div>
  );
};

export default PayPalCheckout;
