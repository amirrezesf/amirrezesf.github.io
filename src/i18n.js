import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
        en: {
            translation: {
                welcome: "Welcome to our application!",
                change_lang:
                    "Change Language"
            }
        }
        ,
        es: {
            translation: {
                welcome: "¡Bienvenido a nuestra aplicación!",
                change_lang:
                    "Cambiar idioma"
            }
        }
    }
;
// 2. Initialize i18next
i18n
    .use(LanguageDetector) // Automatically detects user browser language
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: 'en', // Use English if detected language is missing
        interpolation: {
            escapeValue: false // React already safely escapes strings
        }
    });
export default i18n;