import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { en } from '../locales/en';
import { sk } from '../locales/sk';

type Locale = 'en' | 'sk';

const translations = { en, sk };

const getTranslation = (locale: Locale, key: string): string => {
    const lang = translations[locale];
    return (lang as Record<string, string>)[key] || key;
};

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// FIX: Refactored component definition to use React.FC and an explicit props interface.
// This resolves a TypeScript error where the `children` prop was incorrectly reported as missing.
export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>('en');

    const t = useMemo(() => (key: string): string => {
        return getTranslation(locale, key);
    }, [locale]);
    
    const value = { locale, setLocale, t };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};
