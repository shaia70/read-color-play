import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface LogoProps {
  showTagline?: boolean;
  className?: string;
  showIcon?: boolean;
  isSquare?: boolean;
}

export default function Logo({ 
  showTagline = false, 
  className, 
  showIcon = true,
  isSquare = false 
}: LogoProps) {
  const { language } = useLanguage();

  if (isSquare) {
    return (
      <div className={cn(
        "flex items-center justify-center aspect-square bg-white rounded-lg p-2", 
        className
      )}>
        <div className="flex flex-col items-center">
          <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red leading-none">
            {language === 'he' ? 'שלי' : 'Shelley'}
          </span>
          <div className="flex-shrink-0 my-[-2px]">
            <BookOpen className="h-6 w-6 text-shelley-blue" />
          </div>
          <span className="text-xs bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red leading-none">
            {language === 'he' ? 'ספרים' : 'Books'}
          </span>
        </div>
      </div>
    );
  }

  // Hebrew version with the new logo image
  if (language === 'he') {
    return (
      <div className={cn("flex items-center", className)}>
        <img 
          src="/lovable-uploads/6d03cbbb-82f8-48dd-8d52-586766792eba.png" 
          alt="שלי ספרים" 
          className="h-16"
        />
        {showTagline && (
          <span className="text-sm mt-1 text-gray-600 tracking-wide font-medium">
            קוראים • צובעים • משחקים
          </span>
        )}
      </div>
    );
  }

  // English version remains unchanged
  return (
    <div className={cn("flex items-center", className)}>
      {showIcon && (
        <div className="flex-shrink-0 mr-2">
          <BookOpen className="h-8 w-8 text-shelley-blue" />
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red">
          {language === 'he' ? 'שלי ספרים' : 'Shelley Books'}
        </span>
        {showTagline && (
          <span className="text-sm mt-1 text-gray-600 tracking-wide font-medium">
            {language === 'he' ? 'קוראים • צובעים • משחקים' : 'Read • Color • Play'}
          </span>
        )}
      </div>
    </div>
  );
}
