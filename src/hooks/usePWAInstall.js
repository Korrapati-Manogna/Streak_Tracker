import { useState, useEffect, useCallback } from 'react';

// Shared global state for beforeinstallprompt so any component can share the deferred event
let globalDeferredPrompt = null;
const promptListeners = new Set();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    promptListeners.forEach((listener) => listener(e));
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    promptListeners.forEach((listener) => listener(null));
  });
}

export function checkIsInstalled() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    window.navigator?.standalone === true ||
    (typeof document !== 'undefined' && document.referrer?.includes('android-app://'))
  );
}

export function detectPlatform() {
  if (typeof window === 'undefined') {
    return { isIOS: false, isAndroid: false, isMobile: false };
  }
  const ua = window.navigator?.userAgent?.toLowerCase() || '';
  const isIOS =
    (/iphone|ipad|ipod/.test(ua) ||
      (window.navigator?.platform === 'MacIntel' && window.navigator?.maxTouchPoints > 1)) &&
    !window.MSStream;
  const isAndroid = /android/.test(ua);
  const isMobile = isIOS || isAndroid || /mobi|tablet/.test(ua);
  return { isIOS, isAndroid, isMobile };
}

export function usePWAInstall() {
  const [isInstalled, setIsInstalled] = useState(() => checkIsInstalled());
  const [deferredPrompt, setDeferredPrompt] = useState(() => globalDeferredPrompt);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [platform] = useState(() => detectPlatform());
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    try {
      return localStorage.getItem('streak_tracker_mobile_install_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handlePromptChange = (prompt) => {
      setDeferredPrompt(prompt);
    };
    promptListeners.add(handlePromptChange);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstalling(false);
      setShowModal(false);
      setDeferredPrompt(null);
    };

    const mediaQuery = window.matchMedia?.('(display-mode: standalone)');
    const handleMediaChange = (e) => {
      if (e.matches) {
        setIsInstalled(true);
        setIsInstalling(false);
        setShowModal(false);
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    return () => {
      promptListeners.delete(handlePromptChange);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    // 1. Check if application is already installed
    if (checkIsInstalled()) {
      setIsInstalled(true);
      return;
    }

    // 2. Immediately trigger button disability
    setIsInstalling(true);

    // 3. Android / Chromium with captured beforeinstallprompt
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
        } else {
          // User cancelled or dismissed prompt: re-enable button
          setIsInstalling(false);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
        setIsInstalling(false);
      }
      return;
    }

    // 4. iOS Safari or browser without direct prompt: open guidance sheet
    setShowModal(true);
  }, [deferredPrompt]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    // If modal closed without app being installed, re-enable the button
    if (!checkIsInstalled()) {
      setIsInstalling(false);
    } else {
      setIsInstalled(true);
    }
  }, []);

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
    try {
      localStorage.setItem('streak_tracker_mobile_install_dismissed', 'true');
    } catch {
      // ignore
    }
  }, []);

  const restoreBanner = useCallback(() => {
    setBannerDismissed(false);
    try {
      localStorage.removeItem('streak_tracker_mobile_install_dismissed');
    } catch {
      // ignore
    }
  }, []);

  return {
    isInstalled,
    isInstalling,
    canInstallDirectly: Boolean(deferredPrompt),
    isIOS: platform.isIOS,
    isAndroid: platform.isAndroid,
    isMobile: platform.isMobile,
    showModal,
    bannerDismissed,
    triggerInstall,
    closeModal,
    dismissBanner,
    restoreBanner
  };
}
