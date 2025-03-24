
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";
import { CustomButton } from "@/components/ui/CustomButton";
import { PaintBucket, Printer } from "lucide-react";
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

  const printColoringPage = () => {
    const coloringPageUrl = '/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png';
    
    // Create a new window for printing
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
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center mt-10">
            {language === 'he' ? 'גלריה' : 'Gallery'}
          </h1>
          
          <div className="max-w-5xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
            {/* New image from the story */}
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {language === 'he' ? 'תמונה מהסיפור' : 'Image from the Story'}
              </h2>
              
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/59335ecd-65c0-4a29-9ef0-2e2fd1e6c395.png" 
                  alt={language === 'he' ? 'ילד וחיות אנימציה בחדר שינה' : 'Boy and animated animals in bedroom'} 
                  className="max-w-full rounded-lg shadow-md border border-gray-200"
                />
              </div>
              
              <p className="text-center text-gray-600 mb-2">
                {language === 'he' 
                  ? 'סצנה מרכזית מהסיפור - הילד בחדר השינה עם החיות' 
                  : 'A key scene from the story - the boy in his bedroom with the animals'}
              </p>
            </div>
            
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
              
              {/* Print button */}
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
            </div>
          </div>
        </LanguageDirectionWrapper>
      </motion.main>
      <Footer />
    </>
  );
};

export default GalleryPage;
