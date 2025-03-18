
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
            src="/lovable-uploads/6d03cbbb-82f8-48dd-8d52-586766792eba.png" 
            alt="Shelley Books Logo" 
            className="h-20 w-auto"
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
            src="/lovable-uploads/6d03cbbb-82f8-48dd-8d52-586766792eba.png" 
            alt="Shelley Books Logo" 
            className="h-10 w-auto"
          />
        </div>
      )}
      <div className="flex flex-col">
        {showTagline && (
          <span className="text-sm mt-1 text-gray-600 tracking-wide font-medium">
            {language === 'he' ? 'קוראים • צובעים • משחקים' : 'Read • Color • Play'}
          </span>
        )}
      </div>
    </div>
  );
}
