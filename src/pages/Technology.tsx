
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Smartphone, ArrowRight, Download, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const Technology = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isHebrew = language === 'he';

  // SEO translations
  const pageTitle = isHebrew 
    ? "טכנולוגיית מציאות רבודה | שלי ספרים" 
    : "Augmented Reality Technology | Shelley Books";
    
  const pageDescription = isHebrew
    ? "גלו את טכנולוגיית המציאות הרבודה (AR) המהפכנית של שלי ספרים. האיורים קופצים מהדף והופכים למשחקים אינטראקטיביים שמעשירים את חווית הקריאה של ילדכם"
    : "Discover Shelley Books' revolutionary Augmented Reality (AR) technology. Illustrations jump off the page and become interactive games that enhance your child's reading experience";
    
  const keywords = isHebrew
    ? "מציאות רבודה, AR לילדים, ספרים אינטראקטיביים, טכנולוגיית AR, אפליקציית מציאות רבודה, איורים אינטראקטיביים, שלי ספרים, AR בעברית"
    : "augmented reality, AR for kids, interactive books, AR technology, augmented reality app, interactive illustrations, Shelley Books, Hebrew AR books";

  const navigateToDownload = () => {
    navigate('/download');
  };

  return (
    <motion.div>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={isHebrew ? "https://shelley.co.il/technology" : "https://shelley.co.il/en/technology"} />
        
        {/* Schema.org structured data for Article */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "${isHebrew ? 'טכנולוגיית מציאות רבודה' : 'Augmented Reality Technology'}",
              "description": "${pageDescription}",
              "image": "https://shelley.co.il/og-image.png",
              "author": {
                "@type": "Organization",
                "name": "שלי ספרים",
                "url": "https://shelley.co.il/"
              },
              "publisher": {
                "@type": "Organization",
                "name": "שלי ספרים",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://shelley.co.il/favicon.svg"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://shelley.co.il/technology"
              }
            }
          `}
        </script>
      </Helmet>
      
      <Header />
      <main className="pt-28 pb-20">
        <div className="page-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">{t('ar.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('ar.description')}
            </p>
          </div>

          <div className="glass-card mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-8 ${language === 'en' ? 'text-left' : 'text-right'}`}>
                <h2 className="text-2xl font-bold mb-6">{language === 'en' ? 'What is Augmented Reality' : 'מה זו מציאות רבודה?'}</h2>
                <p className="text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'Augmented Reality (AR) is a technology that allows digital elements to be integrated into the real world through smartphone or tablet cameras.'
                    : 'מציאות רבודה (Augmented Reality או AR) היא טכנולוגיה המאפשרת לשלב אלמנטים דיגיטליים בעולם האמיתי באמצעות מצלמת הסמארטפון או הטאבלט.'}
                </p>
                <p className="text-gray-600 mb-6">
                  {language === 'en'
                    ? 'In "Shelley Books," children can see the illustrations come to life and become part of an interactive game, making the reading experience fascinating and enriching.'
                    : 'בספרי "שלי ספרים", הילדים יכולים לראות את האיורים קמים לחיים ולהפוך לחלק ממשחק אינטראקטיבי, מה שהופך את חווית הקריאה למרתקת ומעשירה.'}
                </p>

                <h3 className="text-xl font-bold mb-4">{language === 'en' ? 'Benefits of Using Augmented Reality' : 'יתרונות השימוש במציאות רבודה:'}</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-shelley-blue ml-2 mt-1 flex-shrink-0" />
                    <span>{language === 'en' ? 'Increases motivation and interest in reading' : 'מגבירה את המוטיבציה והעניין בקריאה'}</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-shelley-blue ml-2 mt-1 flex-shrink-0" />
                    <span>{language === 'en' ? 'Improves reading comprehension and memory' : 'משפרת את הבנת הנקרא והזיכרון'}</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-shelley-blue ml-2 mt-1 flex-shrink-0" />
                    <span>{language === 'en' ? 'Provides a multi-sensory learning experience' : 'מספקת חווית למידה רב-חושית'}</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-shelley-blue ml-2 mt-1 flex-shrink-0" />
                    <span>{language === 'en' ? 'Promotes creative thinking and imagination' : 'מקדמת חשיבה יצירתית ודמיון'}</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-shelley-blue ml-2 mt-1 flex-shrink-0" />
                    <span>{language === 'en' ? 'Enables interaction with characters and story' : 'מאפשרת אינטראקציה עם הדמויות והסיפור'}</span>
                  </li>
                </ul>
                
                <CustomButton 
                  variant="green" 
                  icon={<Download />} 
                  className="w-full sm:w-auto"
                  onClick={navigateToDownload}
                >
                  {language === 'en' ? 'Download the App' : 'הורידו את האפליקציה'}
                </CustomButton>
              </div>
              
              <div className="bg-gradient-to-br from-shelley-blue/10 to-shelley-purple/10 p-8 flex flex-col items-center justify-center rounded-tr-2xl rounded-br-2xl">
                <div className="mb-6 text-center">
                  <Smartphone className="w-12 h-12 text-shelley-purple mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{language === 'en' ? '?How Does It Work' : 'איך זה עובד?'}</h3>
                </div>
                
                <div className="space-y-6 w-full max-w-md">
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-shelley-blue/10 rounded-full p-2 ml-4 flex-shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 text-shelley-blue font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{language === 'en' ? 'Download the App' : 'הורדו את האפליקציה'}</h4>
                      <p className="text-sm text-gray-600">{t('ar.step1')}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-shelley-orange/10 rounded-full p-2 ml-4 flex-shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 text-shelley-orange font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{language === 'en' ? 'Choose Book and Page' : 'בחירת ספר ודף'}</h4>
                      <p className="text-sm text-gray-600">{language === 'en' ? 'Open the app, choose your desired book and selected page' : 'הכנסו לאפליקציה, בחרו את הספר הרצוי והדף הנבחר'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-shelley-purple/10 rounded-full p-2 ml-4 flex-shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 text-shelley-purple font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{language === 'en' ? 'Scan the Illustration' : 'סרקו את האיור'}</h4>
                      <p className="text-sm text-gray-600">{language === 'en' ? 'Point the camera at the illustration in the book' : 'כוונו את המצלמה לאיור בספר'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-shelley-green/10 rounded-full p-2 ml-4 flex-shrink-0">
                      <span className="flex items-center justify-center w-6 h-6 text-shelley-green font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{language === 'en' ? 'Enjoy the Experience' : 'תהנו מהחוויה'}</h4>
                      <p className="text-sm text-gray-600">{t('ar.step3')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{language === 'en' ? 'Try the AR Technology Yourself' : 'נסו את טכנולוגיית ה-AR בעצמכם!'}</h2>
              <div className="max-w-2xl mx-auto">
                <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden my-6">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                    <div className="text-gray-500">{language === 'en' ? 'A demonstration video of the technology will be displayed here' : 'כאן יוצג סרטון הדגמה של הטכנולוגיה'}</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  {language === 'en'
                    ? 'Coming soon: We will release the "Shelley Books AR" app that will allow you to experience the books in a new and fascinating way. You can scan illustrations from the books and see how the characters come to life and play with you'
                    : 'בקרוב נשחרר את אפליקציית "שלי ספרים AR" שתאפשר לכם לחוות את הספרים בדרך חדשה ומרתקת. תוכלו לסרוק איורים מהספרים ולראות כיצד הדמויות קמות לחיים ומשחקות איתכם!'}
                </p>
                <div className="flex justify-center">
                  <CustomButton 
                    variant="green" 
                    icon={<Download />} 
                    className="w-auto"
                    onClick={navigateToDownload}
                  >
                    {language === 'en' ? 'Download the App' : 'הורידו את האפליקציה'}
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Technology;
