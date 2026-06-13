import React from 'react';

interface TopBarProps {
  onInstallClick: () => void;
  isInstallable: boolean;
  isStandalone: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onInstallClick,
  isInstallable,
  isStandalone,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/10 shadow-sm">
      <div className="flex items-center justify-between px-5 h-16 w-full max-w-md mx-auto pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="BGOff Logo" className="w-8 h-8 rounded-lg object-contain" />
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold tracking-tight text-primary">
            BGOff
          </h1>
        </div>

        {isInstallable && !isStandalone ? (
          <button
            onClick={onInstallClick}
            className="bg-primary text-on-primary font-button text-button px-4 py-2 rounded-full active-scale transition-all duration-150"
          >
            Install
          </button>
        ) : (
          /* Placeholder to align header if Install is hidden */
          <div className="w-10" />
        )}
      </div>
    </header>
  );
};
