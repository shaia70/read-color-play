
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { ArrowLeft, Eye } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { AspectRatio } from "../ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FeaturedBook() {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { t, language } = useLanguage();
  const [isZoomed, setIsZoomed] = useState(false);
  const isMobile = useIsMobile();

  const toggleZoom = () => {
    if (isMobile) return; // Prevent zooming on mobile
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('books.title')}</h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="glass-card overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              variants={itemVariants}
              className="p-8 flex items-center justify-center"
            >
              <div 
                className={`${isZoomed ? 'w-128 h-128 z-10 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'w-64 h-64'} rounded-lg shadow-xl overflow-hidden transform ${isZoomed ? 'rotate-0' : 'rotate-3 hover:rotate-0'} transition-all duration-500 relative ${isMobile ? '' : 'cursor-pointer'}`}
                onClick={toggleZoom}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-shelley-blue/20 to-transparent"></div>
                <img 
                  src="/lovable-uploads/cover_Frontbook.png" 
                  alt={t('book.daniel.title')} 
                  className="w-full h-full object-cover"
                />
              </div>
              {isZoomed && (
                <div 
                  className="fixed inset-0 bg-black/50 z-0"
                  onClick={toggleZoom}
                ></div>
              )}
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className={`p-8 flex flex-col justify-center ${language === 'en' ? 'text-left' : 'text-right'}`}
            >
              <span className="text-sm font-medium text-shelley-blue bg-blue-50 rounded-full px-3 py-1 inline-block mb-4">{t('book.firstSeries')}</span>
              <h3 className="text-3xl font-bold mb-4">{t('book.daniel.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('book.daniel.description')}
              </p>
              <p className="text-gray-600 mb-6">
                {t('book.daniel.story')}
              </p>
              <div className={`flex ${language === 'en' ? 'space-x-4' : 'space-x-4 space-x-reverse'}`}>
                <Link to="/books">
                  <CustomButton variant="blue" icon={<Eye />}>
                    {t('books.details')}
                  </CustomButton>
                </Link>
                <Link to="/books">
                  <CustomButton variant="outline" className="border-shelley-blue text-shelley-blue hover:bg-shelley-blue/10">
                    {t('books.all')}
                    {language === 'he' ? (
                      <ArrowLeft className="mr-2 h-4 w-4" />
                    ) : (
                      <ArrowLeft className="ml-2 h-4 w-4" />
                    )}
                  </CustomButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
