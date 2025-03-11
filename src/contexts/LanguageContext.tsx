
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'he' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hebrew translations
const heTranslations: Record<string, string> = {
  // Home page
  'nav.home': 'בית',
  'nav.concept': 'קוראים, צובעים, משחקים',
  'nav.books': 'הספרים שלנו',
  'nav.technology': 'טכנולוגיית AR',
  'nav.contact': 'צור קשר',
  
  // Hero section
  'hero.tagline': 'קוראים • צובעים • משחקים',
  'hero.welcome': "ברוכים הבאים ל'שלי ספרים'",
  'hero.subtitle': 'Shelley Books',
  'hero.description': 'ספרי ילדים מקוריים עם איורים שנוצרו באמצעות בינה מלאכותית ומשולבים בטכנולוגיית מציאות רבודה',
  'hero.books': 'הספרים שלנו',
  'hero.discover': 'גלה את טכנולוגיית ה-AR',
  
  // Concept section
  'concept.title': 'קוראים, צובעים, משחקים',
  'concept.description': 'חוויה ייחודית המשלבת קריאה, יצירה ומשחק אינטראקטיבי בטכנולוגיה חדשנית',
  'concept.reading.title': 'קוראים',
  'concept.reading.description': 'ספרי ילדים מקוריים עם סיפורים מרתקים ואיורים יפהפיים שנוצרו באמצעות בינה מלאכותית.',
  'concept.coloring.title': 'צובעים',
  'concept.coloring.description': 'הורידו דפי צביעה של הדמויות האהובות מהספרים וצבעו אותן בצבעים שאתם אוהבים.',
  'concept.playing.title': 'משחקים',
  'concept.playing.description': 'הדמויות מהספרים קופצות מהדף והופכות למשחקים אינטראקטיביים באמצעות טכנולוגיית מציאות רבודה.',
  
  // Books section
  'books.title': 'הספרים שלנו',
  'books.details': 'פרטים נוספים',
  'books.all': 'כל הספרים',
  'book.firstSeries': 'הספר הראשון בסדרה',
  'book.daniel.title': 'דניאל הולך לגן',
  'book.daniel.description': 'ספר על יום ראשון בגן, עם איורים מקוריים שנוצרו באמצעות בינה מלאכותית ומתעוררים לחיים באמצעות טכנולוגיית מציאות רבודה.',
  'book.daniel.story': 'יום ראשון בגן הוא יום מיוחד עבור דניאל. הוא קצת חושש, אבל גם נרגש מאוד. בואו נגלה יחד איך עבר עליו היום הראשון!',
  
  // AR Technology section
  'ar.title': 'טכנולוגיית מציאות רבודה',
  'ar.description': 'הדמויות מהספרים קופצות מהדף והופכות למשחקים אינטראקטיביים',
  'ar.howItWorks': 'איך זה עובד?',
  'ar.step1': 'הורידו את אפליקציית "שלי ספרים AR" מחנות האפליקציות',
  'ar.step2': 'כוונו את המצלמה לאיור בספר המסומן בסמל ה-AR',
  'ar.step3': 'צפו כיצד האיור קם לחיים וייצר משחק אינטראקטיבי על המסך!',
  'ar.download': 'בקרוב: הורידו את האפליקציה',
  'ar.moreInfo': 'למידע נוסף',
  
  // Footer
  'footer.quickLinks': 'ניווט מהיר',
  'footer.contact': 'צור קשר',
  'footer.rights': 'כל הזכויות שמורות',
};

// English translations
const enTranslations: Record<string, string> = {
  // Home page
  'nav.home': 'Home',
  'nav.concept': 'Read, Color, Play',
  'nav.books': 'Our Books',
  'nav.technology': 'AR Technology',
  'nav.contact': 'Contact',
  
  // Hero section
  'hero.tagline': 'Read • Color • Play',
  'hero.welcome': "Welcome to 'Shelley Books'",
  'hero.subtitle': 'Shelley Books',
  'hero.description': 'Original children\'s books with illustrations created using artificial intelligence and integrated with augmented reality technology',
  'hero.books': 'Our Books',
  'hero.discover': 'Discover AR Technology',
  
  // Concept section
  'concept.title': 'Read, Color, Play',
  'concept.description': 'A unique experience combining reading, creation, and interactive play with innovative technology',
  'concept.reading.title': 'Reading',
  'concept.reading.description': 'Original children\'s books with fascinating stories and beautiful illustrations created using artificial intelligence.',
  'concept.coloring.title': 'Coloring',
  'concept.coloring.description': 'Download coloring pages of your favorite characters from the books and color them in your favorite colors.',
  'concept.playing.title': 'Playing',
  'concept.playing.description': 'The characters from the books jump off the page and transform into interactive games using augmented reality technology.',
  
  // Books section
  'books.title': 'Our Books',
  'books.details': 'More Details',
  'books.all': 'All Books',
  'book.firstSeries': 'First Book in the Series',
  'book.daniel.title': 'Daniel Goes to Kindergarten',
  'book.daniel.description': 'A book about the first day in kindergarten, with original illustrations created using artificial intelligence that come to life using augmented reality technology.',
  'book.daniel.story': 'The first day of kindergarten is a special day for Daniel. He is a little worried, but also very excited. Let\'s discover together how his first day went!',
  
  // AR Technology section
  'ar.title': 'Augmented Reality Technology',
  'ar.description': 'The characters from the books jump off the page and transform into interactive games',
  'ar.howItWorks': 'How Does It Work?',
  'ar.step1': 'Download the "Shelley Books AR" app from the app store',
  'ar.step2': 'Point the camera at an illustration in the book marked with the AR symbol',
  'ar.step3': 'Watch how the illustration comes to life and creates an interactive game on the screen!',
  'ar.download': 'Coming Soon: Download the App',
  'ar.moreInfo': 'More Information',
  
  // Footer
  'footer.quickLinks': 'Quick Navigation',
  'footer.contact': 'Contact Us',
  'footer.rights': 'All Rights Reserved',
};

const translations: Record<Language, Record<string, string>> = {
  he: heTranslations,
  en: enTranslations
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('he');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
