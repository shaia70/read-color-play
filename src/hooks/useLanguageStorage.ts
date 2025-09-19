
import React, { useState, useEffect } from 'react';
import { Language } from '@/types/language';

// Hook to manage language state with localStorage  
export const useLanguageStorage = () => {
  // Get stored language from localStorage or default to Hebrew
  const getStoredLanguage = (): Language => {
    if (typeof window === 'undefined') return 'he'; // Default for SSR
    const storedLanguage = localStorage.getItem('shelley-language');
    return (storedLanguage === 'en' || storedLanguage === 'he') ? storedLanguage : 'he';
  };

  // Use lazy initial state to avoid localStorage access during render
  const [language, setLanguageState] = React.useState<Language>(() => getStoredLanguage());

  // Update localStorage when language changes
  const setLanguage = (newLanguage: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shelley-language', newLanguage);
    }
    setLanguageState(newLanguage);
  };

  // Initialize with stored language on component mount
  React.useEffect(() => {
    const storedLanguage = getStoredLanguage();
    if (storedLanguage !== language) {
      setLanguageState(storedLanguage);
    }
  }, [language]);

  return { language, setLanguage };
};
