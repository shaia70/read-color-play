
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Eye, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Books = () => {
  const { t, language } = useLanguage();
  const [isZoomed, setIsZoomed] = useState(false);
  const isMobile = useIsMobile();

  const toggleZoom = () => {
    if (isMobile) return; // Prevent zooming on mobile
    setIsZoomed(!isZoomed);
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
            <h1 className="text-4xl font-bold mb-6">{t('books.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('books.description')}
            </p>
          </div>

          <div className="glass-card mb-16 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex justify-center">
                <div className="book-cover relative">
                  <div 
                    className={`${isZoomed ? 'w-128 h-160 z-10 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'w-64 h-80'} rounded-lg shadow-xl overflow-hidden transition-all duration-500 ${isMobile ? '' : 'cursor-pointer'}`}
                    onClick={toggleZoom}
                  >
                    <img 
                      src="/lovable-uploads/9947f510-a46b-4788-8edb-4a6fab9adfa2.png" 
                      alt={t('book.daniel.title')} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-shelley-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                      {t('books.new')}
                    </div>
                  </div>
                  {isZoomed && (
                    <div 
                      className="fixed inset-0 bg-black/50 z-0"
                      onClick={toggleZoom}
                    ></div>
                  )}
                </div>
              </div>
              
              <div className={`flex flex-col justify-center ${language === 'en' ? 'text-left' : 'text-right'}`}>
                <h2 className="text-3xl font-bold mb-4">{t('book.daniel.title')}</h2>
                <p className="text-gray-600 mb-6">
                  {t('book.daniel.description')}
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className={`font-bold mb-2 ${language === 'he' ? 'text-right' : 'text-left'}`}>
                    {t('books.bookDescription')}
                  </h3>
                  <p className="text-gray-600">
                    {t('book.daniel.story')}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-shelley-blue/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-blue">{t('books.ages')}</p>
                    <p>3-6</p>
                  </div>
                  <div className="bg-shelley-purple/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-purple">{t('books.pages')}</p>
                    <p>24</p>
                  </div>
                  <div className="bg-shelley-orange/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-orange">{t('books.cover')}</p>
                    <p>{t('books.hardcover')}</p>
                  </div>
                  <div className="bg-shelley-green/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-green">{t('books.language')}</p>
                    <p>{t('books.hebrew')}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-6 mb-4">
                  <CustomButton 
                    variant="green" 
                    size="lg" 
                    icon={<Eye className="w-6 h-6" />} 
                    className={`text-base px-8 py-3 h-14 min-h-0 w-64 font-bold ${language === 'he' ? 'justify-start' : ''}`}
                  >
                    {t('books.peek')}
                  </CustomButton>
                  <CustomButton 
                    variant="orange" 
                    size="lg" 
                    icon={<Download className="w-6 h-6" />} 
                    className={`text-base px-8 py-3 h-14 min-h-0 w-64 font-bold ${language === 'he' ? 'justify-start' : ''}`}
                  >
                    {t('books.coloring')}
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('books.comingSoon')}</h2>
            <p className="text-gray-600">
              {t('books.workingOn')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Books;
