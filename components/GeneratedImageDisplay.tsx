import React from 'react';
import { useI18n } from '../context/I18nContext';

interface GeneratedImageDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
}

const Placeholder: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="flex flex-col items-center justify-center h-full text-stone-500">
            <svg className="w-16 h-16 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-semibold text-center">{t('generatedImagePlaceholderTitle')}</p>
            <p className="text-sm text-center">{t('generatedImagePlaceholderSubtitle')}</p>
        </div>
    );
}

const Loader: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-purple-400 border-stone-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-stone-200 font-semibold">{t('generating')}</p>
            </div>
        </div>
    );
};

export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ generatedImage, isLoading }) => {
  const { t } = useI18n();
  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${t('downloadFileName')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="relative w-full aspect-video bg-white/5 border border-white/10 rounded-xl shadow-lg overflow-hidden flex items-center justify-center p-2">
      {isLoading && <Loader />}
      {!generatedImage && !isLoading && <Placeholder />}
      {generatedImage && (
        <>
          <img src={generatedImage} alt={t('generatedImageAlt')} className="w-full h-full object-contain" />
          <button
            onClick={downloadImage}
            className="absolute bottom-4 right-4 bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {t('download')}
          </button>
        </>
      )}
    </div>
  );
};