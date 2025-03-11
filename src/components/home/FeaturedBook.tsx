import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { ArrowLeft, Eye } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";

export default function FeaturedBook() {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

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
          <h2 className="section-title">הספרים שלנו</h2>
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
              <div className="w-64 h-80 rounded-lg shadow-xl overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-500 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-shelley-blue/20 to-transparent"></div>
                <img 
                  src="https://via.placeholder.com/300x400?text=דניאל+הולך+לגן" 
                  alt="דניאל הולך לגן" 
                  className="w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="p-8 flex flex-col justify-center"
            >
              <span className="text-sm font-medium text-shelley-blue bg-blue-50 rounded-full px-3 py-1 inline-block mb-4">הספר הראשון בסדרה</span>
              <h3 className="text-3xl font-bold mb-4">דניאל הולך לגן</h3>
              <p className="text-gray-600 mb-6">
                ספר על יום ראשון בגן, עם איורים מקוריים שנוצרו באמצעות בינה מלאכותית ומתעוררים לחיים באמצעות טכנולוגיית מציאות רבודה.
              </p>
              <p className="text-gray-600 mb-6">
                יום ראשון בגן הוא יום מיוחד עבור דניאל. הוא קצת חושש, אבל גם נרגש מאוד. בואו נגלה יחד איך עבר עליו היום הראשון!
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <Link to="/books">
                  <CustomButton variant="blue" icon={<Eye />}>
                    פרטים נוספים
                  </CustomButton>
                </Link>
                <Link to="/books">
                  <CustomButton variant="outline" className="border-shelley-blue text-shelley-blue hover:bg-shelley-blue/10">
                    כל הספרים
                    <ArrowLeft className="mr-2 h-4 w-4" />
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
