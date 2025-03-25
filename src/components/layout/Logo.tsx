
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  showTagline?: boolean;
  className?: string;
  showIcon?: boolean;
  isSquare?: boolean;
  linkToHome?: boolean;
}

export default function Logo({ 
  showTagline = false, 
  className, 
  showIcon = true,
  isSquare = false,
  linkToHome = true
}: LogoProps) {
  const { language } = useLanguage();

  const logoContent = isSquare ? (
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
  ) : (
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

  return linkToHome ? (
    <Link to="/" className="cursor-pointer">
      {logoContent}
    </Link>
  ) : (
    logoContent
  );
}
