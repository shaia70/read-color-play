
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

const GallerySEO: React.FC = () => {
  const { language } = useLanguage();
  const isHebrew = language === 'he';
  
  // SEO translations
  const pageTitle = isHebrew 
    ? "גלריה | שלי ספרים - תמונות ודפי צביעה" 
    : "Gallery | Shelley Books - Images and Coloring Pages";
    
  const pageDescription = isHebrew
    ? "גלריית תמונות ודפי צביעה מהספר 'דניאל הולך לגן'. הורידו דפי צביעה חינמיים של הדמויות האהובות מספרי הילדים של שלי ספרים"
    : "Image gallery and coloring pages from 'Daniel Goes to Kindergarten'. Download free coloring pages of beloved characters from Shelley Books children's books";
    
  const keywords = isHebrew
    ? "דפי צביעה, תמונות מהספר, דניאל הולך לגן, איורים לילדים, דפי צביעה להדפסה, גלריית ספרי ילדים, שלי ספרים, דפי עבודה לילדים"
    : "coloring pages, book images, Daniel Goes to Kindergarten, illustrations for children, printable coloring pages, children's book gallery, Shelley Books, activities for children";

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={isHebrew ? "https://shelley.co.il/gallery" : "https://shelley.co.il/en/gallery"} />
      
      {/* Schema.org structured data for ImageGallery */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "${isHebrew ? 'גלריית תמונות ודפי צביעה' : 'Image Gallery and Coloring Pages'}",
            "description": "${pageDescription}",
            "image": "https://shelley.co.il/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png",
            "publisher": {
              "@type": "Organization",
              "name": "שלי ספרים",
              "logo": {
                "@type": "ImageObject",
                "url": "https://shelley.co.il/favicon.svg"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://shelley.co.il/gallery"
            }
          }
        `}
      </script>
    </Helmet>
  );
};

export default GallerySEO;
