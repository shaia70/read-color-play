
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { GalleryImage } from "./GalleryImage";
import { ColoringPageActions } from "./ColoringPageActions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export interface GalleryItem {
  src: string;
  alt: string;
  title: string;
  description: string;
  downloadable: boolean;
}

export function GalleryCarousel() {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [activeImage, setActiveImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);

  const images: GalleryItem[] = [
    {
      src: '/lovable-uploads/8fe0d7ba-092e-4454-8eeb-601b69a16847.png',
      alt: language === 'he' ? 'ילד ודמויות אנימציה' : 'Boy and animated characters',
      title: language === 'he' ? 'דף צביעה עם דמויות מהסיפור' : 'Coloring Page with Story Characters',
      description: language === 'he' ? 'דף צביעה עם דמויות מהעמוד' : 'Coloring page featuring characters from the story',
      downloadable: true
    },
    {
      src: '/lovable-uploads/16e246a7-d0e8-4555-827a-a7a2abc38931.png',
      alt: language === 'he' ? 'עמוד מהסיפור עם טקסט בעברית' : 'Story page with Hebrew text',
      title: language === 'he' ? 'עמוד מהספר' : 'Page from the Book',
      description: language === 'he' ? 'עמוד מתוך הספר האינטראקטיבי עם טקסט בעברית' : 'Page from the interactive book with Hebrew text',
      downloadable: false
    },
    {
      src: '/lovable-uploads/44a963fb-7541-454e-aca5-f9aeb4020eaa.png',
      alt: language === 'he' ? 'טכנולוגיית מציאות רבודה' : 'AR Technology',
      title: language === 'he' ? 'טכנולוגיית מציאות רבודה' : 'AR Technology Demonstration',
      description: language === 'he' ? 'הדגמה של טכנולוגיית המציאות הרבודה המשולבת בספר' : 'Demonstration of the AR technology integrated in the book',
      downloadable: false
    }
  ];

  // Initialize loading state for images
  useEffect(() => {
    setImagesLoaded(new Array(images.length).fill(false));
    setImageErrors(new Array(images.length).fill(false));
  }, [images.length]);

  const handleImageLoad = (index: number) => {
    console.log(`Image ${index} loaded successfully`);
    const newLoadedState = [...imagesLoaded];
    newLoadedState[index] = true;
    setImagesLoaded(newLoadedState);

    // If this was marked as error before, clear it
    if (imageErrors[index]) {
      const newErrorState = [...imageErrors];
      newErrorState[index] = false;
      setImageErrors(newErrorState);
    }
  };

  const handleImageError = (index: number) => {
    console.error(`Failed to load image: ${images[index].src}`);
    const newErrorState = [...imageErrors];
    newErrorState[index] = true;
    setImageErrors(newErrorState);
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {images[activeImage].title}
      </h2>
      
      <div className="flex justify-center mb-6 relative">
        <Carousel 
          className="w-full max-w-xl"
          setApi={(api) => {
            api?.on("select", () => {
              setActiveImage(api.selectedScrollSnap());
            });
          }}
          opts={{
            loop: true,
            align: "center",
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="flex justify-center items-center">
                <GalleryImage
                  src={image.src}
                  alt={image.alt}
                  index={index}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  isLoaded={imagesLoaded[index]}
                  hasError={imageErrors[index]}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={`${isMobile ? 'hidden' : ''} -left-8 lg:-left-12`} />
          <CarouselNext className={`${isMobile ? 'hidden' : ''} -right-8 lg:-right-12`} />
        </Carousel>
      </div>
      
      <p className="text-center text-gray-600 mb-6">
        {images[activeImage].description}
      </p>
      
      {activeImage === 0 && <ColoringPageActions imageSrc={images[0].src} />}
      
      <p className="text-center text-sm text-gray-500 mt-6">
        {isMobile 
          ? (language === 'he' 
            ? "החלק שמאלה או ימינה כדי לראות תמונות נוספות" 
            : "Swipe left or right to see more images")
          : (language === 'he' 
            ? "לחץ על החצים כדי לראות תמונות נוספות" 
            : "Click the arrows to see more images")}
      </p>
    </div>
  );
}
