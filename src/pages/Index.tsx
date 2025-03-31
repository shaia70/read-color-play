
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Hero from "@/components/home/Hero";
import Concept from "@/components/home/Concept";
import FeaturedBook from "@/components/home/FeaturedBook";
import ARTechnology from "@/components/home/ARTechnology";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { language } = useLanguage();
  const isHebrew = language === 'he';
  
  // SEO translations
  const pageTitle = isHebrew 
    ? "שלי ספרים - חוויית קריאה אינטראקטיבית לילדים" 
    : "Shelley Books - Interactive Reading Experience for Children";
    
  const pageDescription = isHebrew
    ? "שלי ספרים מציעה חוויית קריאה מהפכנית המשלבת ספרים מודפסים, דפי צביעה ומציאות רבודה. קוראים, צובעים ומשחקים עם הדמויות שקמות לחיים!"
    : "Shelley Books offers a revolutionary reading experience combining printed books, coloring pages, and augmented reality. Read, color, and play with characters that come to life!";
    
  const keywords = isHebrew
    ? "ספרי ילדים, ספרים לילדים, מציאות רבודה, AR לילדים, דפי צביעה לילדים, ספרים אינטראקטיביים, שלי ספרים, ספרים בעברית, ספרי קריאה לילדים, קריאה משולבת משחק"
    : "children's books, books for kids, augmented reality, AR for children, coloring pages for kids, interactive books, Shelley Books, Hebrew books, reading books for children, reading combined with play";

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
        <link rel="canonical" href={isHebrew ? "https://shelley.co.il/" : "https://shelley.co.il/en/"} />
        
        {/* Schema.org structured data for Organization */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "שלי ספרים",
              "alternateName": "Shelley Books",
              "url": "https://shelley.co.il/",
              "logo": "https://shelley.co.il/favicon.svg",
              "sameAs": []
            }
          `}
        </script>
        
        {/* Schema.org structured data for Product */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "ספרי ילדים אינטראקטיביים",
              "description": "ספרים אינטראקטיביים לילדים המשלבים מציאות רבודה",
              "brand": {
                "@type": "Brand",
                "name": "שלי ספרים"
              }
            }
          `}
        </script>
      </Helmet>
      
      <Header />
      <main>
        <Hero />
        <Concept />
        <FeaturedBook />
        <ARTechnology />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
