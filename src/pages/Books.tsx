
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { Eye, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Books = () => {
  const { t, language } = useLanguage();
  const [isZoomed, setIsZoomed] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const isHebrew = language === 'he';

  // SEO translations
  const pageTitle = isHebrew 
    ? "הספרים שלנו | שלי ספרים - ספרי ילדים אינטראקטיביים" 
    : "Our Books | Shelley Books - Interactive Children's Books";
    
  const pageDescription = isHebrew
    ? "גלו את ספרי הילדים האינטראקטיביים של שלי ספרים, המשלבים איורים מרהיבים וטכנולוגיית מציאות רבודה. ספרים מקוריים לילדים שהופכים את הקריאה לחוויה מרתקת"
    : "Discover Shelley Books' interactive children's books, combining stunning illustrations and augmented reality technology. Original books for children that make reading a fascinating experience";
    
  const keywords = isHebrew
    ? "ספרי ילדים, ספרים לילדים, ספרים אינטראקטיביים, דניאל הולך לגן, ספרי קריאה לילדים, ספרים עם מציאות רבודה, שלי ספרים, ספרי ילדים בעברית"
    : "children's books, books for kids, interactive books, Daniel Goes to Kindergarten, reading books for children, books with augmented reality, Shelley Books, Hebrew children's books";

  const toggleZoom = () => {
    if (isMobile) return; // Prevent zooming on mobile
    setIsZoomed(!isZoomed);
  };

  const navigateToARSection = () => {
    navigate('/');
    setTimeout(() => {
      const arSection = document.getElementById('ar-technology');
      if (arSection) {
        arSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const navigateToDownload = () => {
    navigate('/download');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={isHebrew ? "https://shelley.co.il/books" : "https://shelley.co.il/en/books"} />
        
        {/* Schema.org structured data for Books */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item": {
                    "@type": "Book",
                    "name": "${isHebrew ? 'דניאל הולך לגן' : 'Daniel Goes to Kindergarten'}",
                    "author": {
                      "@type": "Organization",
                      "name": "שלי ספרים"
                    },
                    "bookFormat": "Hardcover",
                    "numberOfPages": "40",
                    "inLanguage": "he",
                    "audience": {
                      "@type": "Audience",
                      "suggestedMinAge": "3",
                      "suggestedMaxAge": "6"
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": "שלי ספרים"
                    },
                    "image": "https://shelley.co.il/lovable-uploads/f3774be2-f5fb-45b0-a9e8-83e77df84a9e.png",
                    "description": "${isHebrew ? 'ספר על יום ראשון בגן, עם איורים מקוריים שנוצרו באמצעות בינה מלאכותית ומתעוררים לחיים באמצעות טכנולוגיית מציאות רבודה' : 'A book about the first day in kindergarten, with original illustrations created using artificial intelligence that come to life using augmented reality technology'}"
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "item": {
                    "@type": "Book",
                    "name": "${isHebrew ? 'דניאל והאח החדש' : 'Daniel and the New Brother'}",
                    "author": {
                      "@type": "Person",
                      "name": "שי אהרונוב"
                    },
                    "bookFormat": "Hardcover",
                    "numberOfPages": "32",
                    "inLanguage": "he",
                    "audience": {
                      "@type": "Audience",
                      "suggestedMinAge": "3",
                      "suggestedMaxAge": "6"
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": "שלי ספרים"
                    },
                    "image": "https://shelley.co.il/lovable-uploads/daniel-new-brother-front.png",
                    "description": "${isHebrew ? 'סיפור מרגש על משפחה, קבלה, ותפקידו הקסום של אח גדול. כשאמא ואבא מספרים לדניאל שבקרוב יוולד לו אח קטן, הוא מרגיש הכל ביחד - שמחה, בלבול וקצת פחד. עם איורים מקוריים ומציאות רבודה' : 'A touching story about family, acceptance, and the magical role of being a big brother. When Mom and Dad tell Daniel he will soon have a little brother, he feels everything at once - joy, confusion, and a little fear. With original illustrations and augmented reality technology'}"
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      
      <Header />
      <main className="pt-28 pb-20">
        <div className="page-container">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">{t('books.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('books.description')}
            </p>
          </div>

          <div className="glass-card mb-16 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex justify-center">
                <div className="book-cover relative">
                  <div 
                    className={`${isZoomed ? 'w-128 h-128 z-10 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'w-64 h-64'} rounded-lg shadow-xl overflow-hidden transition-all duration-500 ${isMobile ? '' : 'cursor-pointer'}`}
                    onClick={toggleZoom}
                  >
                    <img 
                      src="/lovable-uploads/f3774be2-f5fb-45b0-a9e8-83e77df84a9e.png" 
                      alt={t('book.daniel.title')} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-shelley-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                      {t('books.new')}
                    </div>
                  </div>
                  {isZoomed && (
                    <div 
                      className="fixed inset-0 bg-black/50 z-0"
                      onClick={toggleZoom}
                    ></div>
                  )}
                </div>
              </div>
              
              <div className={`flex flex-col justify-center ${language === 'en' ? 'text-left' : 'text-right'}`}>
                <h2 className="text-3xl font-bold mb-4">{t('book.daniel.title')}</h2>
                <p className="text-gray-600 mb-6">
                  {t('book.daniel.description')}
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className={`font-bold mb-2 ${language === 'he' ? 'text-right' : 'text-left'}`}>
                    {t('books.bookDescription')}
                  </h3>
                  <p className="text-gray-600">
                    {t('book.daniel.story')}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-shelley-blue/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-blue">{t('books.ages')}</p>
                    <p>3-6</p>
                  </div>
                  <div className="bg-shelley-purple/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-purple">{t('books.pages')}</p>
                    <p>40</p>
                  </div>
                  <div className="bg-shelley-orange/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-orange">{t('books.cover')}</p>
                    <p>{t('books.hardcover')}</p>
                  </div>
                  <div className="bg-shelley-green/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-green">{t('books.language')}</p>
                    <p>{t('books.hebrew')}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-6 mb-4">
                  <CustomButton 
                    variant="green" 
                    size="lg" 
                    icon={<Eye className="w-6 h-6" />} 
                    className={`text-base px-8 py-3 h-14 min-h-0 w-64 font-bold ${language === 'he' ? 'justify-start' : ''}`}
                    onClick={navigateToARSection}
                  >
                    {t('books.peek')}
                  </CustomButton>
                  <CustomButton 
                    variant="orange" 
                    size="lg" 
                    icon={<Download className="w-6 h-6" />} 
                    className={`text-base px-8 py-3 h-14 min-h-0 w-64 font-bold ${language === 'he' ? 'justify-start' : ''}`}
                    onClick={navigateToDownload}
                  >
                    {t('books.coloring')}
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
          
          {/* Second Book - Bat and the Letter B */}
          <div className="glass-card mb-16 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex justify-center">
                <div className="book-cover relative">
                  <div 
                    className={`${isZoomed ? 'w-128 h-128 z-10 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'w-64 h-64'} rounded-lg shadow-xl overflow-hidden transition-all duration-500 ${isMobile ? '' : 'cursor-pointer'}`}
                    onClick={toggleZoom}
                  >
                    <img 
                      src="/lovable-uploads/daniel-new-brother-front.png" 
                      alt={t('book.newbrother.title')} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-shelley-green text-white text-xs font-bold px-2 py-1 rounded-full">
                      {t('books.new')}
                    </div>
                  </div>
                  {isZoomed && (
                    <div 
                      className="fixed inset-0 bg-black/50 z-0"
                      onClick={toggleZoom}
                    ></div>
                  )}
                </div>
              </div>
              
              <div className={`flex flex-col justify-center ${language === 'en' ? 'text-left' : 'text-right'}`}>
                <h2 className="text-3xl font-bold mb-4">{t('book.newbrother.title')}</h2>
                <p className="text-gray-600 mb-6">
                  {t('book.newbrother.description')}
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className={`font-bold mb-2 ${language === 'he' ? 'text-right' : 'text-left'}`}>
                    {t('books.bookDescription')}
                  </h3>
                  <p className="text-gray-600">
                    {t('book.newbrother.story')}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-shelley-blue/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-blue">{t('books.ages')}</p>
                    <p>3-6</p>
                  </div>
                  <div className="bg-shelley-purple/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-purple">{t('books.pages')}</p>
                    <p>32</p>
                  </div>
                  <div className="bg-shelley-orange/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-orange">{t('books.cover')}</p>
                    <p>{t('books.hardcover')}</p>
                  </div>
                  <div className="bg-shelley-green/10 p-3 rounded-lg">
                    <p className="font-bold text-shelley-green">{t('books.language')}</p>
                    <p>{t('books.hebrew')}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-6 mb-4">
                  <CustomButton 
                    variant="green" 
                    size="lg" 
                    icon={<Eye className="w-6 h-6" />} 
                    className={`text-base px-8 py-3 h-14 min-h-0 w-64 font-bold ${language === 'he' ? 'justify-start' : ''}`}
                    onClick={navigateToARSection}
                  >
                    {t('books.peek')}
                  </CustomButton>
                  <CustomButton 
                    variant="orange" 
                    size="lg" 
                    icon={<Download className="w-6 h-6" />} 
                    className={`text-base px-8 py-3 h-14 min-h-0 w-64 font-bold ${language === 'he' ? 'justify-start' : ''}`}
                    onClick={navigateToDownload}
                  >
                    {t('books.coloring')}
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('books.comingSoon')}</h2>
            <p className="text-gray-600">
              {t('books.workingOn')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Books;
