
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface GalleryImageProps {
  src: string;
  alt: string;
  index: number;
  onLoad: (index: number) => void;
  onError: (index: number) => void;
  isLoaded: boolean;
  hasError: boolean;
}

export function GalleryImage({ 
  src, 
  alt, 
  index, 
  onLoad, 
  onError, 
  isLoaded, 
  hasError 
}: GalleryImageProps) {
  const { language } = useLanguage();

  return (
    <div className="flex justify-center items-center h-[400px]">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <img 
        key={`img-${src}`}
        src={src} 
        alt={alt} 
        className={`max-w-full rounded-lg shadow-md border border-gray-200 object-contain max-h-[400px] transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => onLoad(index)}
        onError={() => onError(index)}
        style={{ display: hasError ? 'none' : 'block' }}
      />
      {hasError && (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <p className="text-red-500">
            {language === 'he' ? 'לא ניתן לטעון את התמונה' : 'Failed to load image'}
          </p>
        </div>
      )}
    </div>
  );
}
