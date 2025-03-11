
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold text-shelley-blue mb-3">שלי ספרים</h3>
            <p className="text-gray-600 mb-4">
              ספרי ילדים מקוריים עם טכנולוגיית מציאות רבודה
            </p>
            <div className="flex justify-center md:justify-end space-x-4 space-x-reverse">
              <a href="#" className="text-shelley-blue hover:text-shelley-purple transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-shelley-blue hover:text-shelley-purple transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-shelley-blue hover:text-shelley-purple transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold text-shelley-blue mb-3">ניווט מהיר</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-shelley-blue transition-colors">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link to="/concept" className="text-gray-600 hover:text-shelley-blue transition-colors">
                  קוראים, צובעים, משחקים
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-gray-600 hover:text-shelley-blue transition-colors">
                  הספרים שלנו
                </Link>
              </li>
              <li>
                <Link to="/technology" className="text-gray-600 hover:text-shelley-blue transition-colors">
                  טכנולוגיית AR
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-shelley-blue transition-colors">
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-shelley-blue mb-3">צור קשר</h3>
            <div className="flex items-center justify-center md:justify-start mb-2">
              <Mail className="w-5 h-5 text-shelley-orange ml-2" />
              <span className="text-gray-600">info@shelley.co.il</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Phone className="w-5 h-5 text-shelley-orange ml-2" />
              <span className="text-gray-600">053-1234567</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} שלי ספרים. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
