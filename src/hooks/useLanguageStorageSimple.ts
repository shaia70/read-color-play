import { useState, useEffect } from 'react';
import { Language } from '@/types/language';

// Simplified language storage hook to avoid React bundling issues
export const useLanguageStorageSimple = (): { language: Language; setLanguage: (lang: Language) => void } => {
  // Simple state without complex callbacks to avoid bundling issues
  const [language, setLanguageState] = useState<Language>('he');

  // Simple setter function
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('shelley-language', newLanguage);
      } catch (error) {
        console.warn('Failed to save language:', error);
      }
    }
  };

  // Initialize from localStorage only once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('shelley-language');
        if (stored === 'en' || stored === 'he') {
          setLanguageState(stored);
        }
      } catch (error) {
        console.warn('Failed to load language:', error);
      }
    }
  }, []);

  return { language, setLanguage };
};