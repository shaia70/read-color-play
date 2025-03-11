
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";

export default function Hero() {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

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

  return (
    <section className="relative min-h-screen pt-28 pb-20 flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-shelley-blue/10 animate-float" style={{ animationDelay: "0s" }}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 rounded-full bg-shelley-orange/10 animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 left-1/4 w-56 h-56 rounded-full bg-shelley-purple/10 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 right-1/5 w-48 h-48 rounded-full bg-shelley-green/10 animate-float" style={{ animationDelay: "1.5s" }}></div>
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
            קוראים • צובעים • משחקים
          </motion.span>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            ברוכים הבאים ל{" "}
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red">
                'שלי ספרים'
              </span>
              <Sparkles className="absolute -top-5 -left-5 w-8 h-8 text-shelley-orange animate-pulse" />
            </span>
          </motion.h1>
          
          <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl text-gray-600 mb-8">
            Shelley Books
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            ספרי ילדים מקוריים עם איורים שנוצרו באמצעות בינה מלאכותית ומשולבים בטכנולוגיית מציאות רבודה
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/books">
              <CustomButton variant="blue" size="lg" icon={<BookOpen />} className="w-full sm:w-auto">
                הספרים שלנו
              </CustomButton>
            </Link>
            <Link to="/technology">
              <CustomButton variant="outline" size="lg" className="w-full sm:w-auto border-shelley-blue text-shelley-blue hover:bg-shelley-blue/10">
                גלה את טכנולוגיית ה-AR
              </CustomButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
