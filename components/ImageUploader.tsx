import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { UploadedFile } from '../types';
import { useI18n } from '../context/I18nContext';
import { validateImageFile, validateBase64Size } from '../utils/fileValidation';

interface ImageUploaderProps {
  onImageUpload: (file: UploadedFile | null) => void;
  disabled: boolean;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Cleanup function for object URL to prevent memory leaks
  const cleanupObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    // Enhanced file validation with magic number checks
    const validation = await validateImageFile(file);

    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const base64Data = await fileToBase64(file);

      // Validate base64 size
      if (!validateBase64Size(base64Data)) {
        alert('Processed image is too large. Please use a smaller image.');
        return;
      }

      onImageUpload({ data: base64Data, mimeType: file.type });

      // Cleanup old URL before creating new one
      cleanupObjectUrl();

      const newUrl = URL.createObjectURL(file);
      objectUrlRef.current = newUrl;
      setImagePreview(newUrl);
    } catch (error) {
      console.error('Error converting file to base64', error);
      alert(t('uploaderAlertProcessError'));
    }
  }, [onImageUpload, t, cleanupObjectUrl]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if(disabled) return;
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if(disabled) return;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
  };
  
  const onRemoveImage = useCallback(() => {
      onImageUpload(null);
      cleanupObjectUrl();
      setImagePreview(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  }, [onImageUpload, cleanupObjectUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupObjectUrl();
    };
  }, [cleanupObjectUrl]);

  const baseClasses = "relative w-full p-6 border-2 border-dashed border-white/20 rounded-xl transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer";
  const draggingClasses = "border-purple-400 bg-purple-900/20 scale-105";
  const disabledClasses = "cursor-not-allowed opacity-50";

  if(imagePreview) {
      return (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
              <img src={imagePreview} alt="Upload preview" className="w-full h-full object-contain" />
              <button 
                  onClick={onRemoveImage}
                  disabled={disabled}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-red-600/80 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t('uploaderRemoveImageLabel')}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </button>
          </div>
      )
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`${baseClasses} ${isDragging ? draggingClasses : ''} ${disabled ? disabledClasses : 'hover:border-purple-400 hover:bg-white/5'}`}
    >
      <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/png, image/jpeg, image/gif, image/webp" disabled={disabled}/>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-4-4V9a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293h4.172a4 4 0 014 4v3a4 4 0 01-4 4h-1.586a1 1 0 01-.707-.293l-1.414-1.414a1 1 0 00-.707-.293H7z" />
          </svg>
        </div>
        <p className="text-stone-300 font-semibold">{t('uploaderCTA')}</p>
        <p className="text-xs text-stone-500">{t('uploaderFormats')}</p>
      </div>
    </div>
  );
};