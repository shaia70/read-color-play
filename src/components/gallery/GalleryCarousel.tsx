
import React, { useState, useCallback, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import GalleryItem from "./GalleryItem";

interface GalleryItem {
  title: string;
  image: string;
  alt: string;
  description: string;
  hasDownload: boolean;
}

interface GalleryCarouselProps {
  items: GalleryItem[];
}

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ items }) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [activeSlide, setActiveSlide] = useState(0);
  const [api, setApi] = useState<any>(null);
  const isRTL = language === 'he';
  
  const onCarouselSelect = useCallback((api: any) => {
    if (!api) return;
    
    const selectedIndex = api.selectedScrollSnap();
    setActiveSlide(selectedIndex);
  }, []);
  
  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
      setActiveSlide(index);
    }
  };

  useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setActiveSlide(selectedIndex);
    };
    
    api.on('select', handleSelect);
    
    return () => {
      api.off('select', handleSelect);
    };
  }, [api, language]);

  return (
    <div className="max-w-5xl mx-auto mb-12 px-4">
      <Carousel 
        className="w-full relative"
        opts={{ 
          loop: true,
          dragFree: false,
          align: "center",
          direction: isRTL ? 'rtl' : 'ltr'
        }}
        onSelect={onCarouselSelect}
        setApi={setApi}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="w-full">
              <GalleryItem 
                title={item.title}
                image={item.image}
                alt={item.alt}
                description={item.description}
                hasDownload={item.hasDownload}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="hidden sm:block">
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
        
        {/* Force LTR for dots container to ensure consistent visual behavior */}
        <div className="flex justify-center mt-6 gap-2" dir="ltr">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`inline-block h-3 w-3 rounded-full transition-colors duration-300 cursor-pointer ${
                activeSlide === index ? "bg-primary" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
      
      {isMobile && (
        <p className="text-center text-gray-500 text-sm mt-4">
          {language === 'he' ? 'החלק ימינה או שמאלה כדי לדפדף בין התמונות' : 'Swipe left or right to navigate between images'}
        </p>
      )}
    </div>
  );
};

export default GalleryCarousel;
