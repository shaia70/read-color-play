
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Apple, Download, Smartphone } from "lucide-react";
import { CustomButton } from "@/components/ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

const DownloadPage = () => {
  const { t, language } = useLanguage();

  const handleGooglePlayRedirect = () => {
    window.open('https://play.google.com/store/apps/details?id=com.ShelleyBooks.AR', '_blank');
  };

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
            <h1 className="text-4xl font-bold mb-6">{t('download.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('download.description')}
            </p>
          </div>

          <div className="glass-card mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="bg-gray-200 rounded-lg w-full max-w-[250px] aspect-square flex items-center justify-center">
                  <img src="/placeholder.svg" alt="App Icon" className="w-32 h-32" />
                </div>
                <h2 className="text-2xl font-bold">{t('download.appName')}</h2>
                <p className="text-center text-gray-600">
                  {t('download.appDescription')}
                </p>
              </div>

              <div className="flex flex-col justify-center">
                <h3 className={`text-xl font-bold mb-6 ${language === 'he' ? 'text-center' : 'text-center'}`}>
                  {t('download.availableOn')}
                </h3>
                
                <div className="flex flex-col space-y-4">
                  <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all flex items-center">
                    <div className="bg-black rounded-full p-3 mr-4">
                      <Apple className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {t('download.downloadOn')}
                      </p>
                      <h4 className="text-xl font-bold">App Store</h4>
                    </div>
                    <CustomButton 
                      variant="blue" 
                      icon={<Download />}
                      className={language === 'en' ? 'text-xs px-2 py-1 h-8' : 'mr-[-6px]'}
                    >
                      {t('download.download')}
                    </CustomButton>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all flex items-center">
                    <div className="bg-green-600 rounded-full p-3 mr-4">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {t('download.getItOn')}
                      </p>
                      <h4 className="text-xl font-bold">Google Play</h4>
                    </div>
                    <CustomButton 
                      variant="green" 
                      icon={<Download />}
                      className={language === 'en' ? 'text-xs px-2 py-1 h-8' : 'mr-[-3px]'}
                      onClick={handleGooglePlayRedirect}
                    >
                      {t('download.download')}
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {t('download.features')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-lg">
                  <div className="bg-shelley-blue/10 p-4 rounded-full inline-flex mb-4">
                    <Smartphone className="h-10 w-10 text-shelley-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t('download.easyToUse')}
                  </h3>
                  <p className="text-gray-600">
                    {t('download.easyToUseDesc')}
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg">
                  <div className="bg-shelley-purple/10 p-4 rounded-full inline-flex mb-4">
                    <Download className="h-10 w-10 text-shelley-purple" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t('download.worksOffline')}
                  </h3>
                  <p className="text-gray-600">
                    {t('download.worksOfflineDesc')}
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg">
                  <div className="bg-shelley-green/10 p-4 rounded-full inline-flex mb-4">
                    <Apple className="h-10 w-10 text-shelley-green" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {t('download.regularUpdates')}
                  </h3>
                  <p className="text-gray-600">
                    {t('download.regularUpdatesDesc')}
                  </p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-6">
                  {t('download.comingSoon')}
                </p>
                <CustomButton 
                  variant="blue" 
                  icon={<Download />} 
                  className={`${language === 'en' ? 'text-xs px-2 py-1 h-8' : 'mr-[-3px]'} w-full sm:w-auto`}
                >
                  {t('download.notifyMe')}
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
