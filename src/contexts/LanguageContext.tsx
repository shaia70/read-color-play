
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
  'hero.welcome': 'ברוכים הבאים ל... שלי ספרים',
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
  'book.daniel.story': 'יום ראשון בגן הוא יום מיוחד עבור דניאל. הוא קצת חושש, אבל גם נרגש מאוד. בואו נגלה יחד איך יתמודד ביומו הראשון',
  
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
  
  // Added missing translations
  'footer.home': 'דף הבית',
  'footer.concept': 'קוראים, צובעים, משחקים',
  'footer.books': 'הספרים שלנו', 
  'footer.technology': 'טכנולוגיית AR',
  'footer.contactUs': 'צור קשר',
  'footer.allRights': 'כל הזכויות שמורות',
  'books.comingSoon': 'ספרים נוספים בקרוב!',
  'books.workingOn': 'אנחנו עובדים על ספרים נוספים בסדרה. עקבו אחרינו ברשתות החברתיות לעדכונים.',
  'books.peek': 'הצץ בספר',
  'books.coloring': 'דפי צביעה להורדה',
  'books.description': 'ספרי ילדים מקוריים עם איורים מרהיבים וטכנולוגיית מציאות רבודה',
  'books.bookDescription': 'תיאור הספר',
  'books.ages': 'גילאים:',
  'books.pages': 'מספר עמודים:',
  'books.cover': 'כריכה:',
  'books.language': 'שפה:',
  'books.new': 'חדש!',
  'books.hardcover': 'קשה',
  'books.hebrew': 'עברית',
  
  // Contact page
  'contact.title': 'צור קשר',
  'contact.subtitle': 'יש לכם שאלות או רעיונות? אנחנו תמיד שמחים לשמוע מכם!',
  'contact.form.title': 'שלחו לנו הודעה',
  'contact.form.name': 'שם מלא',
  'contact.form.email': 'דוא"ל',
  'contact.form.subject': 'נושא',
  'contact.form.message': 'הודעה',
  'contact.form.send': 'שלח הודעה',
  'contact.details.title': 'פרטי יצירת קשר',
  'contact.details.email': 'דוא"ל',
  'contact.details.phone': 'טלפון',
  'contact.details.address': 'כתובת',
  'contact.hours.title': 'שעות פעילות:',
  'contact.hours.weekdays': 'ראשון - חמישי:',
  'contact.hours.friday': 'שישי:',
  'contact.hours.saturday': 'שבת:',
  'contact.hours.closed': 'סגור',
  
  // 404 page
  '404.title': 'אופס! הדף לא נמצא',
  '404.back': 'חזרה לדף הבית',
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
  'hero.welcome': 'Welcome to... Shelley Books',
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
  'book.daniel.description': 'A book about the first day in kindergarten, with original illustrations created using artificial intelligence that come to life using augmented reality technology',
  'book.daniel.story': 'The first day of kindergarten is a special day for Daniel. He is a little worried, but also very excited. Let\'s discover together how he will handle his first day',
  
  // AR Technology section
  'ar.title': 'Augmented Reality Technology',
  'ar.description': 'The characters from the books jump off the page and transform into interactive games',
  'ar.howItWorks': 'How Does It Work?',
  'ar.step1': 'Download the "Shelley Books AR" app from the app store',
  'ar.step2': 'Point the camera at an illustration in the book marked with the AR symbol',
  'ar.step3': 'Watch how the illustration comes to life and creates an interactive game on the screen',
  'ar.download': 'Coming Soon: Download the App',
  'ar.moreInfo': 'More Information',
  
  // Footer
  'footer.quickLinks': 'Quick Navigation',
  'footer.contact': 'Contact Us',
  'footer.rights': 'All Rights Reserved',
  
  // Added missing translations
  'footer.home': 'Home',
  'footer.concept': 'Read, Color, Play',
  'footer.books': 'Our Books',
  'footer.technology': 'AR Technology',
  'footer.contactUs': 'Contact Us',
  'footer.allRights': 'All Rights Reserved',
  'books.comingSoon': '!More Books Coming Soon',
  'books.workingOn': 'We are working on more books in the series. Follow us on social media for updates.',
  'books.peek': 'Peek at the Book',
  'books.coloring': 'Download Coloring Pages',
  'books.description': 'Original children\'s books with stunning illustrations and augmented reality technology',
  'books.bookDescription': 'Book Description',
  'books.ages': 'Ages:',
  'books.pages': 'Number of Pages:',
  'books.cover': 'Cover:',
  'books.language': 'Language:',
  'books.new': 'New!',
  'books.hardcover': 'Hardcover',
  'books.hebrew': 'Hebrew',
  
  // Contact page
  'contact.title': 'Contact Us',
  'contact.subtitle': '!Do you have questions or ideas? We are always happy to hear from you',
  'contact.form.title': 'Send Us a Message',
  'contact.form.name': 'Full Name',
  'contact.form.email': 'Email',
  'contact.form.subject': 'Subject',
  'contact.form.message': 'Message',
  'contact.form.send': 'Send Message',
  'contact.details.title': 'Contact Details',
  'contact.details.email': 'Email',
  'contact.details.phone': 'Phone',
  'contact.details.address': 'Address',
  'contact.hours.title': 'Working Hours:',
  'contact.hours.weekdays': 'Sunday - Thursday:',
  'contact.hours.friday': 'Friday:',
  'contact.hours.saturday': 'Saturday:',
  'contact.hours.closed': 'Closed',
  
  // 404 page
  '404.title': 'Oops! Page not found',
  '404.back': 'Return to Home',
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
