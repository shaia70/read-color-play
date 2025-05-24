import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Lock, Eye, CreditCard, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PayPalCheckout from "@/components/flipbook/PayPalCheckout";
import FlipbookViewer from "@/components/flipbook/FlipbookViewer";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentCheck } from "@/hooks/usePaymentCheck";

const Flipbook = () => {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const { hasValidPayment, isLoading: paymentLoading, verifyPayment, savePayment } = usePaymentCheck();
  const [showPayment, setShowPayment] = useState(false);
  const isHebrew = language === 'he';

  console.log('=== FLIPBOOK COMPONENT RENDER ===');
  console.log('Component loaded at:', new Date().toISOString());
  console.log('User object:', user);
  console.log('Has valid payment:', hasValidPayment);
  console.log('Payment loading state:', paymentLoading);
  console.log('Show payment form:', showPayment);
  console.log('Current language:', language);
  console.log('=== IMPORT VERIFICATION ===');
  console.log('usePaymentCheck imported from:', '@/hooks/usePaymentCheck');
  console.log('This should NOT reference usePaymentVerification');

  // בדיקה אם המשתמש חזר מPayPal עם תשלום מוצלח
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    console.log('=== URL PARAMS CHECK ===');
    console.log('Payment status from URL:', paymentStatus);
    
    if (paymentStatus === 'success' && user) {
      console.log('Payment success detected, saving payment for user:', user.id);
      // רישום התשלום במערכת
      savePayment(user.id, 'paypal_session_' + Date.now(), 70);
      setShowPayment(false);
      // ניקוי הURL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancel') {
      console.log('Payment cancelled');
      setShowPayment(false);
      // ניקוי הURL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, savePayment]);

  // בדיקת סטטוס התשלום כאשר המשתמש מתחבר
  useEffect(() => {
    if (user) {
      console.log('User logged in, verifying payment for:', user.id);
      verifyPayment(user.id);
    }
  }, [user, verifyPayment]);

  const pageTitle = isHebrew 
    ? "פליפבוק דיגיטלי | שלי ספרים - חווית קריאה אינטראקטיבית" 
    : "Digital Flipbook | Shelley Books - Interactive Reading Experience";
    
  const pageDescription = isHebrew
    ? "חוו את ספרי הילדים שלנו בפורמט פליפבוק דיגיטלי אינטראקטיבי. גישה מיידית לאחר תשלום"
    : "Experience our children's books in an interactive digital flipbook format. Instant access after payment";

  const bookPrice = "70 ₪";
  const bookTitle = isHebrew ? "דניאל הולך לגן" : "Daniel Goes to Kindergarten";

  const handlePaymentSuccess = () => {
    if (user) {
      console.log('Manual payment confirmation for user:', user.id);
      savePayment(user.id, 'manual_confirmation_' + Date.now(), 70);
      setShowPayment(false);
    }
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
          {/* כפתור יציאה */}
          <div className="flex justify-end mb-4">
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
                    ? `שלום ${user?.name || user?.email}, לצפייה בספר נדרש תשלום חד-פעמי`
                    : `Hello ${user?.name || user?.email}, a one-time payment is required to view the book`
                  }
                </p>
              </div>
              
              <div className="glass-card mb-16 p-8 max-w-2xl mx-auto">
                
                <div className="flex justify-center mb-6">
                  <div className="w-48 h-48 rounded-lg shadow-xl overflow-hidden relative">
                    <img 
                      src="/lovable-uploads/f3774be2-f5fb-45b0-a9e8-83e77df84a9e.png" 
                      alt={bookTitle} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4">{bookTitle}</h2>
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
                      amount={70}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setShowPayment(false)}
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
                  ? `שלום ${user?.name || user?.email}, כעת תוכלו ליהנות מהפליפבוק המלא`
                  : `Hello ${user?.name || user?.email}, you can now enjoy the full flipbook`
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
