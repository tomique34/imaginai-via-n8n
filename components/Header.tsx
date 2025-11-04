import React from 'react';
import { useI18n } from '../context/I18nContext';

const Logo: React.FC = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-3 flex-shrink-0">
        <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="url(#paint0_linear_header_logo)"/>
        <path d="M24.0002 16.0001V22.0001L29.0002 24.0001L24.0002 26.0001V32.0001L19.0002 29.0001L24.0002 26.0001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 21L30 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 27L30 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 21L23 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="matrix(-1, 0, 0, 1, 41, 0)"/>
        <path d="M18 27L23 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="matrix(-1, 0, 0, 1, 41, 0)"/>
        <defs>
            <linearGradient id="paint0_linear_header_logo" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A855F7"/>
                <stop offset="1" stopColor="#3B82F6"/>
            </linearGradient>
        </defs>
    </svg>
);

export const Header: React.FC = () => {
  const { t } = useI18n();
  return (
    <header className="text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight flex items-center justify-center">
        <Logo />
        <span className="bg-gradient-to-br from-purple-400 to-blue-500 text-transparent bg-clip-text">
          ImaginAI
        </span>
      </h1>
      <p className="mt-4 text-lg text-stone-400 max-w-xl mx-auto">
        {t('headerSubtitle')}
      </p>
    </header>
  );
};