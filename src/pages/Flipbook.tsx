
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Lock, Eye, CreditCard, LogOut, RefreshCw, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PayPalCheckout from "@/components/flipbook/PayPalCheckout";
import FlipbookViewer from "@/components/flipbook/FlipbookViewer";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import CouponInput from "@/components/flipbook/CouponInput";
import { ActiveSessions } from "@/components/security/ActiveSessions";

const Flipbook = () => {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const { hasValidPayment, isLoading: paymentLoading, error, checkPaymentStatus, confirmPaymentCompletion } = usePaymentVerification();
  const [showPayment, setShowPayment] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasCheckedPayment = useRef(false);
  const isHebrew = language === 'he';

  // Fixed price to prevent caching issues
  const bookPrice = "60 ₪";
  const paymentAmount = 60;
  const bookTitle = isHebrew ? "דניאל הולך לגן" : "Daniel Goes to Kindergarten";

  // Debug logging removed for production

  // בדיקת סטטוס התשלום כאשר המשתמש מתחבר (פעם אחת בלבד)
  useEffect(() => {
    if (user?.id && !hasCheckedPayment.current && !paymentLoading) {
      hasCheckedPayment.current = true;
      checkPaymentStatus(user.id);
    }
  }, [user?.id, checkPaymentStatus, paymentLoading]);

  // Reset check flag when user changes
  useEffect(() => {
    if (!user) {
      hasCheckedPayment.current = false;
    }
  }, [user]);

  const handleRefreshPayment = async () => {
    if (!user?.id || paymentLoading) {
      return;
    }
    
    setIsRefreshing(true);
    
    // Reset the check flag to allow re-checking
    hasCheckedPayment.current = false;
    
    try {
      await checkPaymentStatus(user.id);
    } finally {
      setIsRefreshing(false);
    }
  };

  const pageTitle = isHebrew 
    ? "פליפבוק דיגיטלי | שלי ספרים - חווית קריאה אינטראקטיבית" 
    : "Digital Flipbook | Shelley Books - Interactive Reading Experience";
    
  const pageDescription = isHebrew
    ? "חוו את ספרי הילדים שלנו בפורמט פליפבוק דיגיטלי אינטראקטיבי. גישה מיידית לאחר תשלום"
    : "Experience our children's books in an interactive digital flipbook format. Instant access after payment";


  const handlePaymentSuccess = () => {
    setShowPayment(false);
  };

  const handleConfirmPayment = async (userId: string) => {
    await confirmPaymentCompletion(userId);
  };

  // אם המשתמש לא מחובר, הצג טופס התחברות
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
          <link rel="canonical" href={isHebrew ? "https://shelley.co.il/flipbook" : "https://shelley.co.il/en/flipbook"} />
        </Helmet>
        
        <Header />
        <main className="pt-28 pb-20">
          <div className="page-container">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-6">
                {isHebrew ? "פליפבוק דיגיטלי" : "Digital Flipbook"}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {isHebrew 
                  ? "נדרשת התחברות כדי לגשת לתוכן המוגן"
                  : "Login required to access protected content"
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
        <link rel="canonical" href={isHebrew ? "https://shelley.co.il/flipbook" : "https://shelley.co.il/en/flipbook"} />
      </Helmet>
      
      <Header />
      <main className="pt-28 pb-20">
        <div className="page-container">
          {/* כפתורי פעולה */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <CustomButton
                variant="outline"
                size="sm"
                icon={<RefreshCw className={`w-4 h-4 ${isRefreshing || paymentLoading ? 'animate-spin' : ''}`} />}
                onClick={handleRefreshPayment}
                disabled={isRefreshing || paymentLoading}
              >
                {isHebrew ? 'רענון סטטוס תשלום' : 'Refresh Payment Status'}
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


          {!hasValidPayment ? (
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-6">
                {isHebrew ? "פליפבוק דיגיטלי" : "Digital Flipbook"}
              </h1>
              
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  {isHebrew 
                    ? `שלום ${user.name || user.email}, לצפייה בספר נדרש תשלום חד-פעמי`
                    : `Hello ${user.name || user.email}, a one-time payment is required to view the book`
                  }
                </p>
              </div>

              {paymentLoading && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    {isHebrew ? 'בודק סטטוס תשלום...' : 'Checking payment status...'}
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                  <p className="text-sm text-red-600 mt-1">
                    {isHebrew 
                      ? 'ניתן להמשיך עם תשלום חדש או לנסות לרענן'
                      : 'You can proceed with a new payment or try refreshing'
                    }
                  </p>
                </div>
              )}
              
              <CouponInput 
                userId={user.id}
                onSuccess={() => {
                  checkPaymentStatus(user.id);
                }}
              />
              
              <div className="glass-card mb-16 p-8 max-w-2xl mx-auto">
                
                <div className="flex justify-center mb-6">
                  <div className="w-48 h-48 rounded-lg shadow-xl overflow-hidden relative">
                    <img 
                      src="/lovable-uploads/f3774be2-f5fb-45b0-a9e8-83e77df84a9e.png" 
                      alt="דניאל הולך לגן" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4">{isHebrew ? "דניאל הולך לגן" : "Daniel Goes to Kindergarten"}</h2>
                <p className="text-gray-600 mb-6">
                  {isHebrew 
                    ? "חוו את הספר באופן אינטראקטיבי עם פליפבוק דיגיטלי מתקדם"
                    : "Experience the book interactively with an advanced digital flipbook"
                  }
                </p>
                
                <div className="bg-shelley-blue/10 p-4 rounded-lg mb-6">
                  <h3 className="font-bold text-shelley-blue mb-2">
                    {isHebrew ? "מה כלול:" : "What's included:"}
                  </h3>
                  <ul className={`text-gray-600 ${isHebrew ? 'text-right' : 'text-left'}`}>
                    <li>• {isHebrew ? "גישה מלאה לפליפבוק" : "Full flipbook access"}</li>
                    <li>• {isHebrew ? "איכות תמונה גבוהה" : "High image quality"}</li>
                    <li>• {isHebrew ? "חוויה אינטראקטיבית" : "Interactive experience"}</li>
                    <li>• {isHebrew ? "גישה ללא הגבלת זמן" : "Unlimited time access"}</li>
                  </ul>
                </div>
                
                <div className="text-3xl font-bold text-shelley-green mb-6">
                  {bookPrice}
                </div>
                
                {!showPayment ? (
                  <CustomButton 
                    variant="green" 
                    size="lg" 
                    icon={<CreditCard className="w-6 h-6" />} 
                    className="text-base px-8 py-3 h-14 min-h-0 font-bold"
                    onClick={() => setShowPayment(true)}
                  >
                    {isHebrew ? "רכישה עם PayPal" : "Purchase with PayPal"}
                  </CustomButton>
                ) : (
                  <div className="mt-6">
                     <PayPalCheckout 
                       amount={paymentAmount}
                       onSuccess={handlePaymentSuccess}
                      onCancel={() => setShowPayment(false)}
                      onConfirmPayment={handleConfirmPayment}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-6 text-shelley-green">
                {isHebrew ? "תשלום בוצע בהצלחה!" : "Payment Successful!"}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {isHebrew 
                  ? `שלום ${user.name || user.email}, כעת תוכלו ליהנות מהפליפבוק המלא`
                  : `Hello ${user.name || user.email}, you can now enjoy the full flipbook`
                }
              </p>
              <FlipbookViewer />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Flipbook;
