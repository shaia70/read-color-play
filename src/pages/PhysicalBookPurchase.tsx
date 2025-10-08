
import { motion } from "framer-motion";
import * as React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Lock, CreditCard, LogOut, RefreshCw, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PayPalCheckout from "@/components/flipbook/PayPalCheckout";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import CouponInput from "@/components/flipbook/CouponInput";
import { useUrlSecurity } from "@/hooks/useUrlSecurity";

const PhysicalBookPurchase = () => {
  // SECURITY: Remove suspicious URL parameters to prevent bypass
  useUrlSecurity();
  
  const { t, language } = useLanguage();
  const { user, session, logout } = useAuth();
  const { hasValidPayment, isLoading: paymentLoading, error, checkPaymentStatus, confirmPaymentCompletion, verifyPayPalPayment } = usePaymentVerification();
  const [showPayment, setShowPayment] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [appliedDiscount, setAppliedDiscount] = React.useState<{amount: number, newPrice: number, couponCode: string} | null>(() => {
    // Try to restore discount from sessionStorage
    try {
      const savedDiscount = sessionStorage.getItem('physicalBookDiscount');
      if (savedDiscount) {
        const parsed = JSON.parse(savedDiscount);
        console.log('Restored physical book discount from sessionStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing saved discount:', error);
      sessionStorage.removeItem('physicalBookDiscount');
    }
    return null;
  });

  const hasCheckedPayment = React.useRef(false);
  const hasProcessedPayPalReturn = React.useRef(false);
  const isHebrew = language === 'he';

  // Fixed price for physical book
  const originalPrice = 89;
  const currentPrice = appliedDiscount?.newPrice || originalPrice;
  const bookPrice = `${currentPrice} ₪`;
  const paymentAmount = currentPrice;
  const bookTitle = isHebrew ? "דניאל הולך לגן - ספר פיזי" : "Daniel Goes to Kindergarten - Physical Book";

  // Debug logging for price calculations
  React.useEffect(() => {
    console.log('=== PHYSICAL BOOK PRICE CALCULATION ===');
    console.log('Applied discount:', appliedDiscount);
    console.log('Original price:', originalPrice);
    console.log('Current price:', currentPrice);
    console.log('Payment amount:', paymentAmount);
  }, [appliedDiscount, currentPrice, paymentAmount]);

  // Check payment status when user logs in
  React.useEffect(() => {
    if (user?.id && !hasCheckedPayment.current && !paymentLoading) {
      hasCheckedPayment.current = true;
      checkPaymentStatus(user.id);
    }
  }, [user?.id, checkPaymentStatus, paymentLoading]);

  // Reset check flag when user changes
  React.useEffect(() => {
    if (!user) {
      hasCheckedPayment.current = false;
    }
  }, [user]);

  const handleRefreshPayment = async () => {
    if (!user?.id || paymentLoading) {
      return;
    }
    
    setIsRefreshing(true);
    hasCheckedPayment.current = false;
    
    try {
      await checkPaymentStatus(user.id);
    } finally {
      setIsRefreshing(false);
    }
  };

  const pageTitle = isHebrew 
    ? "רכישת ספר פיזי | שלי ספרים - דניאל הולך לגן" 
    : "Physical Book Purchase | Shelley Books - Daniel Goes to Kindergarten";
    
  const pageDescription = isHebrew
    ? "רכשו את הספר הפיזי 'דניאל הולך לגן' במחיר מיוחד. משלוח לכל הארץ"
    : "Purchase the physical book 'Daniel Goes to Kindergarten' at a special price. Shipping nationwide";

  const handleConfirmPayment = async (userId: string) => {
    await confirmPaymentCompletion(userId);
  };

  const handleDiscountApplied = (discountAmount: number, newPrice: number, couponCode: string) => {
    console.log('=== PHYSICAL BOOK DISCOUNT APPLIED ===');
    console.log('Discount amount:', discountAmount);
    console.log('New price:', newPrice);
    console.log('Coupon code:', couponCode);
    
    const discountData = { amount: discountAmount, newPrice, couponCode };
    setAppliedDiscount(discountData);
    
    // Save to sessionStorage
    sessionStorage.setItem('physicalBookDiscount', JSON.stringify(discountData));
    console.log('Physical book discount saved to sessionStorage:', discountData);
  };

  const handlePaymentSuccess = () => {
    console.log('=== PHYSICAL BOOK PAYMENT SUCCESS ===');
    setShowPayment(false);
    
    // Clear the discount after successful payment
    setAppliedDiscount(null);
    sessionStorage.removeItem('physicalBookDiscount');
  };

  // If user is not logged in, show login form
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <link rel="canonical" href={isHebrew ? "https://shelley.co.il/physical-book" : "https://shelley.co.il/en/physical-book"} />
        </Helmet>
        
        <Header />
        <main className="pt-28 pb-20">
          <div className="page-container">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-6">
                {isHebrew ? "רכישת ספר פיזי" : "Physical Book Purchase"}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {isHebrew 
                  ? "נדרשת התחברות או הרשמה כדי לרכוש את הספר"
                  : "Login or register required to purchase the book"
                }
              </p>
            </div>
            <LoginForm />
          </div>
        </main>
        <Footer />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={isHebrew ? "https://shelley.co.il/physical-book" : "https://shelley.co.il/en/physical-book"} />
      </Helmet>
      
      <Header />
      <main className="pt-28 pb-20">
        <div className="page-container">
          {/* Action buttons */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <CustomButton
                variant="outline"
                size="sm"
                icon={<RefreshCw className={`w-4 h-4 ${isRefreshing || paymentLoading ? 'animate-spin' : ''}`} />}
                onClick={handleRefreshPayment}
                disabled={isRefreshing || paymentLoading}
              >
                {isHebrew ? 'רענון סטטוס' : 'Refresh Status'}
              </CustomButton>
            </div>
            
            <CustomButton
              variant="outline"
              size="sm"
              icon={<LogOut className="w-4 h-4" />}
              onClick={logout}
            >
              {isHebrew ? 'יציאה' : 'Logout'}
            </CustomButton>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">
              {isHebrew ? "רכישת ספר פיזי" : "Physical Book Purchase"}
            </h1>
            
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                {isHebrew 
                  ? `שלום ${user.name || user.email}, הזמינו את הספר הפיזי עם משלוח עד הבית`
                  : `Hello ${user.name || user.email}, order the physical book with home delivery`
                }
              </p>
            </div>

            {paymentLoading && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  {isHebrew ? 'בודק סטטוס...' : 'Checking status...'}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <CouponInput 
              userId={user.id}
              originalPrice={originalPrice}
              onSuccess={() => {
                checkPaymentStatus(user.id);
              }}
              onDiscountApplied={handleDiscountApplied}
              appliedDiscount={appliedDiscount}
              serviceType="physical_book"
            />
            
            <div className="glass-card mb-16 p-8 max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-64 h-80 rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="/lovable-uploads/cover_Frontbook.png" 
                    alt="דניאל הולך לגן - ספר פיזי" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{isHebrew ? "דניאל הולך לגן - ספר פיזי" : "Daniel Goes to Kindergarten - Physical Book"}</h2>
              <p className="text-gray-600 mb-6">
                {isHebrew 
                  ? "ספר מודפס איכותי עם איורים מקוריים ומרהיבים. כולל תמיכה במציאות רבודה!"
                  : "High-quality printed book with original and stunning illustrations. Includes augmented reality support!"
                }
              </p>
              
              <div className="bg-shelley-blue/10 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-shelley-blue mb-2">
                  {isHebrew ? "מה מקבלים:" : "What you get:"}
                </h3>
                <ul className={`text-gray-600 ${isHebrew ? 'text-right' : 'text-left'}`}>
                  <li>• {isHebrew ? "ספר פיזי מודפס באיכות גבוהה" : "High-quality printed physical book"}</li>
                  <li>• {isHebrew ? "40 עמודים עם איורים מקוריים" : "40 pages with original illustrations"}</li>
                  <li>• {isHebrew ? "כריכה קשה איכותית" : "Quality hardcover binding"}</li>
                  <li>• {isHebrew ? "תמיכה במציאות רבודה (AR)" : "Augmented reality (AR) support"}</li>
                  <li>• {isHebrew ? "משלוח לכל הארץ" : "Nationwide shipping"}</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-shelley-green mb-2">
                  {bookPrice}
                </div>
                {appliedDiscount && (
                  <div className="text-sm text-gray-600 mb-4">
                    <span className="line-through text-red-500">{originalPrice} ₪</span>
                    <span className="mr-2 text-green-600">
                      {isHebrew ? ` הנחה של ${appliedDiscount.amount} ₪` : ` Save ${appliedDiscount.amount} NIS`}
                    </span>
                  </div>
                )}
              </div>
              
              {!showPayment ? (
                <CustomButton 
                  variant="blue" 
                  size="lg" 
                  icon={<ShoppingCart className="w-6 h-6" />} 
                  className="text-base px-8 py-3 h-14 min-h-0 font-bold"
                  onClick={() => setShowPayment(true)}
                >
                  {isHebrew ? "רכישה עם כרטיס אשראי או Paypal" : "Purchase with Credit Card or PayPal"}
                </CustomButton>
              ) : (
                <div className="mt-6">
                  <PayPalCheckout 
                    key={`paypal-physical-${paymentAmount}`}
                    amount={paymentAmount}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPayment(false)}
                    onConfirmPayment={handleConfirmPayment}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default PhysicalBookPurchase;
