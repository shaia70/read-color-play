import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import DownloadSEO from "@/components/download/DownloadSEO";
import DownloadOptions from "@/components/download/DownloadOptions";
import AppFeatures from "@/components/download/AppFeatures";

const DownloadPage = () => {
  const { t, language } = useLanguage();

  const handleGooglePlayRedirect = () => {
    window.open('https://play.google.com/store/apps/details?id=com.ShelleyBooks.AR', '_blank');
  };

  const handleAppStoreRedirect = () => {
    window.open('https://apps.apple.com/us/app/ar-%D7%A9%D7%9C%D7%99-%D7%A1%D7%A4%D7%A8%D7%99%D7%9D/id6743387119', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DownloadSEO />
      
      <Header />
      <main className="pt-28 pb-20">
        <div className="page-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">{t('download.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: "#5e86c7" }}>
              {t('download.description')}
            </p>
            <p className="text-xl max-w-3xl mx-auto mt-4" style={{ color: "#886fc8" }}>
              {t('download.appDescription')}
            </p>
            <p className="text-xl max-w-3xl mx-auto mt-4" style={{ color: "#b564a7" }}>
              {t('download.voiceRecording')}
            </p>
          </div>

          <div className="glass-card mb-16">
            <div className="grid grid-cols-1 gap-8 p-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                <p className="text-center text-gray-600">
                  {/* This text has been moved up to the main description section */}
                </p>
              </div>

              <DownloadOptions 
                handleGooglePlayRedirect={handleGooglePlayRedirect}
                handleAppStoreRedirect={handleAppStoreRedirect}
              />
            </div>
          </div>
          
          <div className="glass-card">
            <AppFeatures />
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default DownloadPage;
