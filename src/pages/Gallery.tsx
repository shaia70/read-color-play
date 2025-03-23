
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";

const GalleryPage = () => {
  const { t, language } = useLanguage();

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* First Card - Original coloring page */}
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {language === 'he' ? 'דף צביעה להדפסה' : 'Coloring Page for Printing'}
              </h2>
              
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/39f022cd-7530-4471-ae97-2a769296c736.png" 
                  alt={language === 'he' ? 'דף צביעה' : 'Coloring Page'} 
                  className="max-w-full rounded-lg shadow-md border border-gray-200"
                />
              </div>
              
              <p className="text-center text-gray-600">
                {language === 'he' 
                  ? 'ניתן להוריד דף צביעה זה מעמוד ההורדות' 
                  : 'You can download this coloring page from the Downloads page'}
              </p>
            </div>
            
            {/* Second Card - New coloring page */}
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {language === 'he' ? 'דף צביעה חדש' : 'New Coloring Page'}
              </h2>
              
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png" 
                  alt={language === 'he' ? 'ילד ודמויות אנימציה' : 'Boy and animated characters'} 
                  className="max-w-full rounded-lg shadow-md border border-gray-200"
                />
              </div>
              
              <p className="text-center text-gray-600">
                {language === 'he' 
                  ? 'דף צביעה חדש עם דמויות מהסיפור' 
                  : 'New coloring page featuring characters from the story'}
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
