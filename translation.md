To use i18n in React, the industry standard is react-i18next, a powerful wrapper around the i18next ecosystem.
Here is a step-by-step guide to setting it up from scratch.

## 1. Install Dependencies

Run the following command in your project terminal:
```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

## 2. Create Configuration File

Create a file named i18n.js in your src directory to initialize the setup.

```nodejs

import i18n from 'i18next';import { initReactI18next } from 'react-i18next';import LanguageDetector from 'i18next-browser-languagedetector';
// 1. Define your translationsconst resources = {
en: {
translation: {
welcome: "Welcome to our application!",
change_lang: "Change Language"
}
},
es: {
translation: {
welcome: "¡Bienvenido a nuestra aplicación!",
change_lang: "Cambiar idioma"
}
}
};
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
```

## 3. Import in Entry Point

Import the configuration file at the very top of your main entry file (main.jsx or index.js), right before rendering the
app.


```nodejs
import React from 'react';import ReactDOM from 'react-dom/client';import App from './App.jsx';import './i18n'; // <--
Import configuration here
ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<App />
</React.StrictMode>,
);
```

## 4. Use in Components

Use the useTranslation hook to translate text and change languages inside your components.

```nodejs
import React from 'react';
import { useTranslation } from 'react-i18next';

function App() {
const { t, i18n } = useTranslation();

const toggleLanguage = () => {
// Switch between English and Spanish
const newLang = i18n.language === 'en' ? 'es' : 'en';
i18n.changeLanguage(newLang);
};

return (
<div style={{ padding: '20px' }}>
{/* t('key') fetches the correct string */}
<h1>{t('welcome')}</h1>

      <button onClick={toggleLanguage}>
        {t('change_lang')}
      </button>
    </div>
);
}

export default App;
```

If you are working on a larger app, I can show you how to move translations into separate JSON files or how to handle
dynamic variables (like "Welcome, John!"). Let me know what you would like to explore next.

