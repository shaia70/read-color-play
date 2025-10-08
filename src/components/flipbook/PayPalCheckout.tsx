
import * as React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomButton } from "../ui/CustomButton";
import { CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { supabase } from "@/integrations/supabase/client";

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
  deliveryMethod?: 'pickup' | 'delivery';
  shippingAddress?: {
    name: string;
    address_line_1: string;
    admin_area_2: string; // City
    postal_code?: string;
    country_code: string;
  };
  productDescription?: string;
  skipAccessCheck?: boolean;
}

const PayPalCheckout = ({ amount, onSuccess, onCancel, onConfirmPayment, deliveryMethod, shippingAddress, productDescription, skipAccessCheck }: PayPalCheckoutProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { verifyPayPalPayment, confirmPaymentCompletion } = usePaymentVerification();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [paypalLoaded, setPaypalLoaded] = React.useState(false);
  const [paypalClientId, setPaypalClientId] = React.useState<string | null>(null);
  const [loadingConfig, setLoadingConfig] = React.useState(true);
  const isHebrew = language === 'he';
  
  // PayPal Smart Buttons setup
  const renderPayPalButtons = () => {
    console.log('=== RENDER PAYPAL BUTTONS ===');
    console.log('paypalLoaded:', paypalLoaded);
    console.log('window.paypal exists:', !!window.paypal);
    console.log('user?.id:', user?.id);
    console.log('amount:', amount);
    
    if (!paypalLoaded) {
      console.log('❌ PayPal not loaded yet');
      return null;
    }
    
    if (!window.paypal) {
      console.log('❌ window.paypal not available');
      return null;
    }
    
    if (!user?.id) {
      console.log('❌ No user ID available');
      return null;
    }

    console.log('✅ All conditions met, creating PayPal buttons...');

    return window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay',
        height: 55
      },
      createOrder: (data: any, actions: any) => {
        console.log('=== PAYPAL CREATE ORDER ===');
        console.log('Amount being sent to PayPal:', amount);
        console.log('Delivery method:', deliveryMethod);
        console.log('Shipping address:', shippingAddress);
        console.log('Product description:', productDescription);
        
        const orderData: any = {
          purchase_units: [{
            amount: {
              value: amount.toString(),
              currency_code: 'ILS'
            },
            description: productDescription || (isHebrew ? 'גישה לספר דיגיטלי' : 'Digital Book Access')
          }],
          application_context: {
            shipping_preference: deliveryMethod === 'delivery' ? 'SET_PROVIDED_ADDRESS' : 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: 'https://example.com/noaccess', // Dummy URL - never used due to onApprove
            cancel_url: 'https://example.com/noaccess'  // Dummy URL - never used due to onCancel
          }
        };

        // Add shipping address if delivery is selected
        if (deliveryMethod === 'delivery' && shippingAddress) {
          orderData.purchase_units[0].shipping = {
            name: {
              full_name: shippingAddress.name
            },
            address: {
              address_line_1: shippingAddress.address_line_1,
              admin_area_2: shippingAddress.admin_area_2,
              postal_code: shippingAddress.postal_code || '',
              country_code: shippingAddress.country_code
            }
          };
        }
        
        return actions.order.create(orderData);
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
          
          // Verify payment with PayPal API and record in our system
          await verifyPayPalPayment(user.id, transactionId, paymentAmount);
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

  // Get PayPal configuration from backend
  React.useEffect(() => {
    const getPayPalConfig = async () => {
      try {
        console.log('=== GETTING PAYPAL CONFIG ===');
        setLoadingConfig(true);
        
        const { data, error } = await supabase.functions.invoke('get-paypal-config');
        
        if (error) {
          console.error('Error getting PayPal config:', error);
          alert(isHebrew ? 'שגיאה בטעינת הגדרות PayPal' : 'Error loading PayPal configuration');
          return;
        }
        
        if (data?.success && data?.clientId) {
          console.log('✅ PayPal Client ID retrieved successfully');
          setPaypalClientId(data.clientId);
        } else {
          console.error('Invalid PayPal config response:', data);
          alert(isHebrew ? 'הגדרות PayPal לא תקינות' : 'Invalid PayPal configuration');
        }
      } catch (error) {
        console.error('Error fetching PayPal config:', error);
        alert(isHebrew ? 'שגיאה בחיבור לשרת' : 'Server connection error');
      } finally {
        setLoadingConfig(false);
      }
    };
    
    getPayPalConfig();
  }, [isHebrew]);

  // Load PayPal SDK when client ID is available
  React.useEffect(() => {
    if (!paypalClientId || loadingConfig) {
      console.log('PayPal Client ID not ready yet:', { paypalClientId, loadingConfig });
      return;
    }
    
    console.log('=== PAYPAL SDK LOADING EFFECT ===');
    console.log('window.paypal exists:', !!window.paypal);
    console.log('paypalLoaded state:', paypalLoaded);
    console.log('Using PayPal Client ID:', paypalClientId);
    
    if (window.paypal) {
      console.log('PayPal SDK already exists, setting loaded to true');
      setPaypalLoaded(true);
      return;
    }

    console.log('Creating PayPal SDK script...');
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=ILS&components=buttons`;
    
    script.onload = () => {
      console.log('✅ PayPal SDK loaded successfully');
      console.log('window.paypal now exists:', !!window.paypal);
      setPaypalLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load PayPal SDK:', error);
      console.error('Script src was:', script.src);
      alert(isHebrew ? 'שגיאה בטעינת מערכת התשלומים - אנא רענן את הדף' : 'Failed to load payment system - please refresh page');
    };
    
    console.log('Adding PayPal script to document head...');
    document.head.appendChild(script);

    return () => {
      console.log('Cleaning up PayPal script...');
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [paypalClientId, loadingConfig, isHebrew, paypalLoaded]);

  // Render PayPal buttons when loaded
  React.useEffect(() => {
    console.log('=== PAYPAL BUTTONS RENDER EFFECT ===');
    console.log('PayPal loaded:', paypalLoaded);
    console.log('User ID:', user?.id);
    console.log('Amount for PayPal:', amount);
    console.log('PayPal Client ID available:', !!paypalClientId);
    
    if (paypalLoaded && user?.id && paypalClientId) {
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      if (paypalButtonContainer) {
        console.log('Clearing and re-rendering PayPal buttons with amount:', amount);
        paypalButtonContainer.innerHTML = '';
        try {
          renderPayPalButtons().render('#paypal-button-container');
        } catch (error) {
          console.error('Error rendering PayPal buttons:', error);
          paypalButtonContainer.innerHTML = '<div class="text-center p-4 bg-red-50 border border-red-200 rounded"><p class="text-red-800">שגיאה בטעינת כפתורי PayPal</p></div>';
        }
      }
    }
  }, [paypalLoaded, user?.id, amount, paypalClientId]);

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
          {loadingConfig ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shelley-blue mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isHebrew ? "טוען הגדרות PayPal..." : "Loading PayPal configuration..."}
              </p>
            </div>
          ) : paypalLoaded ? (
            <div>
              <p className="text-center mb-4 text-gray-700">
                {isHebrew ? "תשלום בכרטיס אשראי או PayPal" : "Pay with Credit Card or PayPal"}
              </p>
              <div id="paypal-button-container" className="w-full min-h-[60px]"></div>
              {isProcessing && (
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600">
                    {isHebrew ? "מעבד תשלום..." : "Processing payment..."}
                  </p>
                </div>
              )}
              {paypalLoaded && !document.getElementById('paypal-button-container')?.innerHTML && (
                <div className="text-center mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    {isHebrew ? "כפתורי PayPal לא נטענו - אנא רענן את הדף" : "PayPal buttons failed to load - please refresh"}
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
              <p className="text-xs text-gray-500 mb-4">
                {isHebrew 
                  ? "אם הטעינה נתקעת, נסה לרענן את הדף או לחץ על הכפתור למטה"
                  : "If loading is stuck, try refreshing the page or click the button below"
                }
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-shelley-blue text-white rounded hover:bg-shelley-blue/80 transition-colors"
              >
                {isHebrew ? "רענן דף" : "Refresh Page"}
              </button>
            </div>
          )}

          {!skipAccessCheck && (
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
          )}
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
