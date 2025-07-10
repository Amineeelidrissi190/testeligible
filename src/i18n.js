// src/i18n.js avec chargement paresseux
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Utilisation du backend pour charger les traductions
  .use(Backend)
  // Détection de la langue du navigateur
  .use(LanguageDetector)
  // Passe l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialisation
  .init({
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    
    // Spécifiez des chemins pour vos fichiers de traduction
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    ns: ['translation', 'common', 'projects', 'auth'],
    defaultNS: 'translation',
    
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;