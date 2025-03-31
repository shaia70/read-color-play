
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

const DownloadSEO = () => {
  const { language } = useLanguage();
  const isHebrew = language === 'he';

  // SEO translations
  const pageTitle = isHebrew 
    ? "הורד את האפליקציה | שלי ספרים - מציאות רבודה" 
    : "Download Our App | Shelley Books - Augmented Reality";
    
  const pageDescription = isHebrew
    ? "הורידו את אפליקציית מציאות רבודה של שלי ספרים וגלו חוויית קריאה חדשנית לילדים. האפליקציה מאפשרת לסרוק את האיורים מהספרים ולראות אותם קמים לחיים"
    : "Download Shelley Books' augmented reality app and discover an innovative reading experience for children. The app allows you to scan illustrations from the books and see them come to life";
    
  const keywords = isHebrew
    ? "הורדת אפליקציה, אפליקציית מציאות רבודה, שלי ספרים AR, אפליקציית AR לילדים, מציאות רבודה לספרים, אפליקציה לסמארטפון, אפליקציה לטאבלט, שלי ספרים"
    : "app download, augmented reality app, Shelley Books AR, AR app for kids, augmented reality for books, smartphone app, tablet app, Shelley Books";

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={isHebrew ? "https://shelley.co.il/download" : "https://shelley.co.il/en/download"} />
      
      {/* Schema.org structured data for SoftwareApplication */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "שלי ספרים AR",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Android, iOS",
            "description": "${pageDescription}",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "ILS"
            },
            "author": {
              "@type": "Organization",
              "name": "שלי ספרים",
              "url": "https://shelley.co.il/"
            },
            "publisher": {
              "@type": "Organization",
              "name": "שלי ספרים"
            }
          }
        `}
      </script>
    </Helmet>
  );
};

export default DownloadSEO;
