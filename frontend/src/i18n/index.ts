import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import kn from './locales/kn.json';
import hi from './locales/hi.json';

const STORAGE_KEY = 'pqc_language';
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      kn: { translation: kn },
      hi: { translation: hi }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React handles XSS
    }
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;
