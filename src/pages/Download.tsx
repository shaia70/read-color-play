
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Apple, Download, Smartphone } from "lucide-react";
import { CustomButton } from "@/components/ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

const DownloadPage = () => {
  const { t, language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="pt-28 pb-20">
        <div className="page-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">{language === 'en' ? 'Download Our App' : 'הורד את האפליקציה שלנו'}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Experience the magic of augmented reality with our "Shelley Books AR" app'
                : 'חווה את הקסם של מציאות רבודה עם אפליקציית "שלי ספרים AR" שלנו'}
            </p>
          </div>

          <div className="glass-card mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="bg-gray-200 rounded-lg w-full max-w-[250px] aspect-square flex items-center justify-center">
                  <img src="/placeholder.svg" alt="App Icon" className="w-32 h-32" />
                </div>
                <h2 className="text-2xl font-bold">{language === 'en' ? 'Shelley Books AR' : 'שלי ספרים AR'}</h2>
                <p className="text-center text-gray-600">
                  {language === 'en'
                    ? 'Scan book illustrations and watch them come to life with interactive AR experiences'
                    : 'סרוק איורי ספרים וצפה בהם קמים לחיים עם חוויות AR אינטראקטיביות'}
                </p>
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-6 text-center">
                  {language === 'en' ? 'Available on:' : 'זמין ב:'}
                </h3>
                
                <div className="flex flex-col space-y-4">
                  <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all flex items-center">
                    <div className="bg-black rounded-full p-3 mr-4">
                      <Apple className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {language === 'en' ? 'Download on the' : 'הורד מ-'}
                      </p>
                      <h4 className="text-xl font-bold">App Store</h4>
                    </div>
                    <CustomButton variant="blue" icon={<Download />}>
                      {language === 'en' ? 'Download' : 'הורד'}
                    </CustomButton>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all flex items-center">
                    <div className="bg-green-600 rounded-full p-3 mr-4">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {language === 'en' ? 'Get it on' : 'קבל אותו ב-'}
                      </p>
                      <h4 className="text-xl font-bold">Google Play</h4>
                    </div>
                    <CustomButton variant="green" icon={<Download />}>
                      {language === 'en' ? 'Download' : 'הורד'}
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {language === 'en' ? 'App Features' : 'תכונות האפליקציה'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-lg">
                  <div className="bg-shelley-blue/10 p-4 rounded-full inline-flex mb-4">
                    <Smartphone className="h-10 w-10 text-shelley-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {language === 'en' ? 'Easy to Use' : 'קל לשימוש'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' 
                      ? 'Simple interface designed for children of all ages'
                      : 'ממשק פשוט המיועד לילדים בכל הגילאים'}
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg">
                  <div className="bg-shelley-purple/10 p-4 rounded-full inline-flex mb-4">
                    <Download className="h-10 w-10 text-shelley-purple" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {language === 'en' ? 'Works Offline' : 'עובד ללא אינטרנט'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Download content to use the app without internet connection'
                      : 'הורד תוכן כדי להשתמש באפליקציה ללא חיבור לאינטרנט'}
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg">
                  <div className="bg-shelley-green/10 p-4 rounded-full inline-flex mb-4">
                    <Apple className="h-10 w-10 text-shelley-green" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {language === 'en' ? 'Regular Updates' : 'עדכונים תקופתיים'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'New content and features added regularly'
                      : 'תוכן ותכונות חדשים נוספים באופן קבוע'}
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-6">
                  {language === 'en'
                    ? 'Coming soon to iOS and Android devices. Be the first to know when our app is available!'
                    : 'בקרוב במכשירי iOS ו-Android. היו הראשונים לדעת מתי האפליקציה שלנו זמינה!'}
                </p>
                <CustomButton variant="blue" icon={<Download />} className="w-full sm:w-auto">
                  {language === 'en' ? 'Notify Me on Release' : 'עדכנו אותי בשחרור'}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default DownloadPage;
