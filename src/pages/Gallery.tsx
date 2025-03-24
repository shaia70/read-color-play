import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";
import { CustomButton } from "@/components/ui/CustomButton";
import { PaintBucket, Printer } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const GalleryPage = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [activeSlide, setActiveSlide] = useState(0);
  
  const galleryItems = [
    {
      title: language === 'he' ? 'תמונה מהסיפור' : 'Image from the Story',
      image: "/lovable-uploads/59335ecd-65c0-4a29-9ef0-2e2fd1e6c395.png",
      alt: language === 'he' ? 'ילד וחיות אנימציה בחדר שינה' : 'Boy and animated animals in bedroom',
      description: language === 'he' 
        ? 'סצנה מרכזית מהסיפור - הילד בחדר השינה עם החיות' 
        : 'A key scene from the story - the boy in his bedroom with the animals',
      hasDownload: false
    },
    {
      title: language === 'he' ? 'עמוד מהסיפור' : 'Page from the Story',
      image: "/lovable-uploads/f9826867-282e-4752-b00f-a31ba48f1ce7.png",
      alt: language === 'he' ? 'עמוד מהספר עם טקסט בעברית' : 'Book page with Hebrew text',
      description: language === 'he' 
        ? 'דף דוגמא למלל מהסיפור' 
        : 'Page 6 - with text from the story',
      hasDownload: false
    },
    {
      title: language === 'he' ? 'דף צביעה דוגמא להורדה' : 'Coloring Page Sample for Download',
      image: "/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png",
      alt: language === 'he' ? 'ילד ודמויות אנימציה' : 'Boy and animated characters',
      description: language === 'he' 
        ? 'דף צביעה עם דמויות מהסיפור' 
        : 'Coloring page featuring characters from the story',
      hasDownload: true
    }
  ];

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

  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
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
          
          <div className="max-w-5xl mx-auto mb-12 px-4">
            <Carousel 
              className="w-full"
              opts={{ loop: true }}
              onSelect={handleSelectSlide}
            >
              <CarouselContent>
                {galleryItems.map((item, index) => (
                  <CarouselItem key={index} className="w-full">
                    <div className="glass-card p-6 md:p-8">
                      <h2 className="text-xl font-semibold mb-4 text-center">
                        {item.title}
                      </h2>
                      
                      <div className="flex justify-center mb-6">
                        <img 
                          src={item.image} 
                          alt={item.alt} 
                          className="max-w-full h-auto max-h-[500px] rounded-lg shadow-md border border-gray-200"
                        />
                      </div>
                      
                      <p className="text-center text-gray-600 mb-6">
                        {item.description}
                      </p>
                      
                      {index === 2 && (
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
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="flex justify-center mt-8">
                <CarouselPrevious className="static mr-2 transform-none" />
                <div className="flex items-center space-x-2 mx-4">
                  {galleryItems.map((_, index) => (
                    <span
                      key={index}
                      className={`block h-2 w-2 rounded-full ${
                        activeSlide === index ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <CarouselNext className="static ml-2 transform-none" />
              </div>
            </Carousel>
          </div>
        </LanguageDirectionWrapper>
      </motion.main>
      <Footer />
    </>
  );
};

export default GalleryPage;
