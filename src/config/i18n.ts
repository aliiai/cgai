/**
 * i18n Configuration
 * 
 * إعدادات الترجمة والدولية
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';

// Initialize i18n
const initI18n = () => {
  return i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
      // Default language
      fallbackLng: 'ar',
      
      // Supported languages
      supportedLngs: ['ar', 'en'],
      
      // Resources (translations)
      resources: {
        ar: {
          translation: arTranslations,
        },
        en: {
          translation: enTranslations,
        },
      },
      
      // Detection options
      detection: {
        // Order of language detection
        order: ['localStorage', 'navigator'],
        
        // Keys to lookup language from
        lookupLocalStorage: 'i18nextLng',
        
        // Cache user language
        caches: ['localStorage'],
      },
      
      // React i18next options
      react: {
        useSuspense: false,
      },
      
      // Interpolation options
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      
      // Debug mode (set to false in production)
      debug: false,
    });
};

// Initialize i18n immediately
initI18n();

export default i18n;

