import React, { useEffect } from 'react';
import {
  IconClose,
  IconAppleShare,
  IconAddToHomeScreen,
  IconCheck,
  IconApple,
  IconAndroid,
  IconSpark
} from './InstallIcons.jsx';

export default function InstallModal({ isOpen, onClose, isIOS, isAndroid }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="pwa-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-modal-title"
    >
      <div
        className="pwa-modal-card ios-style"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Grab Handle */}
        <div className="ios-sheet-handle" />

        <div className="pwa-modal-header">
          <div className="pwa-header-brand">
            <div className="pwa-app-badge">
              <IconSpark size={18} className="pwa-spark-svg" />
            </div>
            <div>
              <h3 id="pwa-modal-title" className="pwa-modal-title">
                Install Streak Tracker
              </h3>
              <p className="pwa-modal-subtitle">
                {isIOS
                  ? 'Add to iPhone / iPad Home Screen'
                  : 'Install Web App on your device'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="pwa-close-btn"
            onClick={onClose}
            aria-label="Close installation instructions"
          >
            <IconClose size={18} />
          </button>
        </div>

        {isIOS ? (
          /* Minimal Native iOS Style Steps */
          <div className="ios-instructions-container">
            <div className="ios-notice-banner">
              <IconApple size={16} className="ios-badge-icon" />
              <span>Apple iOS requires installing directly from the Safari toolbar:</span>
            </div>

            <ol className="ios-steps-list">
              <li className="ios-step-item">
                <div className="ios-step-number">1</div>
                <div className="ios-step-content">
                  <p className="ios-step-text">
                    Tap the <strong>Share</strong> button on the Safari navigation bar.
                  </p>
                  <div className="ios-step-visual">
                    <span className="ios-action-pill">
                      <IconAppleShare size={18} />
                      <span>Share</span>
                    </span>
                    <span className="ios-hint-text">(Found at the bottom or top of Safari)</span>
                  </div>
                </div>
              </li>

              <li className="ios-step-item">
                <div className="ios-step-number">2</div>
                <div className="ios-step-content">
                  <p className="ios-step-text">
                    Scroll down the share sheet and tap <strong>Add to Home Screen</strong>.
                  </p>
                  <div className="ios-step-visual">
                    <span className="ios-action-pill highlight">
                      <IconAddToHomeScreen size={18} />
                      <span>Add to Home Screen</span>
                    </span>
                  </div>
                </div>
              </li>

              <li className="ios-step-item">
                <div className="ios-step-number">3</div>
                <div className="ios-step-content">
                  <p className="ios-step-text">
                    Tap <strong>Add</strong> in the top-right corner to place Streak Tracker on your home screen.
                  </p>
                  <div className="ios-step-visual">
                    <span className="ios-action-pill complete">
                      <IconCheck size={16} />
                      <span>Added to Home Screen</span>
                    </span>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        ) : (
          /* Android / Desktop Instruction Steps */
          <div className="ios-instructions-container">
            <div className="ios-notice-banner">
              {isAndroid ? <IconAndroid size={16} /> : <IconSpark size={16} />}
              <span>
                {isAndroid
                  ? 'Add to your Android home screen in two simple taps:'
                  : 'Install as desktop application for offline access:'}
              </span>
            </div>

            <ol className="ios-steps-list">
              <li className="ios-step-item">
                <div className="ios-step-number">1</div>
                <div className="ios-step-content">
                  <p className="ios-step-text">
                    Tap the <strong>three-dots menu</strong> (⋮) in your browser’s top-right corner.
                  </p>
                </div>
              </li>
              <li className="ios-step-item">
                <div className="ios-step-number">2</div>
                <div className="ios-step-content">
                  <p className="ios-step-text">
                    Select <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        )}

        <div className="pwa-modal-footer">
          <button type="button" className="btn-pwa-dismiss" onClick={onClose}>
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
}
