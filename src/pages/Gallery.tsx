
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";
import { CustomButton } from "@/components/ui/CustomButton";
import { PaintBucket, Printer } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const GalleryPage = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    {
      src: '/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png',
      alt: language === 'he' ? 'ילד ודמויות אנימציה' : 'Boy and animated characters',
      title: language === 'he' ? 'דף צביעה עם דמויות מהסיפור' : 'Coloring Page with Story Characters',
      description: language === 'he' ? 'דף צביעה עם דמויות מהעמוד' : 'Coloring page featuring characters from the story',
      downloadable: true
    },
    {
      src: '/lovable-uploads/16e246a7-d0e8-4555-827a-a7a2abc38931.png',
      alt: language === 'he' ? 'עמוד מהסיפור עם טקסט בעברית' : 'Story page with Hebrew text',
      title: language === 'he' ? 'עמוד מהספר' : 'Page from the Book',
      description: language === 'he' ? 'עמוד מתוך הספר האינטראקטיבי עם טקסט בעברית' : 'Page from the interactive book with Hebrew text',
      downloadable: false
    },
    {
      src: '/lovable-uploads/44a963fb-7541-454e-aca5-f9aeb4020eaa.png',
      alt: language === 'he' ? 'טכנולוגיית מציאות רבודה' : 'AR Technology',
      title: language === 'he' ? 'טכנולוגיית מציאות רבודה' : 'AR Technology Demonstration',
      description: language === 'he' ? 'הדגמה של טכנולוגיית המציאות הרבודה המשולבת בספר' : 'Demonstration of the AR technology integrated in the book',
      downloadable: false
    }
  ];

  const downloadColoringPage = () => {
    const coloringPageUrl = images[0].src;
    
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
          description: language === 'he' ? 'אירעה ש��יאה בהורדת דף הצביעה' : 'There was an error downloading the coloring page',
        });
      });
  };

  const printColoringPage = () => {
    const coloringPageUrl = images[0].src;
    
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
          
          <div className="max-w-3xl mx-auto mb-12">
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {images[activeImage].title}
              </h2>
              
              <div className="flex justify-center mb-6 relative">
                <Carousel 
                  className="w-full max-w-xl"
                  setApi={(api) => {
                    api?.on("select", () => {
                      setActiveImage(api.selectedScrollSnap());
                    });
                  }}
                  opts={{
                    loop: true,
                    align: "center",
                  }}
                >
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="flex justify-center">
                          <img 
                            src={image.src} 
                            alt={image.alt} 
                            className="max-w-full rounded-lg shadow-md border border-gray-200 object-contain max-h-[500px]"
                            onError={(e) => {
                              console.error(`Failed to load image: ${image.src}`);
                              e.currentTarget.src = '/placeholder.svg'; // Fallback image if the original fails to load
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className={`${isMobile ? 'hidden' : ''} -left-8 lg:-left-12`} />
                  <CarouselNext className={`${isMobile ? 'hidden' : ''} -right-8 lg:-right-12`} />
                </Carousel>
              </div>
              
              <p className="text-center text-gray-600 mb-6">
                {images[activeImage].description}
              </p>
              
              {activeImage === 0 && (
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
              )}
              
              {activeImage === 0 && (
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
              )}
              
              <p className="text-center text-sm text-gray-500 mt-6">
                {isMobile 
                  ? (language === 'he' 
                    ? "החלק שמאלה או ימינה כדי לראות תמונות נוספות" 
                    : "Swipe left or right to see more images")
                  : (language === 'he' 
                    ? "לחץ על החצים כדי לראות תמונות נוספות" 
                    : "Click the arrows to see more images")}
              </p>
            </div>
          </div>
        </LanguageDirectionWrapper>
      </motion.main>
      <Footer />
    </>
  );
};

export default GalleryPage;
