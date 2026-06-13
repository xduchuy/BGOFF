import React from 'react';

interface InstallPWAProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onInstallClick: () => void;
  showNativePrompt: boolean;
}

export const InstallPWA: React.FC<InstallPWAProps> = ({
  isOpen,
  onClose,
  isIOS,
  onInstallClick,
  showNativePrompt,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#001736]/25 backdrop-blur-sm z-[60] transition-opacity duration-300 opacity-100"
      />

      {/* PWA Install Prompt Modal */}
      <section className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center items-end pointer-events-none">
        <div className="w-full max-w-md bg-surface border-t border-outline-variant/10 rounded-t-[32px] p-8 pb-[calc(2rem+env(safe-area-inset-bottom))] animate-slide-up pointer-events-auto shadow-[0_-20px_40px_rgba(0,23,54,0.1)]">
          
          {/* Handle for visual cue */}
          <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-8" />
          
          <div className="flex flex-col items-center text-center">
            
            {/* Brand Icon */}
            <img 
              src="/icon.svg" 
              alt="BGOff Logo" 
              className="w-20 h-20 rounded-[24px] mb-6 shadow-lg shadow-[#fe5f03]/10 object-cover"
            />

            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-3">
              {isIOS ? 'Add BGOff to your Home Screen' : 'Cài đặt BGOff vào thiết bị'}
            </h2>
            
            <p className="font-body-lg text-body-lg text-on-surface-variant px-4 mb-8">
              {isIOS 
                ? 'Tap the share button and select "Add to Home Screen" to use BGOff anytime, even offline.' 
                : 'Cài đặt ứng dụng BGOff trực tiếp để thực hiện tách nền nhanh chóng và hoạt động ngoại tuyến.'}
            </p>

            {/* Visual Guide Section */}
            {isIOS ? (
              <div className="w-full bg-surface-container-low rounded-3xl p-5 mb-8 flex items-center gap-4 text-left border border-outline-variant/5">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary text-2xl">ios_share</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md text-primary uppercase tracking-wider mb-0.5">
                    Instruction
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    Look for the share icon in your browser menu.
                  </div>
                </div>
              </div>
            ) : showNativePrompt ? (
              <div className="w-full bg-surface-container-low rounded-3xl p-5 mb-8 flex items-center gap-4 text-left border border-outline-variant/5">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary text-2xl">download</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md text-primary uppercase tracking-wider mb-0.5">
                    Instruction
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    Click install below to register the web app.
                  </div>
                </div>
              </div>
            ) : null}

            {/* Primary Action Button */}
            {showNativePrompt && !isIOS ? (
              <button
                onClick={() => {
                  onInstallClick();
                  onClose();
                }}
                className="w-full py-4 bg-primary text-on-primary rounded-[24px] font-button text-button shadow-xl active-scale transition-transform duration-150"
              >
                Cài đặt ngay
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-4 bg-primary text-on-primary rounded-[24px] font-button text-button shadow-xl active-scale transition-transform duration-150"
              >
                Got it
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
