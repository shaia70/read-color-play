
import { motion } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Lock, Eye, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PayPalCheckout from "@/components/flipbook/PayPalCheckout";
import FlipbookViewer from "@/components/flipbook/FlipbookViewer";

const Flipbook = () => {
  const { t, language } = useLanguage();
  const [hasPaid, setHasPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const isHebrew = language === 'he';

  const pageTitle = isHebrew 
    ? "פליפבוק דיגיטלי | שלי ספרים - חווית קריאה אינטראקטיבית" 
    : "Digital Flipbook | Shelley Books - Interactive Reading Experience";
    
  const pageDescription = isHebrew
    ? "חוו את ספרי הילדים שלנו בפורמט פליפבוק דיגיטלי אינטראקטיבי. גישה מיידית לאחר תשלום"
    : "Experience our children's books in an interactive digital flipbook format. Instant access after payment";

  const bookPrice = 19.99; // מחיר בדולרים
  const bookTitle = isHebrew ? "דניאל הולך לגן" : "Daniel Goes to Kindergarten";

  const handlePaymentSuccess = () => {
    setHasPaid(true);
    setShowPayment(false);
  };

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
          {!hasPaid ? (
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-6">
                {isHebrew ? "פליפבוק דיגיטלי" : "Digital Flipbook"}
              </h1>
              
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
                  ${bookPrice}
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
                      amount={bookPrice}
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
                  ? "כעת תוכלו ליהנות מהפליפבוק המלא"
                  : "You can now enjoy the full flipbook"
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
