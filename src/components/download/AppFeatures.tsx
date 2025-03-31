
import React from "react";
import { Smartphone, Download, Apple } from "lucide-react";
import { CustomButton } from "@/components/ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const AppFeatures = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

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

  return (
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
  );
};

export default AppFeatures;
