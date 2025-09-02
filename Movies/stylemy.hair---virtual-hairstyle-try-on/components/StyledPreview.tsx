
import React from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import ActionButtons from './ActionButtons';
import { LightBulbIcon, DownloadIcon, ShareIcon } from './icons';

interface StyledPreviewProps {
  originalImageUrl: string;
  styledImageUrl: string | null;
  isLoading: boolean;
  onDiscard: () => void;
}

export default function StyledPreview({
  originalImageUrl,
  styledImageUrl,
  isLoading,
  onDiscard,
}: StyledPreviewProps) {
  const handleDownload = () => {
    if (!styledImageUrl) return;
    const link = document.createElement('a');
    link.href = styledImageUrl;
    link.download = 'styled-hair.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
     if (!styledImageUrl || !navigator.share) {
        alert('Web Share API is not available on your browser.');
        return;
    }
    try {
        const response = await fetch(styledImageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'styled-hair.png', { type: blob.type });
        await navigator.share({
            title: 'My New Hairstyle!',
            text: 'Check out my new look generated with StyleMy.Hair!',
            files: [file],
        });
    } catch (error) {
        console.error('Error sharing:', error);
        alert('Could not share the image.');
    }
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold text-gray-200">Styled Preview</h2>
      <div className="flex-grow bg-gray-800 rounded-lg p-2 shadow-lg relative flex flex-col justify-center items-center aspect-square">
        {isLoading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg z-20">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-300">Generating your new style...</p>
          </div>
        )}
        {!styledImageUrl && !isLoading && (
          <div className="text-center text-gray-400">
             <p>Select a preset style to begin</p>
          </div>
        )}
        {styledImageUrl && (
          <>
            <div className="absolute top-3 left-3 text-gray-400 text-sm flex items-center bg-gray-900/50 px-2 py-1 rounded-full">
                <LightBulbIcon className="mr-1.5"/>
                Drag the slider to compare before and after
            </div>
            <BeforeAfterSlider
              before={originalImageUrl}
              after={styledImageUrl}
            />
            <div className="absolute top-3 right-3 flex space-x-2">
                <button onClick={handleDownload} className="bg-gray-700/80 hover:bg-gray-600 text-white p-2 rounded-full transition-all">
                    <DownloadIcon/>
                </button>
                 <button onClick={handleShare} className="bg-gray-700/80 hover:bg-gray-600 text-white p-2 rounded-full transition-all">
                    <ShareIcon/>
                </button>
            </div>
          </>
        )}
      </div>
      <ActionButtons
        onDownload={handleDownload}
        onShare={handleShare}
        onDiscard={onDiscard}
        isStyled={!!styledImageUrl}
      />
    </div>
  );
}
