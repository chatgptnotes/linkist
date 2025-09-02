
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
}

export default function BeforeAfterSlider({ before, after }: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      isDragging.current = false;
    };
    window.addEventListener('pointerup', handleMouseUpGlobal);
    return () => {
      window.removeEventListener('pointerup', handleMouseUpGlobal);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-md"
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
      onPointerUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      <img
        src={after}
        alt="After"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img
          src={before}
          alt="Before"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize"
        style={{ left: `calc(${sliderPos}% - 2px)` }}
        onPointerDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
