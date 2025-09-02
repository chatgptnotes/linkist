
import React, { useCallback, useRef, useState } from 'react';
import { UploadIcon, CameraIcon } from './icons';
import CameraCapture from './CameraCapture';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onImageUpload, isLoading }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if(file){
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleCapture = (file: File) => {
    onImageUpload(file);
    setShowCamera(false);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto text-center py-16">
        <div
          className="border-2 border-dashed border-gray-600 rounded-xl p-12 transition-colors duration-300 hover:border-purple-500 hover:bg-gray-800/50"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadIcon className="w-16 h-16 text-gray-500" />
            <h2 className="text-2xl font-bold text-white">Upload Your Image</h2>
            <p className="text-gray-400">Drag & drop a photo here, or use a button below</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP. High-resolution recommended.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
             <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={handleButtonClick}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 w-48 py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UploadIcon className="h-5 w-5"/>
                <span>Select File</span>
              </button>
              <button
                onClick={() => setShowCamera(true)}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 w-48 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CameraIcon className="h-5 w-5"/>
                <span>Use Camera</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showCamera && <CameraCapture onCapture={handleCapture} onClose={() => setShowCamera(false)} />}
    </>
  );
}
