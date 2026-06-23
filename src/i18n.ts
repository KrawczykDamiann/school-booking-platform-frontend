import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import plTranslation from './locales/pl.json';
import uaTranslation from './locales/ua.json';

// Retrieve the stored language from localStorage, default to 'en' if empty
const savedLanguage = localStorage.getItem('app_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      pl: { translation: plTranslation },
      ua: { translation: uaTranslation }
    },
    lng: savedLanguage, // Inject the persisted language here
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;