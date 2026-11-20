import React, { useState } from 'react';
import InstallAppButton from './InstallAppButton.jsx';
import {
  IconSpark,
  IconCheck,
  IconClose,
  IconApple,
  IconAndroid,
  IconAppleShare,
  IconAddToHomeScreen
} from './InstallIcons.jsx';

export default function InstallAppCard({
  isInstalled,
  isInstalling,
  onInstall,
  isIOS,
  isAndroid,
  canInstallDirectly
}) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem('streak_tracker_install_card_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [showDrawer, setShowDrawer] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('streak_tracker_install_card_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleRestore = () => {
    setDismissed(false);
    try {
      localStorage.removeItem('streak_tracker_install_card_dismissed');
    } catch {
      // ignore
    }
  };

  if (dismissed && !isInstalled) {
    return (
      <div className="install-app-minibar">
        <div className="minibar-info">
          <IconSpark size={16} className="minibar-spark-svg" />
          <span>Install Streak Tracker on your device for instant offline access</span>
        </div>
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
          <div className="install-badge-icon-box">
            <IconCheck size={18} className="install-check-svg" />
          </div>
          <div>
            <h4 className="install-card-title">Streak Tracker Web App Active</h4>
            <p className="install-card-desc">
              You are running the installed application in standalone mode with full offline support.
            </p>
          </div>
        </div>
        <span className="installed-pill">
          <IconCheck size={14} /> Installed
        </span>
      </div>
    );
  }

  return (
    <div className="install-app-card">
      <div className="install-card-content">
        <div className="install-card-left">
          <div className="install-icon-wrapper">
            <IconSpark size={24} className="install-spark-icon" />
          </div>
          <div>
            <div className="install-title-row">
              <h3 className="install-card-title">Download Web App</h3>
              <span className="pwa-badge">Android · iPhone · Desktop</span>
            </div>
            <p className="install-card-desc">
              Install the app directly to your home screen for instant launch, distraction-free practice, and reliable offline tracking.
            </p>
          </div>
        </div>

        <div className="install-card-actions">
          <InstallAppButton
            isInstalled={isInstalled}
            isInstalling={isInstalling}
            onInstall={onInstall}
            variant="card"
          />

          <button
            type="button"
            className="btn-info-drawer-toggle"
            onClick={() => setShowDrawer((prev) => !prev)}
            title="Toggle installation guide"
            aria-label="Toggle instructions"
          >
            {showDrawer ? 'Hide Guide' : 'Instructions'}
          </button>

          <button
            type="button"
            className="btn-dismiss-install"
            onClick={handleDismiss}
            title="Dismiss install banner"
            aria-label="Dismiss install banner"
          >
            <IconClose size={16} />
          </button>
        </div>
      </div>

      {showDrawer && (
        <div className="install-instructions-drawer">
          <h4 className="instructions-title">Quick Installation Steps:</h4>
          {isIOS ? (
            <div className="card-ios-instructions">
              <div className="instruction-chip">
                <IconApple size={14} />
                <span>iPhone / iPad (Safari):</span>
              </div>
              <ol className="instructions-list">
                <li>
                  Tap the <strong>Share</strong> button (<IconAppleShare size={14} className="inline-svg" />) at the bottom toolbar.
                </li>
                <li>
                  Scroll down and tap <strong>'Add to Home Screen'</strong> (<IconAddToHomeScreen size={14} className="inline-svg" />).
                </li>
                <li>
                  Tap <strong>'Add'</strong> in the top right. Streak Tracker is now installed!
                </li>
              </ol>
            </div>
          ) : (
            <div className="card-android-instructions">
              <div className="instruction-chip">
                {isAndroid ? <IconAndroid size={14} /> : <IconSpark size={14} />}
                <span>{isAndroid ? 'Android Chrome / Edge:' : 'Browser / Desktop:'}</span>
              </div>
              <ol className="instructions-list">
                <li>
                  {canInstallDirectly ? (
                    <span>Click the <strong>'Download App'</strong> button above to install directly.</span>
                  ) : (
                    <span>
                      Tap browser menu (<strong>⋮</strong>) in the top-right and select <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
                    </span>
                  )}
                </li>
                <li>
                  Confirm the installation prompt to add Streak Tracker to your home screen or application menu.
                </li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
