
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PayPalCheckout = ({ amount, onSuccess, onCancel }: PayPalCheckoutProps) => {
  const { language } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const isHebrew = language === 'he';

  // PayPal Client ID - זה צריך להיות מוגדר במשתני הסביבה
  const paypalClientId = "YOUR_PAYPAL_CLIENT_ID"; // זה צריך להיות מוחלף במפתח האמיתי

  const initialOptions = {
    "client-id": paypalClientId,
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="max-w-md mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: "USD",
                  },
                  description: isHebrew ? "דניאל הולך לגן - פליפבוק דיגיטלי" : "Daniel Goes to Kindergarten - Digital Flipbook",
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              const details = await actions.order!.capture();
              console.log("Payment successful:", details);
              
              // כאן ניתן לשלוח את פרטי התשלום לשרת לאימות
              // לעת עתה פשוט נקרא לפונקציית ההצלחה
              onSuccess();
            } catch (error) {
              console.error("Payment capture error:", error);
              setError(isHebrew ? "שגיאה בעיבוד התשלום" : "Payment processing error");
            }
          }}
          onError={(error) => {
            console.error("PayPal error:", error);
            setError(isHebrew ? "שגיאה בתשלום PayPal" : "PayPal payment error");
          }}
          onCancel={() => {
            console.log("Payment cancelled");
            onCancel();
          }}
        />
      </PayPalScriptProvider>
      
      <button
        onClick={onCancel}
        className="mt-4 text-gray-500 hover:text-gray-700 underline text-sm"
      >
        {isHebrew ? "ביטול" : "Cancel"}
      </button>
    </div>
  );
};

export default PayPalCheckout;
