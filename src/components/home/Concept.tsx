
import * as React from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { BookOpen, Palette, Gamepad2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Concept() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  const { t, language } = useLanguage();

  React.useEffect(() => {
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

  const conceptCards = [
    {
      title: t('concept.reading.title'),
      description: t('concept.reading.description'),
      icon: <BookOpen className="w-10 h-10 text-white" />,
      color: "bg-shelley-blue"
    },
    {
      title: t('concept.coloring.title'),
      description: t('concept.coloring.description'),
      icon: <Palette className="w-10 h-10 text-white" />,
      color: "bg-shelley-orange"
    },
    {
      title: t('concept.playing.title'),
      description: t('concept.playing.description'),
      icon: <Gamepad2 className="w-10 h-10 text-white" />,
      color: "bg-shelley-purple"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            {t('concept.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('concept.description')}
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${language === 'en' ? 'text-left' : 'text-right'}`}
        >
          {conceptCards.map((card, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="glass-card p-8 text-center group hover:shadow-xl transition-all duration-500"
            >
              <div className={`${card.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
