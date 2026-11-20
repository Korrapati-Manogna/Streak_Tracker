import React, { useState, useEffect } from 'react';
import { subscribeToInstallPrompt, promptInstall, isStandaloneApp } from '../installPrompt.js';

export default function InstallGuideModal({ isOpen, onClose }) {
  const [hasPrompt, setHasPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => isStandaloneApp());
  const [activeDevice, setActiveDevice] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    const ua = window.navigator?.userAgent?.toLowerCase() || '';
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    return 'desktop';
  });

  useEffect(() => {
    const unsubscribe = subscribeToInstallPrompt((prompt) => {
      setHasPrompt(Boolean(prompt));
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (hasPrompt) {
      const accepted = await promptInstall();
      if (accepted) {
        setIsInstalled(true);
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card install-guide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">📲</span>
            <div>
              <h3 className="modal-title">Install Streak Tracker</h3>
              <p className="modal-subtitle">Fast, native desktop & mobile app with offline tracking</p>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body install-guide-body">
          {isInstalled ? (
            <div className="install-modal-installed-banner">
              <span className="installed-icon">🎉</span>
              <div>
                <h4>Streak Tracker is Installed!</h4>
                <p>You are running the standalone application. It is accessible from your home screen or desktop application launcher.</p>
              </div>
            </div>
          ) : (
            <>
              {hasPrompt && (
                <div className="install-cta-box">
                  <p>Your browser is ready to install Streak Tracker with one click:</p>
                  <button
                    type="button"
                    className="btn-install-primary btn-large-install"
                    onClick={handleInstallClick}
                  >
                    ⬇ Install App Now
                  </button>
                </div>
              )}

              <div className="device-tabs-row">
                <button
                  type="button"
                  className={`device-tab-btn ${activeDevice === 'desktop' ? 'active' : ''}`}
                  onClick={() => setActiveDevice('desktop')}
                >
                  💻 Windows / Mac
                </button>
                <button
                  type="button"
                  className={`device-tab-btn ${activeDevice === 'android' ? 'active' : ''}`}
                  onClick={() => setActiveDevice('android')}
                >
                  🤖 Android
                </button>
                <button
                  type="button"
                  className={`device-tab-btn ${activeDevice === 'ios' ? 'active' : ''}`}
                  onClick={() => setActiveDevice('ios')}
                >
                  🍎 iPhone / iPad
                </button>
              </div>

              <div className="install-steps-container">
                {activeDevice === 'desktop' && (
                  <div className="step-guide">
                    <h4 className="guide-heading">How to install on Windows / Mac (Chrome, Edge, Brave):</h4>
                    <ol className="guide-steps">
                      <li>
                        Look at your browser's <strong>address bar (top right)</strong>.
                      </li>
                      <li>
                        Click the <strong>Install icon</strong> (it looks like a monitor with a down arrow <span className="highlight-pill">📥</span> or a plus in a circle <span className="highlight-pill">⊕</span>).
                      </li>
                      <li>
                        Alternatively, click the <strong>3 dots (⋮)</strong> menu in Chrome &gt; select <strong>"Install Streak Tracker"</strong>.
                      </li>
                      <li>
                        Click <strong>"Install"</strong> in the popup. Streak Tracker will now launch in its own standalone window and appear on your Desktop / Start Menu!
                      </li>
                    </ol>
                  </div>
                )}

                {activeDevice === 'android' && (
                  <div className="step-guide">
                    <h4 className="guide-heading">How to install on Android (Chrome):</h4>
                    <ol className="guide-steps">
                      <li>
                        Tap the <strong>three dots (⋮)</strong> in the top-right corner of Chrome.
                      </li>
                      <li>
                        Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                      </li>
                      <li>
                        Tap <strong>"Install"</strong>. Streak Tracker will be added to your app drawer and home screen.
                      </li>
                    </ol>
                  </div>
                )}

                {activeDevice === 'ios' && (
                  <div className="step-guide">
                    <h4 className="guide-heading">How to install on iPhone / iPad (Safari):</h4>
                    <ol className="guide-steps">
                      <li>
                        Open <strong>https://streaktracker-azure.vercel.app</strong> in <strong>Safari</strong>.
                      </li>
                      <li>
                        Tap the <strong>Share button</strong> (<span className="highlight-pill">⎙ box with arrow pointing up</span>) at the bottom toolbar.
                      </li>
                      <li>
                        Scroll down and tap <strong>"Add to Home Screen"</strong>.
                      </li>
                      <li>
                        Tap <strong>"Add"</strong> in the top right. Streak Tracker will appear as an app icon on your home screen!
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
