import React from 'react';

interface ImageSelectedStateProps {
  imageSrc: string;
  onRemoveBackground: () => void;
  onCancel: () => void; // Can be triggered by bottom nav reset or back buttons
}

export const ImageSelectedState: React.FC<ImageSelectedStateProps> = ({
  imageSrc,
  onRemoveBackground,
}) => {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Image Preview Card */}
      <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,43,91,0.05)] border border-[#E0F2FE]">
        {/* Workspace grid background for transparency context */}
        <div className="absolute inset-0 transparency-grid opacity-30"></div>
        
        {/* The User's Image */}
        <img
          src={imageSrc}
          alt="Original Preview"
          className="relative z-10 w-full h-full object-cover"
        />
        
        {/* Badge for "Original" */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full">
          <span className="font-label-md text-label-md text-white uppercase tracking-widest">
            Original
          </span>
        </div>
      </div>

      {/* Primary Action Button and subtext */}
      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={onRemoveBackground}
          className="group relative flex items-center justify-center gap-3 w-full h-[58px] bg-primary text-white font-button text-button rounded-[24px] shadow-lg active-scale transition-all overflow-hidden"
        >
          <span className="material-symbols-outlined">ink_eraser</span>
          <span>Remove Background</span>
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
        
        <p className="text-center font-body-sm text-body-sm text-on-surface-variant px-6 leading-relaxed">
          AI-powered precision. Tap to isolate your subject in seconds.
        </p>
      </div>
    </div>
  );
};
