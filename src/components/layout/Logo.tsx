
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

  const logoContent = isSquare ? (
    <div className={cn(
      "flex items-center justify-center aspect-square bg-white rounded-lg p-2", 
      className
    )}>
      <div className="flex flex-col items-center">
        {language === 'he' ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100" className="h-8 w-12">
            <g>
              <path d="M25 0L50 0 L50 30 L40 30 L40 10 L35 10 L35 35 L45 35 L45 25 L55 25 L55 45 L25 45 L25 0" fill="#D55B8E"/>
              <path d="M55 0 L90 0 L90 10 L75 10 L75 45 L65 45 L65 10 L55 10 L55 0" fill="#E6595C"/>
              <path d="M100 5 L110 5 L110 15 L100 15 L100 5" fill="#E6595C"/>
              <path d="M95 20 L125 20 L125 30 L105 30 L105 40 L125 40 L125 50 L95 50 L95 20" fill="#E6595C"/>
              <path d="M0 60 L25 60 L25 70 L10 70 L10 90 L0 90 L0 60" fill="#8874DD"/>
              <path d="M30 60 L55 60 L55 70 L40 70 L40 75 L55 75 L55 90 L30 90 L30 80 L45 80 L45 75 L30 75 L30 60" fill="#8874DD"/>
              <path d="M60 60 L85 60 L85 70 L70 70 L70 75 L85 75 L85 90 L60 90 L60 80 L75 80 L75 75 L60 75 L60 60" fill="#8874DD"/>
              <path d="M90 60 L110 60 L110 70 L100 70 L100 90 L90 90 L90 60" fill="#8874DD"/>
              <path d="M115 60 L140 60 L140 70 L125 70 L125 75 L140 75 L140 90 L115 90 L115 80 L130 80 L130 75 L115 75 L115 60" fill="#8874DD"/>
            </g>
          </svg>
        ) : (
          <>
            <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red leading-none">
              Shelley
            </span>
            <div className="flex-shrink-0 my-[-2px]">
              <BookOpen className="h-6 w-6 text-shelley-blue" />
            </div>
            <span className="text-xs bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red leading-none">
              Books
            </span>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className={cn("flex items-center", className)}>
      {showIcon && !language === 'he' && (
        <div className="flex-shrink-0 mr-2">
          <BookOpen className="h-8 w-8 text-shelley-blue" />
        </div>
      )}
      <div className="flex flex-col">
        {language === 'he' ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100" className="h-10 w-32">
            <g>
              <path d="M25 0L50 0 L50 30 L40 30 L40 10 L35 10 L35 35 L45 35 L45 25 L55 25 L55 45 L25 45 L25 0" fill="#D55B8E"/>
              <path d="M55 0 L90 0 L90 10 L75 10 L75 45 L65 45 L65 10 L55 10 L55 0" fill="#E6595C"/>
              <path d="M100 5 L110 5 L110 15 L100 15 L100 5" fill="#E6595C"/>
              <path d="M95 20 L125 20 L125 30 L105 30 L105 40 L125 40 L125 50 L95 50 L95 20" fill="#E6595C"/>
              <path d="M0 60 L25 60 L25 70 L10 70 L10 90 L0 90 L0 60" fill="#8874DD"/>
              <path d="M30 60 L55 60 L55 70 L40 70 L40 75 L55 75 L55 90 L30 90 L30 80 L45 80 L45 75 L30 75 L30 60" fill="#8874DD"/>
              <path d="M60 60 L85 60 L85 70 L70 70 L70 75 L85 75 L85 90 L60 90 L60 80 L75 80 L75 75 L60 75 L60 60" fill="#8874DD"/>
              <path d="M90 60 L110 60 L110 70 L100 70 L100 90 L90 90 L90 60" fill="#8874DD"/>
              <path d="M115 60 L140 60 L140 70 L125 70 L125 75 L140 75 L140 90 L115 90 L115 80 L130 80 L130 75 L115 75 L115 60" fill="#8874DD"/>
            </g>
          </svg>
        ) : (
          <>
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red">
              Shelley Books
            </span>
            {showTagline && (
              <span className="text-sm mt-1 text-gray-600 tracking-wide font-medium">
                Read • Color • Play
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );

  return logoContent;
}
