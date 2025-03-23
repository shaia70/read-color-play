import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { Smartphone, Download, Info, X } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ARTechnology() {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { t, language } = useLanguage();
  const [imageState, setImageState] = useState("normal"); // "normal", "left-zoomed", "right-zoomed"
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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

  const handleImageClick = (e) => {
    if (imageState !== "normal") {
      setImageState("normal");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftSide = x < rect.width / 2;

    setImageState(isLeftSide ? "left-zoomed" : "right-zoomed");
  };

  const resetZoom = () => {
    setImageState("normal");
  };

  const navigateToDownload = () => {
    navigate('/download');
  };

  const isZoomed = imageState !== "normal";

  return (
    <section ref={ref} className="py-20 bg-gradient-to-t from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t('ar.title')}</h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('ar.description')}
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className={`glass-card ${isZoomed ? 'overflow-visible' : 'overflow-hidden'}`}
        >
          <div className={`grid grid-cols-1 ${isZoomed ? '' : 'md:grid-cols-2'} gap-6`}>
            <motion.div 
              variants={itemVariants} 
              className={`p-8 ${language === 'en' ? 'text-left' : 'text-right'} ${isZoomed && !isMobile ? 'hidden' : ''} ${isZoomed ? '' : 'h-full flex flex-col justify-center'}`}
            >
              <h3 className="text-2xl font-bold mb-4">{language === 'en' ? '?How Does It Work' : 'איך זה עובד?'}</h3>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <div className={`bg-shelley-blue/10 rounded-full p-2 ${language === 'en' ? 'mr-4' : 'order-1 ml-4'}`}>
                    <span className="flex items-center justify-center w-6 h-6 text-shelley-blue font-bold">1</span>
                  </div>
                  <div className={language === 'en' ? '' : 'order-2'}>
                    <p className="text-gray-700">{t('ar.step1')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`bg-shelley-orange/10 rounded-full p-2 ${language === 'en' ? 'mr-4' : 'order-1 ml-4'}`}>
                    <span className="flex items-center justify-center w-6 h-6 text-shelley-orange font-bold">2</span>
                  </div>
                  <div className={language === 'en' ? '' : 'order-2'}>
                    <p className="text-gray-700">{language === 'en' ? 'Open the app, choose your desired book and selected page' : 'הכנסו לאפליקציה, בחרו את הספר הרצוי והדף הנבחר'}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`bg-shelley-purple/10 rounded-full p-2 ${language === 'en' ? 'mr-4' : 'order-1 ml-4'}`}>
                    <span className="flex items-center justify-center w-6 h-6 text-shelley-purple font-bold">3</span>
                  </div>
                  <div className={language === 'en' ? '' : 'order-2'}>
                    <p className="text-gray-700">{t('ar.step3')}</p>
                  </div>
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <CustomButton 
                  variant="green" 
                  icon={<Download />} 
                  className="mb-2 sm:mb-0"
                  onClick={navigateToDownload}
                >
                  {language === 'en' ? 'Download the App' : 'הורידו את האפליקציה'}
                </CustomButton>
                <Link to="/technology">
                  <CustomButton variant="ghost" icon={<Info />} className="text-shelley-blue">
                    {t('ar.moreInfo')}
                  </CustomButton>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants} 
              className={`relative flex items-center justify-center p-8 ${isZoomed ? 'col-span-full' : ''}`}
            >
              {isZoomed && (
                <button 
                  onClick={resetZoom} 
                  className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <X size={24} className="text-shelley-blue" />
                </button>
              )}
              
              <div className="w-full flex flex-col items-center">
                <p className="text-center mb-4 text-shelley-blue font-medium">
                  {language === 'en' 
                    ? "Click on the left (image) or right (text) side of the image to zoom in and point your app to the zoomed part and press Start in the app" 
                    : "לחץ על החצי השמאלי (תמונה) או החצי הימני (טקסט) להגדלה וכוון את האפליקציה אל החלק המוגדל ולחץ התחל באפליקציה"}
                </p>
                
                <div 
                  className={`relative cursor-pointer transition-all duration-300 ease-in-out ${
                    imageState === "normal" 
                      ? "w-128" 
                      : "w-[96rem] md:w-[72rem] sm:w-[48rem]"
                  } ${isZoomed ? "h-auto" : "h-auto"} overflow-hidden`}
                  onClick={handleImageClick}
                >
                  <div className="absolute -inset-4 bg-gradient-to-tr from-shelley-blue via-shelley-purple to-shelley-green opacity-20 blur-lg rounded-2xl"></div>
                  <div className="relative bg-white p-4 rounded-2xl shadow-lg">
                    <div className="border-8 border-gray-800 rounded-3xl overflow-hidden relative">
                      <div className="relative overflow-hidden">
                        <img 
                          src="/lovable-uploads/409a1845-2abd-436e-ad91-e690c43bb547.png" 
                          alt="AR Demo" 
                          className={`w-full h-auto transition-all duration-300 ease-in-out ${
                            imageState === "left-zoomed" 
                              ? "scale-[1.5] origin-left" 
                              : imageState === "right-zoomed" 
                                ? "scale-[1.5] origin-right" 
                                : "scale-100"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className={`absolute top-16 right-0 w-20 h-20 rounded-full bg-gradient-to-tr from-green-200 to-green-300 opacity-60 animate-float ${isZoomed ? 'scale-150' : ''}`}></div>
              <div className={`absolute bottom-10 left-0 w-16 h-16 rounded-full bg-gradient-to-tr from-purple-200 to-purple-300 opacity-60 animate-float ${isZoomed ? 'scale-150' : ''}`} style={{ animationDelay: "1.5s" }}></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

