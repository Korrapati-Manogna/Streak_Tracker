import React from 'react';
import InstallAppButton from './InstallAppButton.jsx';
import { IconClose, IconSpark } from './InstallIcons.jsx';

export default function MobileInstallBanner({
  isInstalled,
  isInstalling,
  onInstall,
  bannerDismissed,
  onDismiss,
  isMobile
}) {
  // Do not show banner if app is already running as installed or user dismissed it
  if (isInstalled || bannerDismissed) {
    return null;
  }

  return (
    <aside
      className={`mobile-install-banner ${isMobile ? 'is-mobile' : ''}`}
      aria-label="Install Web Application"
    >
      <div className="mobile-banner-left">
        <div className="mobile-banner-icon">
          <IconSpark size={18} className="banner-spark-svg" />
        </div>
        <div className="mobile-banner-text">
          <span className="mobile-banner-title">Get the Streak Tracker App</span>
          <span className="mobile-banner-desc">
            Fast, full-screen & offline for Android & iPhone
          </span>
        </div>
      </div>

      <div className="mobile-banner-actions">
        <InstallAppButton
          isInstalled={isInstalled}
          isInstalling={isInstalling}
          onInstall={onInstall}
          variant="banner"
        />
        <button
          type="button"
          className="mobile-banner-close"
          onClick={onDismiss}
          title="Dismiss install banner"
          aria-label="Dismiss banner"
        >
          <IconClose size={16} />
        </button>
      </div>
    </aside>
  );
}
