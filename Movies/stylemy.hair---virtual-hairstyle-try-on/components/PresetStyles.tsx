
import React from 'react';
import { PRESET_STYLES } from '../constants';
import type { PresetStyle } from '../types';
import { CheckIcon, RefreshIcon } from './icons';

// Placeholder for SVG icons
const StyleThumbnail = ({ name }: { name: string }) => (
  <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-md">
    <svg className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
);

interface PresetStylesProps {
  onStyleSelect: (style: PresetStyle) => void;
  selectedStyle: PresetStyle | null;
  isLoading: boolean;
}

export default function PresetStyles({ onStyleSelect, selectedStyle, isLoading }: PresetStylesProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-200">Preset Styles</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {PRESET_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style)}
            disabled={isLoading}
            className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedStyle?.id === style.id
                ? 'border-purple-500 ring-2 ring-purple-500/50'
                : 'border-gray-700 hover:border-purple-400'
            } ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <div className="w-full h-full bg-gray-800">
               {/* In a real app, you would use <img src={style.thumbnail} /> */}
               <StyleThumbnail name={style.name} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <span className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white text-center truncate">
              {style.name}
            </span>
            {selectedStyle?.id === style.id && (
              <div className="absolute top-1.5 right-1.5 bg-purple-500 text-white rounded-full p-1">
                <CheckIcon className="w-3 h-3"/>
              </div>
            )}
          </button>
        ))}
      </div>
      <button className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
        <RefreshIcon />
        <span>Start Over</span>
      </button>
    </div>
  );
}
