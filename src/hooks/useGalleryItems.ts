
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface GalleryItem {
  title: string;
  image: string;
  alt: string;
  description: string;
  hasDownload: boolean;
}

export function useGalleryItems(): GalleryItem[] {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const isHebrew = language === 'he';
  
  const galleryItems: GalleryItem[] = [
    {
      title: isHebrew ? 'תמונה מהסיפור' : 'Image from the Story',
      image: "/lovable-uploads/59335ecd-65c0-4a29-9ef0-2e2fd1e6c395.png",
      alt: isHebrew ? 'ילד וחיות אנימציה בחדר שינה' : 'Boy and animated animals in bedroom',
      description: isHebrew 
        ? 'סצנה מרכזית מהסיפור - דניאל בחלומו בחדר השינה עם האריה' 
        : 'A key scene from the story - Daniel in his bedroom with the lion',
      hasDownload: false
    },
    {
      title: isHebrew ? 'עמוד מהסיפור' : 'Page from the Story',
      image: isMobile 
        ? "/lovable-uploads/24347697-6068-40c5-8205-ddd5e5004994.png" 
        : "/lovable-uploads/f9826867-282e-4752-b00f-a31ba48f1ce7.png",
      alt: isHebrew ? 'עמוד מהספר עם טקסט בעברית' : 'Book page with Hebrew text',
      description: isHebrew 
        ? 'דף דוגמא למלל מהסיפור' 
        : 'Page sample of text from the story',
      hasDownload: false
    },
    {
      title: isHebrew ? 'דף צביעה לדוגמא' : 'Coloring page sample',
      image: "/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png",
      alt: isHebrew ? 'ילד ודמויות אנימציה' : 'Boy and animated characters',
      description: isHebrew 
        ? 'דף צביעה עם דמויות מהסיפור' 
        : 'Coloring page featuring characters from the story',
      hasDownload: true
    }
  ];
  
  return galleryItems;
}
