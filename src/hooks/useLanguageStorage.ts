
import { useState, useEffect } from 'react';
import { Language } from '@/types/language';

// Hook to manage language state with localStorage
export const useLanguageStorage = () => {
  // Get stored language from localStorage or default to Hebrew
  const getStoredLanguage = (): Language => {
    const storedLanguage = localStorage.getItem('shelley-language');
    return (storedLanguage === 'en' || storedLanguage === 'he') ? storedLanguage : 'he';
  };

  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  // Update localStorage when language changes
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem('shelley-language', newLanguage);
    setLanguageState(newLanguage);
  };

  // Initialize with stored language on component mount
  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    if (storedLanguage !== language) {
      setLanguageState(storedLanguage);
    }
  }, []);

  return { language, setLanguage };
};
