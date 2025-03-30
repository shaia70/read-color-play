
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
        <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-l from-[#7451d9] via-[#b1539c] to-[#e5494d] leading-none">
          {language === 'he' ? 'שלי' : 'Shelley'}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="h-6 w-6 my-[-2px]">
          <g transform="translate(20,20) scale(0.8)">
            <path d="M0 0 h25 v50 h50 v-25 h25 v25 c0 0 0 25 -25 25 h-50 v-50 h-25 z" fill="#b1539c"/>
            <path d="M75 50 h50 c0 0 25 0 25 25 v25 h-25 v-25 h-50 v25 c0 0 0 25 -25 25 h-25 v-25 h25 v-25 h50 v-25" fill="#e5494d"/>
            <path d="M0 100 h25 v50 h-25 z" fill="#7451d9"/>
            <path d="M25 150 h75 v25 h-75 z" fill="#7451d9"/>
            <path d="M25 100 h75 v50 h-75 z" fill="#7451d9"/>
          </g>
        </svg>
        <span className="text-xs bg-clip-text text-transparent bg-gradient-to-l from-[#7451d9] via-[#b1539c] to-[#e5494d] leading-none">
          {language === 'he' ? 'ספרים' : 'Books'}
        </span>
      </div>
    </div>
  ) : (
    <div className={cn("flex items-center", className)}>
      {showIcon && (
        <div className="flex-shrink-0 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="h-8 w-8">
            <g transform="translate(20,20) scale(0.8)">
              <path d="M0 0 h25 v50 h50 v-25 h25 v25 c0 0 0 25 -25 25 h-50 v-50 h-25 z" fill="#b1539c"/>
              <path d="M75 50 h50 c0 0 25 0 25 25 v25 h-25 v-25 h-50 v25 c0 0 0 25 -25 25 h-25 v-25 h25 v-25 h50 v-25" fill="#e5494d"/>
              <path d="M0 100 h25 v50 h-25 z" fill="#7451d9"/>
              <path d="M25 150 h75 v25 h-75 z" fill="#7451d9"/>
              <path d="M25 100 h75 v50 h-75 z" fill="#7451d9"/>
            </g>
          </svg>
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-l from-[#7451d9] via-[#b1539c] to-[#e5494d]">
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
