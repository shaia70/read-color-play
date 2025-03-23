
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";
import { CustomButton } from "@/components/ui/CustomButton";
import { PaintBucket } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const GalleryPage = () => {
  const { t, language } = useLanguage();

  const downloadColoringPage = () => {
    const coloringPageUrl = '/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png';
    
    // Use fetch to get the file as a blob
    fetch(coloringPageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = language === 'he' ? 'דף_צביעה_דוגמא.png' : 'coloring_page_sample.png';
        document.body.appendChild(link);
        link.click();
        
        // Clean up
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
    <>
      <Header />
      <motion.main
        className="page-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <LanguageDirectionWrapper>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {language === 'he' ? 'גלריה' : 'Gallery'}
          </h1>
          
          <div className="grid grid-cols-1 max-w-3xl mx-auto mb-12">
            {/* Coloring page card */}
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {language === 'he' ? 'דף צביעה דוגמא להורדה' : 'Coloring Page Sample for Download'}
              </h2>
              
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png" 
                  alt={language === 'he' ? 'ילד ודמויות אנימציה' : 'Boy and animated characters'} 
                  className="max-w-full rounded-lg shadow-md border border-gray-200"
                />
              </div>
              
              <p className="text-center text-gray-600 mb-6">
                {language === 'he' 
                  ? 'דף צביעה עם דמויות מהסיפור' 
                  : 'Coloring page featuring characters from the story'}
              </p>
              
              {/* Download button */}
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
            </div>
          </div>
        </LanguageDirectionWrapper>
      </motion.main>
      <Footer />
    </>
  );
};

export default GalleryPage;
