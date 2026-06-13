import React, { useState, useRef, useEffect } from 'react';
import { BackgroundPresets, BackgroundPresetType } from './BackgroundPresets';

interface ResultStateProps {
  originalSrc: string;
  resultSrc: string;
  onDownloadPNG: () => void;
  onSaveWithBackground: (preset: BackgroundPresetType, customColor: string) => void;
  onChooseAnother: () => void;
}

export const ResultState: React.FC<ResultStateProps> = ({
  originalSrc,
  resultSrc,
  onDownloadPNG,
  onSaveWithBackground,
  onChooseAnother,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<BackgroundPresetType>('transparent');
  const [customColor, setCustomColor] = useState<string>('#cbd5e1'); // default silver
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Measure container width for accurate slide calculations
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || containerWidth === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const getProcessedBackgroundStyle = (): React.CSSProperties => {
    if (selectedPreset === 'transparent') return {};
    if (selectedPreset === 'white') return { backgroundColor: '#ffffff' };
    if (selectedPreset === 'black') return { backgroundColor: '#000000' };
    if (selectedPreset === 'custom') return { backgroundColor: customColor };
    if (selectedPreset === 'gradient') {
      return {
        background: 'linear-gradient(135deg, #002b5b 0%, #e7e1ae 100%)'
      };
    }
    return {};
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Result Card: aspect-square, rounded-[32px] */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-square rounded-[32px] overflow-hidden bg-white border border-[#E0F2FE] shadow-[0_10px_30px_rgba(0,43,91,0.05)] cursor-ew-resize select-none"
      >
        {/* Right Layer (Processed image with preset background) */}
        <div
          className={`absolute inset-0 w-full h-full flex items-center justify-center p-8 ${
            selectedPreset === 'transparent' ? 'transparency-grid' : ''
          }`}
          style={getProcessedBackgroundStyle()}
        >
          <img
            src={resultSrc}
            alt="Subject isolated"
            className="max-w-[90%] max-h-[90%] object-contain pointer-events-none drop-shadow-2xl"
          />
          
          {/* Floating Indicator (Moved to top-right to prevent conflict with left-side Original badge) */}
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg z-10">
            Subject Isolated
          </div>
        </div>

        {/* Left Layer (Original image comparison clipped by slider position) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white/80 z-20"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            style={{ width: containerWidth ? `${containerWidth}px` : '100%', height: '100%' }}
            className="flex items-center justify-center relative flex-shrink-0 p-8 bg-white"
          >
            <img
              src={originalSrc}
              alt="Original photo"
              className="max-w-[90%] max-h-[90%] object-contain pointer-events-none"
            />
            {/* Original Badge */}
            <div className="absolute top-4 left-4 z-30 px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full">
              <span className="font-label-md text-label-md text-white uppercase tracking-widest">
                Original
              </span>
            </div>
          </div>
        </div>

        {/* Slider Handle (44px Diameter thumb button for touch compatibility) */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none flex items-center justify-center"
          style={{ left: `calc(${sliderPosition}% - 22px)` }}
        >
          <div className="w-11 h-11 rounded-full bg-primary border-4 border-white shadow-premium flex items-center justify-center pointer-events-auto active:scale-110 active:bg-primary/95 transition-transform duration-100">
            <div className="flex gap-1 items-center justify-center">
              <div className="w-1 h-3 rounded-full bg-white/70" />
              <div className="w-1 h-3 rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Presets Row */}
      <BackgroundPresets
        selectedType={selectedPreset}
        customColor={customColor}
        onPresetChange={(type) => setSelectedPreset(type)}
        onCustomColorChange={(color) => {
          setCustomColor(color);
          setSelectedPreset('custom');
        }}
      />

      {/* Primary Actions */}
      <div className="flex flex-col gap-3 mt-2 w-full">
        <button
          onClick={onDownloadPNG}
          className="h-[52px] w-full bg-primary text-white rounded-[24px] font-button text-button shadow-[0_8px_20px_rgba(0,23,54,0.2)] active-scale flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">download</span>
          Download PNG
        </button>

        <button
          onClick={() => onSaveWithBackground(selectedPreset, customColor)}
          className="h-[52px] w-full bg-secondary-fixed text-on-secondary-fixed-variant rounded-[24px] font-button text-button shadow-[0_8px_20px_rgba(234,228,177,0.3)] active-scale flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">wallpaper</span>
          Save with Background
        </button>

        <button
          onClick={onChooseAnother}
          className="mt-2 py-4 w-full text-on-surface-variant font-button text-button hover:bg-surface-variant/20 rounded-xl transition-colors active-scale text-center"
        >
          Choose Another Photo
        </button>
      </div>
    </div>
  );
};
