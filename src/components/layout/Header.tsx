
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, BookOpen, Palette, Gamepad2, BookType, PhoneCall, Download, Image, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import Logo from "./Logo";
import AccessibilityMenu from "./AccessibilityMenu";

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Enhanced scrollToTop function to ensure it always works
  const scrollToTop = () => {
    // Force scroll to exactly 0
    window.scrollTo(0, 0);
    
    // Then do the smooth scroll for better UX
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 10);
  };
  
  const handleNavLinkClick = (event: React.MouseEvent, href: string) => {
    // Always close the mobile menu regardless of which link is clicked
    setMobileMenuOpen(false);
    
    // If we're already on the current page, prevent default navigation
    // and just scroll to top
    if (location.pathname === href) {
      event.preventDefault();
      scrollToTop();
    } else {
      // For other pages, we'll still scroll to top but let the navigation happen
      scrollToTop();
    }
  };

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      scrollToTop();
    } else {
      navigate("/");
      scrollToTop();
    }
  };

  const navigationItems = [
    { name: t('nav.home'), href: "/", icon: <BookType className="h-5 w-5" /> },
    { name: t('nav.concept'), href: "/concept", icon: <BookOpen className="h-5 w-5" /> },
    { name: t('nav.books'), href: "/books", icon: <Palette className="h-5 w-5" /> },
    { name: t('nav.technology'), href: "/technology", icon: <Gamepad2 className="h-5 w-5" /> },
    { name: language === 'he' ? 'גלריה' : 'Gallery', href: "/gallery", icon: <Image className="h-5 w-5" /> },
    { name: t('nav.contact'), href: "/contact", icon: <PhoneCall className="h-5 w-5" /> },
    { name: language === 'en' ? 'Download App' : 'הורד אפליקציה', href: "/download", icon: <Download className="h-5 w-5" /> },
    { name: t('nav.orderBook'), href: "/physical-book", icon: <ShoppingCart className="h-5 w-5" /> },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <Logo showTagline={!isScrolled} />
        </div>

        {/* Desktop Navigation */}
        <nav className={cn(
          "hidden md:flex items-center",
          language === 'he' ? "space-x-reverse space-x-1" : "space-x-1"
        )}>
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={(e) => handleNavLinkClick(e, item.href)}
              className={cn(
                "px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 mx-1 flex items-center",
                location.pathname === item.href
                  ? "bg-shelley-blue text-white shadow-md"
                  : "hover:bg-shelley-blue/10"
              )}
            >
              <span className={language === 'he' ? "ml-1.5" : "mr-1.5"}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          <div className={cn("flex items-center", language === 'he' ? "mr-2 space-x-reverse space-x-2" : "ml-2 space-x-2")}>
            <AccessibilityMenu />
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className={cn("md:hidden flex items-center", language === 'he' ? "space-x-reverse space-x-2" : "space-x-2")}>
          <AccessibilityMenu />
          <LanguageSwitcher />
          <button
            className="flex items-center text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 py-3 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => handleNavLinkClick(e, item.href)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium flex items-center",
                    location.pathname === item.href
                      ? "bg-shelley-blue text-white"
                      : "hover:bg-shelley-blue/10",
                    language === 'he' ? "justify-end" : "justify-start"
                  )}
                >
                  <span className={language === 'he' ? "ml-2" : "mr-2"}>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
