
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

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
          <img 
            src="/shelley-books-logo.png" 
            alt="Shelley Books Logo" 
            className="h-12 w-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      {showIcon && (
        <div className="flex-shrink-0 mr-2">
          <img 
            src="/shelley-books-logo.png" 
            alt="Shelley Books Logo" 
            className="h-8 w-auto"
          />
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
