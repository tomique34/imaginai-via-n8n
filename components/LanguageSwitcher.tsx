import React from 'react';
import { useI18n } from '../context/I18nContext';

export const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useI18n();

    return (
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-black/20 backdrop-blur-sm p-1 rounded-full">
            <button 
                onClick={() => setLocale('en')} 
                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${locale === 'en' ? 'bg-purple-500 text-white' : 'text-stone-400 hover:bg-white/10'}`}
                aria-pressed={locale === 'en'}
            >
                EN
            </button>
            <button 
                onClick={() => setLocale('sk')} 
                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${locale === 'sk' ? 'bg-purple-500 text-white' : 'text-stone-400 hover:bg-white/10'}`}
                aria-pressed={locale === 'sk'}
            >
                SK
            </button>
        </div>
    );
};