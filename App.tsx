import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import { ActionButtons } from './components/ActionButtons';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { generateImage, editImage } from './services/geminiService';
import type { UploadedFile } from './types';
import { useI18n } from './context/I18nContext';

const App: React.FC = () => {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: UploadedFile | null) => {
    setUploadedFile(file);
    if (!file) {
      if (prompt) setGeneratedImage(null);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageB64 = await generateImage(prompt);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);
    } catch (e) {
      console.error(e);
      setError(t('errorGenerate'));
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, t]);

  const handleEdit = useCallback(async () => {
    if (!prompt || !uploadedFile || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageB64 = await editImage(prompt, uploadedFile);
      setGeneratedImage(`data:image/png;base64,${imageB64}`);
    } catch (e) {
      console.error(e);
      setError(t('errorEdit'));
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedFile, isLoading, t]);
  
  const canGenerate = prompt.trim().length > 0 && !isLoading;
  const canEdit = canGenerate && uploadedFile !== null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans antialiased relative">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <LanguageSwitcher />
      <main className="container mx-auto px-4 py-8 md:py-16 relative z-10 flex flex-col items-center">
        <Header />
        <div className="w-full max-w-2xl mt-12 space-y-6">
          <PromptInput value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isLoading} />
          <ImageUploader onImageUpload={handleImageUpload} disabled={isLoading} />
          
          {error && <p className="text-red-400 text-center bg-red-900/20 p-3 rounded-lg">{error}</p>}
          
          <ActionButtons onGenerate={handleGenerate} onEdit={handleEdit} canGenerate={canGenerate} canEdit={canEdit} isLoading={isLoading}/>
          
          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-stone-300 to-stone-500 pt-8">
            {t('generatedImageTitle')}
          </h2>
          <GeneratedImageDisplay generatedImage={generatedImage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default App;