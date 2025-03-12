
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { Smartphone, Download, Info } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ARTechnology() {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { t, language } = useLanguage();

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
          className="glass-card"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              variants={itemVariants} 
              className={`p-8 ${language === 'en' ? 'text-left' : 'text-right'}`}
            >
              <h3 className="text-2xl font-bold mb-4">{t('ar.howItWorks')}</h3>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <div className={`bg-shelley-blue/10 rounded-full p-2 ${language === 'he' ? 'order-2 ml-4' : 'mr-4'}`}>
                    <span className="flex items-center justify-center w-6 h-6 text-shelley-blue font-bold">1</span>
                  </div>
                  <div className={language === 'he' ? 'order-1' : ''}>
                    <p className="text-gray-700">{t('ar.step1')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`bg-shelley-orange/10 rounded-full p-2 ${language === 'he' ? 'order-2 ml-4' : 'mr-4'}`}>
                    <span className="flex items-center justify-center w-6 h-6 text-shelley-orange font-bold">2</span>
                  </div>
                  <div className={language === 'he' ? 'order-1' : ''}>
                    <p className="text-gray-700">{t('ar.step2')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className={`bg-shelley-purple/10 rounded-full p-2 ${language === 'he' ? 'order-2 ml-4' : 'mr-4'}`}>
                    <span className="flex items-center justify-center w-6 h-6 text-shelley-purple font-bold">3</span>
                  </div>
                  <div className={language === 'he' ? 'order-1' : ''}>
                    <p className="text-gray-700">{t('ar.step3')}</p>
                  </div>
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <CustomButton variant="green" icon={<Download />} className="mb-2 sm:mb-0">
                  {t('ar.download')}
                </CustomButton>
                <Link to="/technology">
                  <CustomButton variant="ghost" icon={<Info />} className="text-shelley-blue">
                    {t('ar.moreInfo')}
                  </CustomButton>
                </Link>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative flex items-center justify-center p-8">
              <div className="relative w-64 h-auto">
                <div className="absolute -inset-4 bg-gradient-to-tr from-shelley-blue via-shelley-purple to-shelley-green opacity-20 blur-lg rounded-2xl"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-lg">
                  <div className="border-8 border-gray-800 rounded-3xl overflow-hidden relative">
                    <img 
                      src="https://via.placeholder.com/300x600?text=AR+Demo" 
                      alt="AR Demo" 
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Smartphone className="w-12 h-12 text-white opacity-50" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"></div>
                </div>
              </div>
              <div className="absolute top-6 right-10 w-20 h-20 rounded-full bg-gradient-to-tr from-green-200 to-green-300 opacity-60 animate-float"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-gradient-to-tr from-purple-200 to-purple-300 opacity-60 animate-float" style={{ animationDelay: "1.5s" }}></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
