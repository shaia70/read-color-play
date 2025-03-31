
import heTranslations from './he';
import enTranslations from './en';
import { Language } from '@/types/language';

// Combine all translations
const translations: Record<Language, Record<string, string>> = {
  he: heTranslations,
  en: enTranslations
};

export default translations;
