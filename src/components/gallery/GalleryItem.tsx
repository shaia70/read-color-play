
import React from "react";
import { motion } from "framer-motion";
import { PaintBucket, Printer } from "lucide-react";
import { CustomButton } from "@/components/ui/CustomButton";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface GalleryItemProps {
  title: string;
  image: string;
  alt: string;
  description: string;
  hasDownload: boolean;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  title,
  image,
  alt,
  description,
  hasDownload,
}) => {
  const { language } = useLanguage();

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

  const printColoringPage = () => {
    const coloringPageUrl = '/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png';
    
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${language === 'he' ? 'דף צביעה' : 'Coloring Page'}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
              }
              @media print {
                body {
                  height: auto;
                }
              }
            </style>
          </head>
          <body>
            <img src="${coloringPageUrl}" alt="${language === 'he' ? 'דף צביעה' : 'Coloring Page'}" />
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 200);
              }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      toast({
        title: language === 'he' ? 'מדפיס...' : 'Printing...',
        description: language === 'he' ? 'דף הצביעה נשלח להדפסה' : 'The coloring page was sent to the printer',
      });
    } else {
      toast({
        variant: "destructive",
        title: language === 'he' ? 'ההדפסה נכשלה' : 'Print Failed',
        description: language === 'he' ? 'לא ניתן לפתוח חלון הדפסה' : 'Could not open print window',
      });
    }
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {title}
      </h2>
      
      <div className="flex justify-center mb-6">
        <img 
          src={image} 
          alt={alt} 
          className="max-w-full h-auto max-h-[500px] rounded-lg shadow-md border border-gray-200"
        />
      </div>
      
      <p className="text-center text-gray-600 mb-6">
        {description}
      </p>
      
      {hasDownload && (
        <>
          <div className="flex justify-center">
            <CustomButton 
              variant="orange" 
              icon={<PaintBucket />}
              onClick={downloadColoringPage}
              className="w-full sm:w-auto"
            >
              {language === 'en' ? 'Download Coloring Page (Sample)' : 'הורד דף צביעה (דוגמא)'}
            </CustomButton>
          </div>
          
          <div className="flex justify-center mt-3">
            <CustomButton 
              variant="blue" 
              icon={<Printer />}
              onClick={printColoringPage}
              className="w-full sm:w-auto"
            >
              {language === 'en' ? 'Print Coloring Page' : 'הדפס דף צביעה'}
            </CustomButton>
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryItem;
