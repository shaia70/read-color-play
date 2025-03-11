
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Eye, Download } from "lucide-react";
import bookCover from "@/assets/book-cover.svg";

const Books = () => {
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
            <h1 className="text-4xl font-bold mb-6">הספרים שלנו</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ספרי ילדים מקוריים עם איורים מרהיבים וטכנולוגיית מציאות רבודה
            </p>
          </div>

          <div className="glass-card mb-16 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex justify-center">
                <div className="book-cover relative">
                  <div className="w-64 h-80 rounded-lg shadow-xl overflow-hidden transform hover:rotate-0 transition-all duration-500 relative">
                    <img 
                      src={bookCover} 
                      alt="דניאל הולך לגן" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-shelley-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                      חדש!
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">דניאל הולך לגן</h2>
                <p className="text-gray-600 mb-6">
                  ספר על יום ראשון בגן, עם איורים מקוריים שנוצרו באמצעות בינה מלאכותית ומתעוררים לחיים באמצעות טכנולוגיית מציאות רבודה.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">תיאור הספר:</h3>
                  <p className="text-gray-600">
                    יום ראשון בגן הוא יום מיוחד עבור דניאל. הוא קצת חושש, אבל גם נרגש מאוד. בספר זה, דניאל מתמודד עם החששות שלו, פוגש חברים חדשים ומגלה כמה כיף יכול להיות בגן. סיפור מרגש ומעצים לכל ילד שמתחיל גן.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-shelley-blue/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-blue">גילאים:</p>
                    <p>3-6</p>
                  </div>
                  <div className="bg-shelley-purple/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-purple">מספר עמודים:</p>
                    <p>24</p>
                  </div>
                  <div className="bg-shelley-orange/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-orange">כריכה:</p>
                    <p>קשה</p>
                  </div>
                  <div className="bg-shelley-green/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-green">שפה:</p>
                    <p>עברית</p>
                  </div>
                </div>
                
                <div className="flex space-x-4 space-x-reverse">
                  <CustomButton variant="green" icon={<Eye />}>
                    הצץ בספר
                  </CustomButton>
                  <CustomButton variant="orange" icon={<Download />}>
                    דפי צביעה להורדה
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">ספרים נוספים בקרוב!</h2>
            <p className="text-gray-600">
              אנחנו עובדים על ספרים נוספים בסדרה. עקבו אחרינו ברשתות החברתיות לעדכונים.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Books;
