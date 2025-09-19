
import * as React from "react";
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

  const appStoreLink = "https://apps.apple.com/us/app/ar-%D7%A9%D7%9C%D7%99-%D7%A1%D7%A4%D7%A8%D7%99%D7%9D/id6743387119";
  const googlePlayLink = "https://play.google.com/store/apps/details?id=com.ShelleyBooks.AR";
  const currentUrl = isHebrew ? "https://shelley.co.il/download" : "https://shelley.co.il/en/download";
  
  // מידע נוסף לסכמה של האפליקציה
  const appRating = {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "24",
    "bestRating": "5",
    "worstRating": "1"
  };
  
  const appScreenshots = [
    {
      "@type": "ImageObject",
      "contentUrl": "https://shelley.co.il/app-screenshot-1.jpg",
      "description": isHebrew ? "מסך האפליקציה - סריקת ספר" : "App screen - book scanning"
    },
    {
      "@type": "ImageObject",
      "contentUrl": "https://shelley.co.il/app-screenshot-2.jpg",
      "description": isHebrew ? "מסך האפליקציה - משחק אינטראקטיבי" : "App screen - interactive game"
    }
  ];

  return (
    <Helmet>
      <html lang={isHebrew ? "he" : "en"} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://shelley.co.il/og-image.png" />
      <meta property="og:site_name" content={isHebrew ? "שלי ספרים" : "Shelley Books"} />
      <meta property="og:locale" content={isHebrew ? "he_IL" : "en_US"} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content="https://shelley.co.il/og-image.png" />
      
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" href="https://shelley.co.il/download" hrefLang="he" />
      <link rel="alternate" href="https://shelley.co.il/en/download" hrefLang="en" />
      <link rel="alternate" href="https://shelley.co.il/download" hrefLang="x-default" />
      
      {/* עדכון עבור מהירות אינדקס גבוהה יותר */}
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="geo.region" content="IL" />
      <meta name="geo.placename" content="Israel" />
      
      {/* Schema.org structured data for SoftwareApplication with enhanced data */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "${isHebrew ? "שלי ספרים AR" : "Shelley Books AR"}",
            "alternateName": "${isHebrew ? "Shelley Books AR" : "שלי ספרים AR"}",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Android, iOS",
            "description": "${pageDescription}",
            "releaseNotes": "${isHebrew ? "מאפשר הקלטת קול של ההורים כמספרי הסיפור" : "Allows parents to record their voice as storytellers"}",
            "datePublished": "2023-11-01",
            "downloadUrl": "${currentUrl}",
            "installUrl": "${googlePlayLink}",
            "screenshot": ${JSON.stringify(appScreenshots)},
            "aggregateRating": ${JSON.stringify(appRating)},
            "offers": [
              {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "ILS",
                "availability": "https://schema.org/InStock",
                "url": "${googlePlayLink}"
              },
              {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "ILS",
                "availability": "https://schema.org/InStock",
                "url": "${appStoreLink}"
              }
            ],
            "author": {
              "@type": "Organization",
              "name": "${isHebrew ? "שלי ספרים" : "Shelley Books"}",
              "url": "https://shelley.co.il/"
            },
            "publisher": {
              "@type": "Organization",
              "name": "${isHebrew ? "שלי ספרים" : "Shelley Books"}",
              "url": "https://shelley.co.il/"
            },
            "applicationSubCategory": "ChildrensApplication",
            "contentRating": "Everyone",
            "fileSize": "25MB",
            "softwareVersion": "1.0.2",
            "supportingData": {
              "@type": "Dataset",
              "description": "${isHebrew ? "איורים מהספרים שמשמשים לחוויית המציאות הרבודה" : "Illustrations from the books used for the augmented reality experience"}"
            }
          }
        `}
      </script>

      {/* SameAs for parent organization to connect with other web properties */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "${isHebrew ? "שלי ספרים" : "Shelley Books"}",
            "url": "https://shelley.co.il/",
            "logo": "https://shelley.co.il/favicon.svg",
            "sameAs": [
              "https://www.facebook.com/shelleybooks",
              "https://www.instagram.com/shelley.books"
            ]
          }
        `}
      </script>
      
      {/* BreadcrumbList Schema to show path to this page */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "${isHebrew ? "דף הבית" : "Home"}",
                "item": "https://shelley.co.il/${isHebrew ? "" : "en/"}"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "${isHebrew ? "הורד את האפליקציה" : "Download Our App"}",
                "item": "${currentUrl}"
              }
            ]
          }
        `}
      </script>
    </Helmet>
  );
};

export default DownloadSEO;
