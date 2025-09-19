import * as React from 'react';
import { Language } from '@/types/language';

// Alternative implementation to avoid potential React import issues
export const useLanguageStorageFixed = () => {
  // Get stored language from localStorage or default to Hebrew
  const getStoredLanguage = React.useCallback((): Language => {
    if (typeof window === 'undefined') return 'he'; // Default for SSR
    try {
      const storedLanguage = localStorage.getItem('shelley-language');
      return (storedLanguage === 'en' || storedLanguage === 'he') ? storedLanguage : 'he';
    } catch {
      return 'he';
    }
  }, []);

  // Use lazy initial state to avoid localStorage access during render
  const [language, setLanguageState] = React.useState<Language>(getStoredLanguage);

  // Update localStorage when language changes
  const setLanguage = React.useCallback((newLanguage: Language) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('shelley-language', newLanguage);
      } catch (error) {
        console.warn('Failed to save language to localStorage:', error);
      }
    }
    setLanguageState(newLanguage);
  }, []);

  // Initialize with stored language on component mount
  React.useEffect(() => {
    const storedLanguage = getStoredLanguage();
    if (storedLanguage !== language) {
      setLanguageState(storedLanguage);
    }
  }, [getStoredLanguage, language]);

  return { language, setLanguage };
};