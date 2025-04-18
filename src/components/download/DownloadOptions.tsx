
import React from "react";
import { Download, Play, PaintBucket } from "lucide-react";
import { CustomButton } from "@/components/ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface DownloadOptionsProps {
  handleGooglePlayRedirect: () => void;
  handleAppStoreRedirect: () => void;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  handleGooglePlayRedirect,
  handleAppStoreRedirect
}) => {
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
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
  );
};

export default DownloadOptions;
