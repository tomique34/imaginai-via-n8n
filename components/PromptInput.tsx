import React from 'react';
import { useI18n } from '../context/I18nContext';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled }) => {
  const { t } = useI18n();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Limit input length in real-time (2000 character max)
    if (newValue.length <= 2000) {
      onChange(e);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg
          className="w-5 h-5 text-purple-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 3zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM7.135 6.02a.75.75 0 01.048 1.058l-1.08 1.296a.75.75 0 01-1.106-.992l1.08-1.296a.75.75 0 011.058-.066zM14.93 13.885a.75.75 0 01-1.058.048l-1.296-1.08a.75.75 0 01.992-1.106l1.296 1.08a.75.75 0 01.066 1.058zM3 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 10zm13.25.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM6.02 12.865a.75.75 0 011.058-.048l1.296 1.08a.75.75 0 01-.992 1.106l-1.296-1.08a.75.75 0 01-.066-1.058zM13.885 5.07a.75.75 0 01.048-1.058l1.08-1.296a.75.75 0 111.106.992l-1.08 1.296a.75.75 0 01-1.058.066z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        maxLength={2000}
        placeholder={t('promptPlaceholder')}
        className="w-full bg-white/5 border border-white/10 rounded-xl shadow-sm text-stone-200 placeholder-stone-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 pl-11 pr-4 py-4 text-md"
      />
    </div>
  );
};