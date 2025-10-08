
import { motion } from "framer-motion";
import * as React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { LogOut, ShoppingCart, Truck, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PayPalCheckout from "@/components/flipbook/PayPalCheckout";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import CouponInput from "@/components/flipbook/CouponInput";
import { useUrlSecurity } from "@/hooks/useUrlSecurity";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const PhysicalBookPurchase = () => {
  // SECURITY: Remove suspicious URL parameters to prevent bypass
  useUrlSecurity();
  
  const { t, language } = useLanguage();
  const { user, session, logout } = useAuth();
  const [showPayment, setShowPayment] = React.useState(false);
  const [appliedDiscount, setAppliedDiscount] = React.useState<{amount: number, newPrice: number, couponCode: string} | null>(null);
  const [deliveryMethod, setDeliveryMethod] = React.useState<'pickup' | 'delivery'>('pickup');

  const isHebrew = language === 'he';

  // Fixed prices
  const basePrice = 89;
  const deliveryFee = 30;
  const originalPrice = basePrice + (deliveryMethod === 'delivery' ? deliveryFee : 0);
  const currentPrice = appliedDiscount ? appliedDiscount.newPrice + (deliveryMethod === 'delivery' ? deliveryFee : 0) : originalPrice;
  const bookPrice = `${currentPrice} ₪`;
  const paymentAmount = currentPrice;
  const bookTitle = isHebrew ? "דניאל הולך לגן - ספר פיזי" : "Daniel Goes to Kindergarten - Physical Book";

  // Debug logging for price calculations
  React.useEffect(() => {
    console.log('=== PHYSICAL BOOK PRICE CALCULATION ===');
    console.log('Applied discount:', appliedDiscount);
    console.log('Delivery method:', deliveryMethod);
    console.log('Base price:', basePrice);
    console.log('Delivery fee:', deliveryMethod === 'delivery' ? deliveryFee : 0);
    console.log('Original price:', originalPrice);
    console.log('Current price:', currentPrice);
    console.log('Payment amount:', paymentAmount);
  }, [appliedDiscount, deliveryMethod, currentPrice, paymentAmount]);

  const pageTitle = isHebrew 
    ? "רכישת ספר פיזי | שלי ספרים - דניאל הולך לגן" 
    : "Physical Book Purchase | Shelley Books - Daniel Goes to Kindergarten";
    
  const pageDescription = isHebrew
    ? "רכשו את הספר הפיזי 'דניאל הולך לגן' במחיר מיוחד. משלוח לכל הארץ או איסוף עצמי"
    : "Purchase the physical book 'Daniel Goes to Kindergarten' at a special price. Shipping or pickup";

  const handleDiscountApplied = (discountAmount: number, newPrice: number, couponCode: string) => {
    console.log('=== PHYSICAL BOOK DISCOUNT APPLIED ===');
    console.log('Discount amount:', discountAmount);
    console.log('New price:', newPrice);
    console.log('Coupon code:', couponCode);
    
    const discountData = { amount: discountAmount, newPrice, couponCode };
    setAppliedDiscount(discountData);
  };

  const handlePaymentSuccess = () => {
    console.log('=== PHYSICAL BOOK PAYMENT SUCCESS ===');
    setShowPayment(false);
    
    // Clear the discount after successful payment
    setAppliedDiscount(null);
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
          <div className="flex justify-end items-center mb-4">
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
                  ? `שלום ${user.name || user.email}, הזמינו את הספר הפיזי`
                  : `Hello ${user.name || user.email}, order the physical book`
                }
              </p>
            </div>
            
            <CouponInput 
              userId={user.id}
              originalPrice={basePrice}
              onSuccess={() => {}}
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
                </ul>
              </div>
              
              {/* Delivery Method Selection */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-lg mb-4">
                  {isHebrew ? "אופן קבלת הספר:" : "Delivery Method:"}
                </h3>
                <RadioGroup value={deliveryMethod} onValueChange={(value: 'pickup' | 'delivery') => setDeliveryMethod(value)}>
                  <div className="space-y-4">
                    {/* Self Pickup */}
                    <div className="flex items-start space-x-3 space-x-reverse p-4 border-2 rounded-lg hover:border-shelley-blue transition-colors cursor-pointer">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-5 h-5 text-shelley-blue" />
                          <span className="font-bold text-lg">
                            {isHebrew ? "איסוף עצמי - ללא עלות" : "Self Pickup - Free"}
                          </span>
                        </div>
                        <div className={`text-sm text-gray-600 ${isHebrew ? 'text-right' : 'text-left'}`}>
                          <p className="font-bold text-base mb-2">{isHebrew ? "אופיר ביכורים - הוצאה לאור" : "Ofir Bikurim Publishing"}</p>
                          <p className="font-semibold mb-1">{isHebrew ? "כתובת:" : "Address:"}</p>
                          <p>{isHebrew ? "משה דיין 10, קריית אריה, פתח תקווה" : "Moshe Dayan 10, Kiryat Arye, Petah Tikva"}</p>
                          <p>{isHebrew ? "בניין A, קומה 6" : "Building A, Floor 6"}</p>
                          <p className="mt-2">
                            <span className="font-semibold">{isHebrew ? "טלפון:" : "Phone:"}</span> 03-5562677
                          </p>
                        </div>
                      </Label>
                    </div>
                    
                    {/* Home Delivery */}
                    <div className="flex items-start space-x-3 space-x-reverse p-4 border-2 rounded-lg hover:border-shelley-blue transition-colors cursor-pointer">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-5 h-5 text-shelley-blue" />
                          <span className="font-bold text-lg">
                            {isHebrew ? `משלוח עד הבית - ${deliveryFee} ₪` : `Home Delivery - ${deliveryFee} NIS`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {isHebrew ? "משלוח מהיר לכל הארץ" : "Fast delivery nationwide"}
                        </p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="text-center">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-lg">
                    <span>{isHebrew ? "מחיר ספר:" : "Book price:"}</span>
                    <span>{appliedDiscount ? appliedDiscount.newPrice : basePrice} ₪</span>
                  </div>
                  {deliveryMethod === 'delivery' && (
                    <div className="flex justify-between items-center text-lg">
                      <span>{isHebrew ? "משלוח:" : "Delivery:"}</span>
                      <span>{deliveryFee} ₪</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{isHebrew ? "סה\"כ לתשלום:" : "Total:"}</span>
                      <span className="text-3xl font-bold text-shelley-green">{bookPrice}</span>
                    </div>
                  </div>
                </div>
                {appliedDiscount && (
                  <div className="text-sm text-gray-600 mb-4">
                    <span className="line-through text-red-500">{basePrice} ₪</span>
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
                    key={`paypal-physical-${paymentAmount}-${deliveryMethod}`}
                    amount={paymentAmount}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPayment(false)}
                    onConfirmPayment={async () => {}}
                    deliveryMethod={deliveryMethod}
                    shippingAddress={deliveryMethod === 'delivery' ? {
                      name: user.name || user.email || 'Customer',
                      address_line_1: isHebrew ? 'יש למלא כתובת במסך הבא' : 'Please fill address in next screen',
                      admin_area_2: isHebrew ? 'עיר' : 'City',
                      country_code: 'IL'
                    } : undefined}
                    productDescription={isHebrew 
                      ? `ספר פיזי - דניאל הולך לגן${deliveryMethod === 'delivery' ? ' (כולל משלוח)' : ' (איסוף עצמי)'}`
                      : `Physical Book - Daniel Goes to Kindergarten${deliveryMethod === 'delivery' ? ' (with delivery)' : ' (self pickup)'}`
                    }
                    skipAccessCheck={true}
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
