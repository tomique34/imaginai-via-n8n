import React from 'react';
import { useI18n } from '../context/I18nContext';

interface ActionButtonsProps {
    onGenerate: () => void;
    onEdit: () => void;
    canGenerate: boolean;
    canEdit: boolean;
    isLoading: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onGenerate, onEdit, canGenerate, canEdit, isLoading }) => {
    const { t } = useI18n();
    const baseButtonClasses = "w-full sm:w-auto font-bold py-3 px-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const primaryButtonClasses = "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg disabled:from-stone-500 disabled:to-stone-600";
    const secondaryButtonClasses = "bg-white/10 hover:bg-white/20 border border-white/20 text-stone-300 shadow-md";
    const activeEditButtonClasses = "bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-lg";

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            <button
              onClick={onGenerate}
              disabled={!canGenerate || isLoading}
              className={`${baseButtonClasses} ${primaryButtonClasses}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h1a1 1 0 001-1V3.5a3.5 3.5 0 00-7 0V4a1 1 0 001 1h1a1 1 0 001-1V3.5z" />
                <path d="M5.5 10a1.5 1.5 0 000-3H5a1 1 0 00-1 1v1a1 1 0 001 1h.5zM10 5.5a1.5 1.5 0 013 0V6a1 1 0 001 1h.5a1.5 1.5 0 000-3H14a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0zm-7 3a3.5 3.5 0 00-3.5 3.5V14a1 1 0 001 1h1.5a1.5 1.5 0 000-3H5v-1.5a.5.5 0 01.5-.5zM12.5 10a.5.5 0 01.5.5V12h1.5a1.5 1.5 0 010 3H14a1 1 0 01-1-1v-2.5a.5.5 0 01.5-.5z" />
                <path d="M5.5 14a1.5 1.5 0 000 3H7a1 1 0 001-1v-1a1 1 0 00-1-1H5.5zM10 12.5a1.5 1.5 0 013 0V14a1 1 0 001 1h1a1 1 0 001-1v-1.5a3.5 3.5 0 00-7 0v.5z" />
              </svg>
              {isLoading ? t('processing') : t('generateImage')}
            </button>
            <button
              onClick={onEdit}
              disabled={!canEdit || isLoading}
              className={`${baseButtonClasses} ${canEdit ? activeEditButtonClasses : secondaryButtonClasses}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
              {t('editImage')}
            </button>
        </div>
    );
};