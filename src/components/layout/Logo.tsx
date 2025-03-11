
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LogoProps {
  showTagline?: boolean;
  className?: string;
}

export default function Logo({ showTagline = false, className }: LogoProps) {
  const { language } = useLanguage();

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-l from-shelley-blue via-shelley-purple to-shelley-red">
        {language === 'he' ? 'שלי ספרים' : 'Shelley Books'}
      </span>
      {showTagline && (
        <span className="text-sm mt-1 text-gray-600 tracking-wide font-medium">
          {language === 'he' ? 'קוראים • צובעים • משחקים' : 'Read • Color • Play'}
        </span>
      )}
    </div>
  );
}
