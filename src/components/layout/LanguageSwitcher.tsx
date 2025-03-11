
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  return (
    <motion.button
      initial={{ opacity: 0.8 }}
      whileHover={{ opacity: 1, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-full bg-gradient-to-r from-shelley-blue to-shelley-purple text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300"
      aria-label={language === 'he' ? 'Switch to English' : 'החלף לעברית'}
    >
      {language === 'he' ? 'EN' : 'HE'}
    </motion.button>
  );
}
