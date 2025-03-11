
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { BookOpen, Palette, Gamepad2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Concept = () => {
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
            <h1 className="text-4xl font-bold mb-6">קוראים, צובעים, משחקים</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              הקונספט שמאחורי ספרי "שלי ספרים" המשלבים קריאה, יצירה וטכנולוגיה
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="glass-card p-8 flex flex-col items-center">
              <div className="bg-shelley-blue w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">קוראים</h2>
              <p className="text-gray-600 text-center mb-6">
                ספרי ילדים מקוריים עם סיפורים מרתקים ומעשירים שנכתבו במיוחד עבור ילדים בגיל הרך.
              </p>
              <ul className="w-full space-y-3 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-blue ml-2 mt-1 flex-shrink-0" />
                  <span>סיפורים מרתקים ומעשירים</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-blue ml-2 mt-1 flex-shrink-0" />
                  <span>איורים מקוריים ומרהיבים</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-blue ml-2 mt-1 flex-shrink-0" />
                  <span>כריכה קשה ואיכותית</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-blue ml-2 mt-1 flex-shrink-0" />
                  <span>נייר עבה ועמיד</span>
                </li>
              </ul>
              <Link to="/books" className="mt-auto">
                <CustomButton variant="blue">
                  לספרים שלנו
                </CustomButton>
              </Link>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-center">
              <div className="bg-shelley-orange w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">צובעים</h2>
              <p className="text-gray-600 text-center mb-6">
                דפי צביעה של הדמויות האהובות מהספרים מעודדים יצירתיות ומשפרים מיומנויות מוטוריות.
              </p>
              <ul className="w-full space-y-3 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-orange ml-2 mt-1 flex-shrink-0" />
                  <span>דפי צביעה להורדה חינם</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-orange ml-2 mt-1 flex-shrink-0" />
                  <span>מחזקים מיומנויות מוטוריות</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-orange ml-2 mt-1 flex-shrink-0" />
                  <span>מעודדים יצירתיות</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-orange ml-2 mt-1 flex-shrink-0" />
                  <span>קלים להדפסה בבית</span>
                </li>
              </ul>
              <Link to="/books" className="mt-auto">
                <CustomButton variant="orange">
                  לדפי הצביעה
                </CustomButton>
              </Link>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-center">
              <div className="bg-shelley-purple w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">משחקים</h2>
              <p className="text-gray-600 text-center mb-6">
                טכנולוגיית מציאות רבודה (AR) הופכת את הדמויות מהספר למשחקים אינטראקטיביים מרתקים.
              </p>
              <ul className="w-full space-y-3 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-purple ml-2 mt-1 flex-shrink-0" />
                  <span>הדמויות קמות לחיים</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-purple ml-2 mt-1 flex-shrink-0" />
                  <span>משחקים אינטראקטיביים</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-purple ml-2 mt-1 flex-shrink-0" />
                  <span>קל לשימוש דרך הסמארטפון</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-shelley-purple ml-2 mt-1 flex-shrink-0" />
                  <span>מגביר מעורבות בסיפור</span>
                </li>
              </ul>
              <Link to="/technology" className="mt-auto">
                <CustomButton variant="purple">
                  למידע על הטכנולוגיה
                </CustomButton>
              </Link>
            </div>
          </div>

          <div className="glass-card">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">למה "קוראים, צובעים, משחקים"?</h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-gray-600 mb-4">
                  בעולם הדיגיטלי של היום, ילדים מוקפים במסכים ובמשחקים אלקטרוניים. ב"שלי ספרים" החלטנו ליצור חוויה שמשלבת את הטוב שבשני העולמות: הקסם של ספר מודפס עם האיכות והמגע שלו, יחד עם היתרונות של טכנולוגיה חדשנית.
                </p>
                <p className="text-gray-600 mb-4">
                  המטרה שלנו היא לעודד ילדים לאהוב קריאה ולפתח כישורים חשובים דרך חוויה רב-חושית שכוללת:
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>קריאה</strong> - שמפתחת אוצר מילים, הבנת הנקרא ודמיון.
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>צביעה</strong> - שמחזקת מיומנויות מוטוריות, ריכוז ויצירתיות.
                </p>
                <p className="text-gray-600">
                  <strong>משחק</strong> - עם טכנולוגיית AR שמספקת חוויה אינטראקטיבית, מעשירה ומהנה שמחברת בין הילד לתוכן הספר בדרך חדשנית.
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
