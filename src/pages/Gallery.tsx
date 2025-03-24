
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";
import { GalleryCarousel } from "@/components/gallery/GalleryCarousel";

const GalleryPage = () => {
  const { language } = useLanguage();

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
            <GalleryCarousel />
          </div>
        </LanguageDirectionWrapper>
      </motion.main>
      <Footer />
    </>
  );
};

export default GalleryPage;
