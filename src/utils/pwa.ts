/**
 * Detects if the current device is running iOS (iPhone, iPad, iPod).
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  
  // Detect iOS devices
  const iosPattern = /iPad|iPhone|iPod/;
  if (iosPattern.test(userAgent)) return true;
  
  // Detect iPad Pro (which identifies as Macintosh)
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /Macintosh/.test(userAgent)) return true;
  
  return false;
}

/**
 * Detects if the browser is Safari.
 * On iOS, standard Apple Safari is required to use "Add to Home Screen".
 */
export function isSafari(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent;
  const isChromeIOS = /CriOS/.test(userAgent);
  const isFirefoxIOS = /FxiOS/.test(userAgent);
  const isSafariBrowser = /Safari/.test(userAgent) && /Apple Computer/.test(window.navigator.vendor);
  
  return isSafariBrowser && !isChromeIOS && !isFirefoxIOS;
}

/**
 * Checks if the app is currently running in standalone PWA mode (installed).
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  
  const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  return !!(isStandaloneMatch || isIOSStandalone);
}
