import React, { useState, useEffect } from 'react';

export default function InstallAppCard() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator?.standalone === true
    );
  });
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem('streak_tracker_install_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator?.userAgent?.toLowerCase() || '';
    return /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
  });

  useEffect(() => {
    // Listen for beforeinstallprompt event (Chromium browsers)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions((prev) => !prev);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('streak_tracker_install_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleRestore = () => {
    setDismissed(false);
    try {
      localStorage.removeItem('streak_tracker_install_dismissed');
    } catch {
      // ignore
    }
  };

  if (dismissed && !isInstalled) {
    return (
      <div className="install-app-minibar">
        <span>💡 Install Streak Tracker on your device for instant offline access</span>
        <button
          type="button"
          className="btn-link"
          onClick={handleRestore}
        >
          View Install Options
        </button>
      </div>
    );
  }

  if (isInstalled) {
    return (
      <div className="install-app-card installed">
        <div className="install-card-left">
          <span className="install-badge-icon">⚡</span>
          <div>
            <h4 className="install-card-title">Streak Tracker App Active</h4>
            <p className="install-card-desc">
              You are running the installed application in standalone mode with offline support.
            </p>
          </div>
        </div>
        <span className="installed-pill">✓ Installed</span>
      </div>
    );
  }

  return (
    <div className="install-app-card">
      <div className="install-card-content">
        <div className="install-card-left">
          <div className="install-icon-wrapper">
            <span className="install-icon">📲</span>
          </div>
          <div>
            <div className="install-title-row">
              <h3 className="install-card-title">Install Streak Tracker</h3>
              <span className="pwa-badge">Desktop & Mobile PWA</span>
            </div>
            <p className="install-card-desc">
              Install the app directly to your device for instant launch, full-screen distraction-free practice, and reliable offline tracking.
            </p>
          </div>
        </div>

        <div className="install-card-actions">
          <button
            type="button"
            className="btn-install-primary"
            onClick={handleInstallClick}
            id="install-app-btn"
          >
            <span className="btn-icon">⬇</span>
            {deferredPrompt ? 'Install App Now' : 'Install / Add to Device'}
          </button>
          <button
            type="button"
            className="btn-dismiss-install"
            onClick={handleDismiss}
            title="Dismiss install banner"
            aria-label="Dismiss install banner"
          >
            ✕
          </button>
        </div>
      </div>

      {showInstructions && (
        <div className="install-instructions-drawer">
          <h4 className="instructions-title">Quick Installation Instructions:</h4>
          {isIOS ? (
            <ol className="instructions-list">
              <li>Tap the <strong>Share button (⎙ or box with arrow)</strong> at the bottom of Safari.</li>
              <li>Scroll down and tap <strong>'Add to Home Screen'</strong>.</li>
              <li>Tap <strong>'Add'</strong> in the top right corner. Streak Tracker will now appear on your home screen!</li>
            </ol>
          ) : (
            <ol className="instructions-list">
              <li>
                <strong>Chrome / Edge (Desktop):</strong> Click the <strong>Install icon (⊕)</strong> located on the right side of the address bar, or click Menu (⋮) &gt; <em>Install Streak Tracker</em>.
              </li>
              <li>
                <strong>Android Chrome:</strong> Tap the three-dot menu (⋮) in the top-right and select <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
              </li>
              <li>
                <strong>Other Browsers:</strong> Open your browser settings and select <em>Add to Home Screen / Install as Web App</em>.
              </li>
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
