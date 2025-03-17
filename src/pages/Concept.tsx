
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { BookOpen, Palette, Gamepad2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageDirectionWrapper from "@/components/layout/LanguageDirectionWrapper";

const Concept = () => {
  const { t, language } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <main className="pt-28 pb-20">
        <div className="page-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">{t('concept.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('concept.description')}
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 ${language === 'en' ? 'text-left' : 'text-right'}`}>
            <div className="glass-card p-8 flex flex-col items-center">
              <div className="bg-shelley-blue w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">{t('concept.reading.title')}</h2>
              <p className="text-gray-600 text-center mb-6">
                {t('concept.reading.description')}
              </p>
              <ul className="w-full space-y-3 mb-6">
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-blue ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Fascinating and enriching stories' : 'סיפורים מרתקים ומעשירים'}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-blue ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Original and stunning illustrations' : 'איורים מקוריים ומרהיבים'}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-blue ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-right' : ''}>{language === 'en' ? 'Quality hardcover' : 'כריכה קשה ואיכותית'}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-blue ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-right' : ''}>{language === 'en' ? 'Thick and durable paper' : 'נייר עבה ועמיד'}</span>
                </li>
              </ul>
              <Link to="/books" className="mt-auto">
                <CustomButton variant="blue">
                  {t('footer.books')}
                </CustomButton>
              </Link>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-center">
              <div className="bg-shelley-orange w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">{t('concept.coloring.title')}</h2>
              <p className="text-gray-600 text-center mb-6">
                {t('concept.coloring.description')}
              </p>
              <ul className="w-full space-y-3 mb-6">
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-orange ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Free downloadable coloring pages' : 'דפי צביעה להורדה חינם'}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-orange ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Strengthens motor skills' : 'מחזקים מיומנויות מוטוריות'}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-orange ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Encourages creativity' : 'מעודדים יצירתיות'}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-orange ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Easy to print at home' : 'קלים להדפסה בבית'}</span>
                </li>
              </ul>
              <Link to="/books" className="mt-auto">
                <CustomButton variant="orange">
                  {language === 'en' ? 'Coloring Pages' : 'לדפי הצביעה'}
                </CustomButton>
              </Link>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-center">
              <div className="bg-shelley-purple w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">{t('concept.playing.title')}</h2>
              <p className="text-gray-600 text-center mb-6">
                {t('concept.playing.description')}
              </p>
              <ul className="w-full space-y-3 mb-6">
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-purple ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Characters come to life' : 'הדמויות קמות לחיים'}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-purple ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Interactive games' : 'משחקים אינטראקטיביים'}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-purple ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Easy to use via smartphone' : 'קל לשימוש דרך הסמארטפון'}</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className={`w-5 h-5 text-shelley-purple ${language === 'en' ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`} />
                  <span className={language === 'en' ? 'text-left' : ''}>{language === 'en' ? 'Increases story engagement' : 'מגביר מעורבות בסיפור'}</span>
                </li>
              </ul>
              <Link to="/technology" className="mt-auto">
                <CustomButton variant="purple">
                  {t('footer.technology')}
                </CustomButton>
              </Link>
            </div>
          </div>

          <div className="glass-card">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">{language === 'en' ? 'Why "Read, Color, Play"?' : 'למה "קוראים, צובעים, משחקים"?'}</h2>
              <div className={`max-w-3xl mx-auto ${language === 'en' ? 'text-left' : 'text-right'}`}>
                <p className="text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'In today\'s digital world, children are surrounded by screens and electronic games. At "Shelley Books," we decided to create an experience that combines the best of both worlds: the magic of a printed book with its quality and touch, along with the benefits of innovative technology.'
                    : 'בעולם הדיגיטלי של היום, ילדים מוקפים במסכים ובמשחקים אלקטרוניים. ב"שלי ספרים" החלטנו ליצור חוויה שמשלבת את הטוב שבשני העולמות: הקסם של ספר מודפס עם האיכות והמגע שלו, יחד עם היתרונות של טכנולוגיה חדשנית.'}
                </p>
                <p className="text-gray-600 mb-4">
                  {language === 'en'
                    ? 'Our goal is to encourage children to love reading and develop important skills through a multi-sensory experience that includes:'
                    : 'המטרה שלנו היא לעודד ילדים לאהוב קריאה ולפתח כישורים חשובים דרך חוויה רב-חושית שכוללת:'}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>{language === 'en' ? 'Reading' : 'קריאה'}</strong> - {language === 'en'
                    ? 'which develops vocabulary, reading comprehension, and imagination.'
                    : 'שמפתחת אוצר מילים, הבנת הנקרא ודמיון.'}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>{language === 'en' ? 'Coloring' : 'צביעה'}</strong> - {language === 'en'
                    ? 'which strengthens motor skills, concentration, and creativity.'
                    : 'שמחזקת מיומנויות מוטוריות, ריכוז ויצירתיות.'}
                </p>
                <p className="text-gray-600">
                  <strong>{language === 'en' ? 'Play' : 'משחק'}</strong> - {language === 'en'
                    ? 'with AR technology that provides an interactive, enriching, and enjoyable experience that connects the child to the book\'s content in an innovative way.'
                    : 'עם טכנולוגיית AR שמספקת חוויה אינטראקטיבית, מעשירה ומהנה שמחברת בין הילד לתוכן הספר בדרך חדשנית.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Concept;
