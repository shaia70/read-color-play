
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
  const isHebrew = language === 'he';

  // SEO translations
  const pageTitle = isHebrew 
    ? "הורד את האפליקציה | שלי ספרים - מציאות רבודה" 
    : "Download Our App | Shelley Books - Augmented Reality";
    
  const pageDescription = isHebrew
    ? "הורידו את אפליקציית מציאות רבודה של שלי ספרים וגלו חוויית קריאה חדשנית לילדים. האפליקציה מאפשרת לסרוק את האיורים מהספרים ולראות אותם קמים לחיים"
    : "Download Shelley Books' augmented reality app and discover an innovative reading experience for children. The app allows you to scan illustrations from the books and see them come to life";
    
  const keywords = isHebrew
    ? "הורדת אפליקציה, אפליקציית מציאות רבודה, שלי ספרים AR, אפליקציית AR לילדים, מציאות רבודה לספרים, אפליקציה לסמארטפון, אפליקציה לטאבלט, שלי ספרים"
    : "app download, augmented reality app, Shelley Books AR, AR app for kids, augmented reality for books, smartphone app, tablet app, Shelley Books";

  const handleGooglePlayRedirect = () => {
    window.open('https://play.google.com/store/apps/details?id=com.ShelleyBooks.AR', '_blank');
  };

  const handleAppStoreRedirect = () => {
    window.open('https://apps.apple.com/us/app/ar-%D7%A9%D7%9C%D7%99-%D7%A1%D7%A4%D7%A8%D7%99%D7%9D/id6743387119', '_blank');
  };

  const handleNotifyMeClick = () => {
    if (language === 'he') {
      navigate('/contact', { 
        state: { 
          prefilledSubject: 'עדכנו אותי בשחרור האפליקציה',
          prefilledMessage: 'שלום, אשמח לקבל עדכון כאשר האפליקציה שלכם מוכנה להורדה'
        } 
      });
    } else {
      navigate('/contact', {
        state: {
          prefilledSubject: 'Notify me when the app is released',
          prefilledMessage: 'Hello, I would like to be notified when your app is available for download'
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
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={isHebrew ? "https://shelley.co.il/download" : "https://shelley.co.il/en/download"} />
        
        {/* Schema.org structured data for SoftwareApplication */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "שלי ספרים AR",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Android, iOS",
              "description": "${pageDescription}",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "ILS"
              },
              "author": {
                "@type": "Organization",
                "name": "שלי ספרים",
                "url": "https://shelley.co.il/"
              },
              "publisher": {
                "@type": "Organization",
                "name": "שלי ספרים"
              }
            }
          `}
        </script>
      </Helmet>
      
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

              <div className="flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold mb-6 text-center">
                  {t('download.availableOn')}
                </h3>
                
                <div className="flex flex-col space-y-4 max-w-md mx-auto w-full">
                  {/* Single container for both download options with less padding on mobile */}
                  <div className={`p-6 ${isMobile ? 'px-2.5' : ''} border border-gray-200 rounded-lg hover:shadow-lg transition-all`}>
                    {/* App Store Download */}
                    {!isMobile && (
                      <div className="flex items-center justify-between mb-4">
                        {language === 'en' ? (
                          <>
                            <img 
                              src="/lovable-uploads/3d32c013-a9f6-4328-a2f5-c63021aba4d7.png" 
                              alt="Download on the App Store" 
                              className="h-[50px] w-auto mr-4 ml-[50px]" 
                            />
                            <CustomButton 
                              variant="blue" 
                              icon={<Download />}
                              className="text-sm px-4 py-2 h-10 -ml-26 mr-[60px]"
                              onClick={handleAppStoreRedirect}
                            >
                              {t('download.download')}
                            </CustomButton>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <img 
                                src="/lovable-uploads/35dd9296-8f66-41f2-9e78-422f55eb3805.png" 
                                alt="הורד מ-App Store" 
                                className="h-[50px] w-auto hover:opacity-90 transition-opacity" 
                              />
                            </div>
                            <CustomButton 
                              variant="blue" 
                              icon={<Download />}
                              className="text-sm px-4 py-2 h-10 -ml-26 pr-[12px] mr-[60px]"
                              onClick={handleAppStoreRedirect}
                            >
                              {t('download.download')}
                            </CustomButton>
                          </>
                        )}
                      </div>
                    )}
                    
                    {isMobile && (
                      <div className="flex justify-center w-full mb-2">
                        <button onClick={handleAppStoreRedirect} className="focus:outline-none">
                          <img 
                            src={language === 'en' 
                              ? "/lovable-uploads/22f2f13e-8bc1-4b90-9ae3-036e3ae93e45.png" 
                              : "/lovable-uploads/cd98fd58-0725-4662-b758-9de502710b6b.png"} 
                            alt={language === 'en' ? "Download on the App Store" : "הורד מ App Store"} 
                            className="h-[50px] w-auto cursor-pointer hover:opacity-90 transition-opacity" 
                          />
                        </button>
                      </div>
                    )}
                    
                    {/* Google Play Download */}
                    {!isMobile && (
                      <div className="flex items-center justify-between">
                        {language === 'en' ? (
                          <>
                            <img 
                              src="/lovable-uploads/03e7a450-9b7f-4364-b0b6-80dcdd6345a4.png" 
                              alt="Get it on Google Play" 
                              className="h-[46px] w-auto mr-4 ml-[50px]" 
                            />
                            <CustomButton 
                              variant="green" 
                              icon={<Download />}
                              className="text-sm px-4 py-2 h-10 -ml-26 mr-[60px]"
                              onClick={handleGooglePlayRedirect}
                            >
                              {t('download.download')}
                            </CustomButton>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <img 
                                src="/lovable-uploads/2f584bb6-86b1-4f25-9e98-3196dded5656.png" 
                                alt="קבל ב-Google Play" 
                                className="h-[50px] w-auto hover:opacity-90 transition-opacity" 
                              />
                            </div>
                            <CustomButton 
                              variant="green" 
                              icon={<Download />}
                              className="text-sm px-4 py-2 h-10 -ml-26 pr-[12px] mr-[60px]"
                              onClick={handleGooglePlayRedirect}
                            >
                              {t('download.download')}
                            </CustomButton>
                          </>
                        )}
                      </div>
                    )}
                    
                    {isMobile && (
                      <div className="flex justify-center w-full">
                        <button onClick={handleGooglePlayRedirect} className="focus:outline-none">
                          <img 
                            src={language === 'en' 
                              ? "/lovable-uploads/03e7a450-9b7f-4364-b0b6-80dcdd6345a4.png" 
                              : "/lovable-uploads/2f584bb6-86b1-4f25-9e98-3196dded5656.png"} 
                            alt={language === 'en' ? "Get it on Google Play" : "קבל ב-Google Play"} 
                            className={language === 'en' ? "h-[46px] w-auto cursor-pointer hover:opacity-90 transition-opacity" : "h-[50px] w-auto cursor-pointer hover:opacity-90 transition-opacity"}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {!isMobile && (
                  <div className="mt-8 flex flex-col items-center">
                    <h4 className="text-lg font-bold mb-4">{t('download.scanQR')}</h4>
                    <div className="border border-gray-200 p-4 rounded-lg">
                      <img 
                        src="/lovable-uploads/51a16e0a-7938-41aa-b510-013c91d16360.png" 
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
