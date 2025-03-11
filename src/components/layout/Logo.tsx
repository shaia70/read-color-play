
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface LogoProps {
  showTagline?: boolean;
  className?: string;
  showIcon?: boolean;
}

export default function Logo({ showTagline = false, className, showIcon = true }: LogoProps) {
  const { language } = useLanguage();

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
