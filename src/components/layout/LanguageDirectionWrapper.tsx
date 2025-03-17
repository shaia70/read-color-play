
import React, { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageDirectionWrapperProps {
  children: ReactNode;
  forceDirection?: boolean;
}

export default function LanguageDirectionWrapper({ 
  children, 
  forceDirection = true 
}: LanguageDirectionWrapperProps) {
  const { language } = useLanguage();
  
  return (
    <div 
      dir={language === 'he' ? 'rtl' : 'ltr'} 
      className={`${language === 'he' ? 'font-he text-right' : 'font-en text-left'} ${forceDirection ? 'w-full' : ''}`}
    >
      {children}
    </div>
  );
}
