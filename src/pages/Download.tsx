import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Apple, Download, Smartphone, Play, PaintBucket } from "lucide-react";
import { CustomButton } from "@/components/ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";

const DownloadPage = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleGooglePlayRedirect = () => {
    window.open('https://play.google.com/store/apps/details?id=com.ShelleyBooks.AR', '_blank');
  };

  const handleNotifyMeClick = () => {
    if (language === 'he') {
      navigate('/contact', { 
        state: { 
          prefilledSubject: 'עדכנו אותי בשחרור האפליקציה',
          prefilledMessage: 'שלום, אשמח לקבל עדכון כאשר האפליקציה שלכם מוכנה להורדה'
        } 
      });
    }
  };

  const navigateToARSection = () => {
    navigate('/');
    
    setTimeout(() => {
      const arSection = document.getElementById('ar-technology');
      if (arSection) {
        arSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const downloadColoringPage = () => {
    const coloringPageUrl = '/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png';
    
    fetch(coloringPageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = language === 'he' ? 'דף_צביעה_דוגמא.png' : 'coloring_page_sample.png';
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: language === 'he' ? 'ההורדה הצליחה' : 'Download Successful',
          description: language === 'he' ? 'דף הצביעה הורד בהצלחה' : 'The coloring page was downloaded successfully',
        });
      })
      .catch(error => {
        console.error('Download failed:', error);
        toast({
          variant: "destructive",
          title: language === 'he' ? 'ההורדה נכשלה' : 'Download Failed',
          description: language === 'he' ? 'אירעה שגיאה בהורדת דף הצביעה' : 'There was an error downloading the coloring page',
        });
      });
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              {t('download.appDescription')}
            </p>
            <p className="text-xl text-shelley-blue font-bold max-w-3xl mx-auto mt-4">
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

              <div className="flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold mb-6 text-center">
                  {t('download.availableOn')}
                </h3>
                
                <div className="flex flex-col space-y-4 max-w-md mx-auto w-full">
                  <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all flex items-center">
                    {!isMobile && (
                      <div className="bg-black rounded-full p-3 mr-4">
                        <Apple className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {t('download.downloadOn')}
                      </p>
                      <h4 className="text-xl font-bold">App Store</h4>
                    </div>
                    <CustomButton 
                      variant="blue" 
                      icon={<Download />}
                      className={language === 'he' ? 'text-sm px-4 py-2 h-10 -ml-6 pr-[12px]' : 'text-sm px-4 py-2 h-10 -ml-6'}
                    >
                      {t('download.download')}
                    </CustomButton>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all flex items-center">
                    {!isMobile && (
                      <div className="bg-green-600 rounded-full p-3 mr-4">
                        <Smartphone className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {t('download.getItOn')}
                      </p>
                      <h4 className="text-xl font-bold">Google Play</h4>
                    </div>
                    <CustomButton 
                      variant="green" 
                      icon={<Download />}
                      className={language === 'he' ? 'text-sm px-4 py-2 h-10 -ml-6 pr-[12px]' : 'text-sm px-4 py-2 h-10 -ml-6'}
                      onClick={handleGooglePlayRedirect}
                    >
                      {t('download.download')}
                    </CustomButton>
                  </div>
                </div>

                {!isMobile && (
                  <div className="mt-8 flex flex-col items-center">
                    <h4 className="text-lg font-bold mb-4">{t('download.scanQR')}</h4>
                    <div className="border border-gray-200 p-4 rounded-lg">
                      <img 
                        src={language === 'he' 
                          ? "/lovable-uploads/e9c19c63-97db-4749-b35b-43f65856d60b.png" 
                          : "/lovable-uploads/21efd8ff-cb6f-4d6a-958c-894ef6dfb937.png"} 
                        alt="QR Code for App Download" 
                        className="w-48 h-48"
                      />
                    </div>
                  </div>
                )}
                
                <div className={isMobile ? "mt-6" : "mt-6"}>
                  <CustomButton 
                    variant="purple" 
                    icon={<Play />}
                    onClick={navigateToARSection}
                    className="w-full"
                  >
                    {language === 'en' ? 'Try the App' : 'נסו את האפליקציה'}
                  </CustomButton>
                </div>
                
                <div className="mt-4">
                  <CustomButton 
                    variant="orange" 
                    icon={<PaintBucket />}
                    onClick={downloadColoringPage}
                    className="w-full"
                  >
                    {language === 'en' ? 'Download Coloring Page (Sample)' : 'הורד דף צביעה (דוגמא)'}
                  </CustomButton>
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
                  onClick={handleNotifyMeClick}
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
