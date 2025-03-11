
import React, { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageDirectionWrapperProps {
  children: ReactNode;
}

export default function LanguageDirectionWrapper({ children }: LanguageDirectionWrapperProps) {
  const { language } = useLanguage();
  
  return (
    <div dir={language === 'he' ? 'rtl' : 'ltr'} className={language === 'he' ? 'font-he' : 'font-en'}>
      {children}
    </div>
  );
}
