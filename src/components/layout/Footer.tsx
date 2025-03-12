
import { Link, useLocation } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();
  const location = useLocation();

  // Enhanced scrollToTop function to ensure it always works
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleNavLinkClick = (event: React.MouseEvent, href: string) => {
    // If we're already on the current page, prevent default navigation
    // and just scroll to top
    if (location.pathname === href) {
      event.preventDefault();
      // Ensure scroll happens with a slight delay to make it more reliable
      setTimeout(() => {
        scrollToTop();
      }, 10);
    } else {
      // For other pages, we'll still scroll to top but let the navigation happen
      scrollToTop();
    }
  };

  const navigationItems = [
    { name: t('footer.home'), href: "/" },
    { name: t('footer.concept'), href: "/concept" },
    { name: t('footer.books'), href: "/books" },
    { name: t('footer.technology'), href: "/technology" },
    { name: t('footer.contactUs'), href: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`text-center ${language === 'en' ? 'md:text-left' : 'md:text-right'}`}>
            <h3 className="text-xl font-bold text-shelley-blue mb-3">
              {language === 'he' ? 'שלי ספרים' : 'Shelley Books'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'he' 
                ? 'ספרי ילדים מקוריים עם טכנולוגיית מציאות רבודה'
                : 'Original children\'s books with augmented reality technology'}
            </p>
            <div className={`flex ${language === 'en' ? 'justify-start' : 'justify-end'} space-x-4 ${language === 'he' ? 'space-x-reverse' : ''} md:justify-${language === 'en' ? 'start' : 'end'}`}>
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
            <h3 className="text-xl font-bold text-shelley-blue mb-3">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    onClick={(e) => handleNavLinkClick(e, item.href)}
                    className={cn(
                      "transition-colors",
                      location.pathname === item.href
                        ? "text-shelley-blue font-medium"
                        : "text-gray-600 hover:text-shelley-blue"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={`text-center ${language === 'en' ? 'md:text-right' : 'md:text-left'}`}>
            <h3 className="text-xl font-bold text-shelley-blue mb-3">{t('footer.contact')}</h3>
            <div className={`flex items-center justify-center ${language === 'en' ? 'md:justify-end' : 'md:justify-start'} mb-2`}>
              <Mail className={`w-5 h-5 text-shelley-orange ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
              <span className="text-gray-600">info@shelley.co.il</span>
            </div>
            <div className={`flex items-center justify-center ${language === 'en' ? 'md:justify-end' : 'md:justify-start'}`}>
              <Phone className={`w-5 h-5 text-shelley-orange ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
              <span className="text-gray-600">053-1234567</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} {language === 'he' ? 'שלי ספרים' : 'Shelley Books'}. {t('footer.allRights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
