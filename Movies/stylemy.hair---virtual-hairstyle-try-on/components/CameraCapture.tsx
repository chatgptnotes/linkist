
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function getCameraStream() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera not supported on this browser.");
        return;
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: false,
        });
        if (active && videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check your browser permissions.");
      }
    }
    
    getCameraStream();

    const cleanup = () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };

    // Also add cleanup to window unload to be safe
    window.addEventListener('beforeunload', cleanup);
    
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !stream) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      // Flip the image horizontally for a mirror effect
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.png', { type: 'image/png' });
          onCapture(file);
        }
      }, 'image/png');
    }
  }, [onCapture, stream]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="camera-title">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-xl max-w-2xl w-full border border-gray-700">
        <h3 id="camera-title" className="text-xl font-bold mb-4">Live Camera</h3>
        {error ? (
          <div className="text-red-300 bg-red-500/20 p-4 rounded-md border border-red-500" role="alert">{error}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md bg-black transform scale-x-[-1]"></video>
        )}
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCapture}
            disabled={!stream || !!error}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Take Picture
          </button>
        </div>
      </div>
    </div>
  );
}
