
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import StyledPreview from './components/StyledPreview';
import PresetStyles from './components/PresetStyles';
import { applyHairstyle } from './services/geminiService';
import type { PresetStyle } from './types';
import { supabase } from './supabaseClient';
// The Session type is not always available from the CDN, so we'll use 'any'.
// import type { Session } from '@supabase/supabase-js';

// Utility to convert file to Base64
const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      resolve({ base64: data, mimeType });
    };
    reader.onerror = error => reject(error);
  });
};

export default function App() {
  // Using `any` for session type as a workaround for CDN import issues.
  const [session, setSession] = useState<any | null>(null);
  const [originalImage, setOriginalImage] = useState<{ url: string; base64: string; mimeType: string } | null>(null);
  const [styledImage, setStyledImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PresetStyle | null>(null);

  useEffect(() => {
    // Supabase v2 API: getSession is async and onAuthStateChange provides a subscription.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setStyledImage(null);
    setSelectedStyle(null);
    try {
      const { base64, mimeType } = await fileToBase64(file);
      setOriginalImage({ url: URL.createObjectURL(file), base64, mimeType });
    } catch (e) {
      setError('Failed to load image. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStyleSelect = useCallback(async (style: PresetStyle) => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setStyledImage(null);
    setSelectedStyle(style);

    try {
      const newImageBase64 = await applyHairstyle(originalImage.base64, originalImage.mimeType, style.prompt);
      setStyledImage(`data:image/png;base64,${newImageBase64}`);
    } catch (e: any) {
      setError(`AI generation failed: ${e.message}. Please try again.`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleDiscard = () => {
    setOriginalImage(null);
    setStyledImage(null);
    setSelectedStyle(null);
    setError(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <Header session={session} />
      <main className="px-4 py-8 md:px-8 lg:px-16">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <ImagePreview imageUrl={originalImage.url} />
            </div>
            <div className="lg:col-span-6">
              <StyledPreview
                originalImageUrl={originalImage.url}
                styledImageUrl={styledImage}
                isLoading={isLoading}
                onDiscard={handleDiscard}
              />
            </div>
            <div className="lg:col-span-3">
              <PresetStyles
                onStyleSelect={handleStyleSelect}
                selectedStyle={selectedStyle}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
