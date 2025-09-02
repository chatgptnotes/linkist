
import React from 'react';

interface ImagePreviewProps {
  imageUrl: string;
}

export default function ImagePreview({ imageUrl }: ImagePreviewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-200">Current Image</h2>
      <div className="bg-gray-800 rounded-lg p-2 shadow-lg">
        <img
          src={imageUrl}
          alt="Original user upload"
          className="w-full h-auto object-contain rounded-md aspect-square"
        />
      </div>
    </div>
  );
}
