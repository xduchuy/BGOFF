import React, { useState, useEffect } from 'react';

export const ProcessingOverlay: React.FC = () => {
  const statusTexts = [
    'Analyzing subject edge...',
    'Smoothing contours...',
    'Finalizing transparency...',
    'Optimizing image...',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setFadeState('out');
      
      setTimeout(() => {
        // Change text and fade in
        setCurrentIndex((prevIndex) => (prevIndex + 1) % statusTexts.length);
        setFadeState('in');
      }, 300); // matches CSS duration
      
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-black/10 backdrop-blur-sm">
      {/* Glassmorphic Card Container */}
      <div className="bg-white/40 backdrop-blur-3xl w-full max-w-xs rounded-[32px] p-8 shadow-xl border border-white/30 flex flex-col items-center text-center floating-element">
        
        {/* Icon/Visual Element */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-primary/5 rounded-full pulse-subtle"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary text-[48px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              ink_eraser
            </span>
          </div>
        </div>

        {/* Labels */}
        <h2 
          className="font-title-md text-title-md text-primary mb-2 transition-opacity duration-300"
          style={{ opacity: fadeState === 'in' ? 1 : 0 }}
        >
          {statusTexts[currentIndex]}
        </h2>
        
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[200px] mb-8 leading-relaxed">
          Processing locally on your device for maximum privacy
        </p>

        {/* Progress Bar with Light Trail */}
        <div className="w-full max-w-[180px] mb-6">
          <div className="light-trail-animation"></div>
        </div>

        {/* Progress status tag */}
        <span className="font-label-md text-label-md text-primary/60 tracking-widest uppercase">
          Initializing AI
        </span>
      </div>
    </div>
  );
};
