import React, { useState, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';

// Utility & platform helper imports
import { resizeImage } from './utils/image';
import { downloadImage } from './utils/download';
import { isIOS, isSafari, isStandalone } from './utils/pwa';

// State components
import { TopBar } from './components/TopBar';
import { EmptyState } from './components/EmptyState';
import { ImageSelectedState } from './components/ImageSelectedState';
import { ProcessingOverlay } from './components/ProcessingOverlay';
import { ResultState } from './components/ResultState';
import { ErrorState } from './components/ErrorState';
import { InstallPWA } from './components/InstallPWA';
import { BackgroundPresetType } from './components/BackgroundPresets';

type AppState = 'idle' | 'selected' | 'processing' | 'result' | 'error';

const App: React.FC = () => {
  // Application routing / state machine variables
  const [appState, setAppState] = useState<AppState>('idle');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string>('');
  const [resultSrc, setResultSrc] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // PWA & Installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallSheet, setShowInstallSheet] = useState<boolean>(false);
  const [isAppStandalone, setIsAppStandalone] = useState<boolean>(false);

  // Sync PWA state and capture installation prompts
  useEffect(() => {
    setIsAppStandalone(isStandalone());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Watch for standalone display mode change
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsAppStandalone(e.matches);
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  // Cleanup helper to prevent memory leaks with Object URLs
  const clearObjectUrls = () => {
    if (originalSrc) {
      URL.revokeObjectURL(originalSrc);
      setOriginalSrc('');
    }
    if (resultSrc) {
      URL.revokeObjectURL(resultSrc);
      setResultSrc('');
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      clearObjectUrls();
      setOriginalFile(file);
      const previewUrl = URL.createObjectURL(file);
      setOriginalSrc(previewUrl);
      setAppState('selected');
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể chọn ảnh này.');
      setAppState('error');
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalFile) return;

    setAppState('processing');

    try {
      // 1. Keep high resolution: limit to 2048px on iOS to avoid crashes, up to 4096px (4K) on desktop for maximum fidelity
      const maxDimension = isIOS() ? 2048 : 4096;
      const optimizedBlob = await resizeImage(originalFile, maxDimension);

      // 2. Perform client-side background removal using the highest-fidelity model
      const processedBlob = await removeBackground(optimizedBlob, {
        model: 'isnet',        // Full 32-bit float model for maximum precision and beautiful edge details (hair, textures)
        device: 'gpu',         // Utilize WebGPU/WebGL acceleration for speed
        proxyToWorker: true,   // Execute in a Web Worker to keep the UI smooth
        progress: (key: string, current: number, total: number) => {
          console.log(`[ML Model Load/Inference] ${key}: ${Math.round((current / total) * 100)}%`);
        }
      });

      // 3. Store result object URL
      const finalUrl = URL.createObjectURL(processedBlob);
      setResultSrc(finalUrl);
      setAppState('result');
    } catch (error: any) {
      console.error('Error during background removal:', error);
      
      let friendlyError = error.message || '';
      
      if (!navigator.onLine && (friendlyError.includes('failed to fetch') || friendlyError.includes('NetworkError'))) {
        friendlyError = 'Không thể tải model AI khi ngoại tuyến. Vui lòng kết nối mạng để khởi tạo ứng dụng.';
      } else if (friendlyError.includes('fetch') || friendlyError.includes('wasm') || friendlyError.includes('model')) {
        friendlyError = 'Lỗi kết nối khi tải model AI. Hãy đảm bảo bạn có mạng và tải lại trang.';
      }

      setErrorMessage(friendlyError || 'Quá trình tách nền thất bại. Vui lòng thử lại.');
      setAppState('error');
    }
  };

  const handleDownloadPNG = () => {
    if (!resultSrc || !originalFile) return;
    const nameWithoutExt = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || 'bgoff_output';
    downloadImage(resultSrc, nameWithoutExt, 'transparent');
  };

  const handleSaveWithBackground = (preset: BackgroundPresetType, customColor: string) => {
    if (!resultSrc || !originalFile) return;
    const nameWithoutExt = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || 'bgoff_output';
    downloadImage(resultSrc, nameWithoutExt, preset, customColor);
  };

  const handleChooseAnother = () => {
    clearObjectUrls();
    setOriginalFile(null);
    setAppState('idle');
  };

  const handleInstallClick = async () => {
    if (isIOS() && isSafari()) {
      setShowInstallSheet(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install prompt outcome: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setShowInstallSheet(true);
    }
  };

  const isInstallable = !!(deferredPrompt || (isIOS() && isSafari()));

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      
      {/* Background Atmospheric Effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Fixed Header */}
      <TopBar
        onInstallClick={handleInstallClick}
        isInstallable={isInstallable}
        isStandalone={isAppStandalone}
      />

      {/* Processing Blurred Image Background */}
      {appState === 'processing' && originalSrc && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
          <img 
            src={originalSrc} 
            alt="Original Image Background" 
            className="w-full h-full object-cover blur-2xl scale-110 opacity-60" 
          />
        </div>
      )}

      {/* Main Canvas Area */}
      <main className="flex-1 w-full max-w-md pt-24 pb-40 px-5 flex flex-col justify-center items-center mx-auto relative z-20">
        {appState === 'idle' && (
          <EmptyState
            onFileSelect={handleFileSelect}
            onError={(msg) => {
              setErrorMessage(msg);
              setAppState('error');
            }}
          />
        )}

        {appState === 'selected' && (
          <ImageSelectedState
            imageSrc={originalSrc}
            onRemoveBackground={handleRemoveBackground}
            onCancel={handleChooseAnother}
          />
        )}

        {appState === 'processing' && (
          <ProcessingOverlay />
        )}

        {appState === 'result' && (
          <ResultState
            originalSrc={originalSrc}
            resultSrc={resultSrc}
            onDownloadPNG={handleDownloadPNG}
            onSaveWithBackground={handleSaveWithBackground}
            onChooseAnother={handleChooseAnother}
          />
        )}

        {appState === 'error' && (
          <ErrorState
            errorMessage={errorMessage}
            onRetry={handleChooseAnother}
          />
        )}
      </main>

      {/* Global Bottom Navigation Bar */}
      {(() => {
        const isProcessing = appState === 'processing';
        let activeTab = 0;
        
        if (appState === 'idle' || appState === 'selected' || appState === 'error') {
          activeTab = 0; // Remove active
        } else if (appState === 'result') {
          activeTab = 1; // Edit active
        }

        return (
          <nav 
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex justify-around items-center px-4 py-2 w-[90%] max-w-sm bg-surface-container-high/90 backdrop-blur-xl border border-white/20 shadow-xl rounded-full transition-all duration-300 ${
              isProcessing ? 'opacity-30 pointer-events-none' : ''
            }`}
          >
            {/* Tab: Remove */}
            <button 
              onClick={() => {
                if (originalSrc) {
                  setAppState('selected');
                } else {
                  setAppState('idle');
                }
              }}
              className="flex flex-col items-center justify-center gap-1 group active-scale"
            >
              <div className={`rounded-full p-3 transition-colors ${
                activeTab === 0 
                  ? 'bg-primary text-on-primary shadow-md' 
                  : 'text-on-surface-variant hover:bg-surface-variant/50'
              }`}>
                <span className="material-symbols-outlined block">ink_eraser</span>
              </div>
              <span className={`font-label-md text-label-md ${
                activeTab === 0 ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}>
                Remove
              </span>
            </button>

            {/* Tab: Edit Background */}
            <button 
              onClick={() => {
                if (resultSrc) setAppState('result');
              }}
              disabled={!resultSrc}
              className={`flex flex-col items-center justify-center gap-1 group active-scale ${
                !resultSrc ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <div className={`rounded-full p-3 transition-colors ${
                activeTab === 1 
                  ? 'bg-primary text-on-primary shadow-md' 
                  : 'text-on-surface-variant hover:bg-surface-variant/50'
              }`}>
                <span className="material-symbols-outlined block">wallpaper</span>
              </div>
              <span className={`font-label-md text-label-md ${
                activeTab === 1 ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}>
                Edit
              </span>
            </button>

            {/* Tab: Export */}
            <button 
              onClick={handleDownloadPNG}
              disabled={!resultSrc}
              className={`flex flex-col items-center justify-center gap-1 group active-scale ${
                !resultSrc ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <div className="text-on-surface-variant p-3 hover:bg-surface-variant/50 rounded-full transition-all">
                <span className="material-symbols-outlined block">download</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Export
              </span>
            </button>

            {/* Tab: Reset */}
            <button 
              onClick={handleChooseAnother}
              className="flex flex-col items-center justify-center gap-1 group active-scale"
            >
              <div className="text-on-surface-variant p-3 hover:bg-surface-variant/50 rounded-full transition-all">
                <span className="material-symbols-outlined block">restart_alt</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Reset
              </span>
            </button>
          </nav>
        );
      })()}

      {/* PWA custom install prompt sheet */}
      <InstallPWA
        isOpen={showInstallSheet}
        onClose={() => setShowInstallSheet(false)}
        isIOS={isIOS()}
        onInstallClick={handleInstallClick}
        showNativePrompt={!!deferredPrompt}
      />
    </div>
  );
};

export default App;
