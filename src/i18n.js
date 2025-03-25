import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(initReactI18next) // Ініціалізація для React
  .use(LanguageDetector) // Визначення мови браузера
  .use(HttpApi) // Завантаження перекладів
  .init({
    fallbackLng: 'en', // Мова за замовчуванням
    debug: true,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    backend: {
      loadPath: "/locales/{{lng}}.json",
    },
  });

export default i18n;
