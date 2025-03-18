
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";
import Logo from "../layout/Logo";

export default function Hero() {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { t, language } = useLanguage();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const renderWelcomeText = () => {
    if (language === 'he') {
      return (
        <>
          ברוכים הבאים ל...{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red">
            שלי ספרים
          </span>
        </>
      );
    } else {
      return (
        <>
          Welcome to...{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red">
            Shelley Books
          </span>
        </>
      );
    }
  };

  return (
    <section className="relative min-h-screen pt-16 pb-20 flex flex-col items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-shelley-blue/10 animate-float" style={{ animationDelay: "0s" }}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 rounded-full bg-shelley-orange/10 animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 left-1/4 w-56 h-56 rounded-full bg-shelley-purple/10 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 right-1/5 w-48 h-48 rounded-full bg-shelley-green/10 animate-float" style={{ animationDelay: "1.5s" }}></div>
      </div>
      
      {/* Logo positioned at the left of the page (which is right in RTL) - moved down by 10px */}
      <div className="w-full container mx-auto px-4 mt-10">
        <div className="flex justify-end">
          <Logo isSquare={true} className="w-19 h-19 shadow-lg" />
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={variants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.span variants={itemVariants} className="inline-block px-4 py-2 bg-shelley-blue/10 text-shelley-blue rounded-full text-sm font-medium mb-6">
            {t('hero.tagline')}
          </motion.span>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {renderWelcomeText()}
          </motion.h1>
          
          <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl text-gray-600 mb-8">
            {t('hero.subtitle')}
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            {t('hero.description')}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/books">
              <CustomButton variant="blue" size="lg" icon={<BookOpen />} className="w-full sm:w-auto">
                {t('hero.books')}
              </CustomButton>
            </Link>
            <Link to="/technology">
              <CustomButton variant="outline" size="lg" className="w-full sm:w-auto border-shelley-blue text-shelley-blue hover:bg-shelley-blue/10">
                {t('hero.discover')}
              </CustomButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
