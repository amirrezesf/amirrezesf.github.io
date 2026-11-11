import { useState, useCallback, useMemo, useEffect } from 'react';
import enTranslations from "../i18n/en.ts";
import faTranslations from '../i18n/fa.ts';

export type Language = 'en' | 'fa';

const translations = {
    en: enTranslations,
    fa: faTranslations,
};

const titles = {
    en: 'Amir Esfandyiari - Full Stack Developer',
    fa: 'امیررضا اسفندیاری - فول استک دولوپر',
};

function updateDocumentTitle(lang: Language) {
    if (typeof document !== 'undefined') {
        document.title = titles[lang];
    }
}

// Module-level state to share across hook instances (mirrors Vue's module-level ref)
let globalLanguage: Language = (localStorage.getItem('language') as Language) || 'en';
const listeners = new Set<(lang: Language) => void>();

function setGlobalLanguage(lang: Language) {
    globalLanguage = lang;
    listeners.forEach((fn) => fn(lang));
}

export function useLanguage() {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(globalLanguage);

    // Subscribe to global language changes
    useEffect(() => {
        const handler = (lang: Language) => setCurrentLanguage(lang);
        listeners.add(handler);
        return () => { listeners.delete(handler); };
    }, []);

    // Initialize document direction and title once
    useEffect(() => {
        document.documentElement.dir = currentLanguage === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLanguage;
        updateDocumentTitle(currentLanguage);
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setGlobalLanguage(lang);
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        updateDocumentTitle(lang);
    }, []);

    const t = useMemo(() => {
        return translations[currentLanguage] ?? translations.en;
    }, [currentLanguage]);

    const isRTL = useMemo(() => currentLanguage === 'fa', [currentLanguage]);

    return {
        currentLanguage,
        t,
        isRTL,
        setLanguage,
    };
}