
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

  const logoContent = isSquare ? (
    <div className={cn(
      "flex items-center justify-center aspect-square bg-white rounded-lg p-2", 
      className
    )}>
      <div className="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-12 h-12">
          <rect width="200" height="200" fill="none"/>
          <g transform="translate(15, 15) scale(0.85)">
            <path d="M25 0 L25 50 L0 50 L0 100 L90 100 L90 50 L50 50 L50 0 L25 0" fill="#c75c9d"/>
            <path d="M175 0 L175 25 L150 25 L150 50 L100 50 L100 75 L150 75 L155 50 L175 50 L175 75 L115 75 L115 100 L150 100 L150 120 L175 120 L175 100 L190 100 L190 50 L200 40 L200 5 L200 0 L175 0" fill="#ea484b"/>
            <path d="M0 120 L0 170 L20 170 L20 130 L55 130 L55 170 L75 170 L75 130 L90 130 L90 170 L110 170 L110 120 L0 120" fill="#7876d6"/>
            <path d="M120 120 L120 170 L140 170 L140 130 L175 130 L175 170 L195 170 L195 120 L120 120" fill="#7876d6"/>
          </g>
        </svg>
      </div>
    </div>
  ) : (
    <div className={cn("flex items-center", className)}>
      {showIcon && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="h-8 w-8 mr-2">
          <rect width="200" height="200" fill="none"/>
          <g transform="translate(15, 15) scale(0.85)">
            <path d="M25 0 L25 50 L0 50 L0 100 L90 100 L90 50 L50 50 L50 0 L25 0" fill="#c75c9d"/>
            <path d="M175 0 L175 25 L150 25 L150 50 L100 50 L100 75 L150 75 L155 50 L175 50 L175 75 L115 75 L115 100 L150 100 L150 120 L175 120 L175 100 L190 100 L190 50 L200 40 L200 5 L200 0 L175 0" fill="#ea484b"/>
            <path d="M0 120 L0 170 L20 170 L20 130 L55 130 L55 170 L75 170 L75 130 L90 130 L90 170 L110 170 L110 120 L0 120" fill="#7876d6"/>
            <path d="M120 120 L120 170 L140 170 L140 130 L175 130 L175 170 L195 170 L195 120 L120 120" fill="#7876d6"/>
          </g>
        </svg>
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

  return logoContent;
}
