
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold mb-4 text-shelley-blue">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          {language === 'en' ? 'Oops! Page not found' : 'אופס! הדף לא נמצא'}
        </p>
        <p className="text-gray-500 mb-6">
          {language === 'en' 
            ? 'The page you are looking for might have been removed or is temporarily unavailable.' 
            : 'הדף שאתה מחפש אולי הוסר או אינו זמין באופן זמני.'}
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-shelley-blue text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <Home className="mr-2 h-5 w-5" />
          {language === 'en' ? 'Return to Home' : 'חזרה לדף הבית'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
