
import React from 'react';
import { DownloadIcon, ShareIcon, TrashIcon } from './icons';

interface ActionButtonsProps {
  onDownload: () => void;
  onShare: () => void;
  onDiscard: () => void;
  isStyled: boolean;
}

export default function ActionButtons({ onDownload, onShare, onDiscard, isStyled }: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <button
        onClick={onDownload}
        disabled={!isStyled}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <DownloadIcon />
        <span>Download Composite (PNG)</span>
      </button>
      <button
        onClick={onShare}
        disabled={!isStyled}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShareIcon />
        <span>Share Result</span>
      </button>
      <button
        onClick={onDiscard}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
      >
        <TrashIcon />
        <span>Discard</span>
      </button>
    </div>
  );
}
