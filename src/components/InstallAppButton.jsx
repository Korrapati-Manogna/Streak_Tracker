import React from 'react';
import { IconDownload, IconCheck, IconSpinner } from './InstallIcons.jsx';

export default function InstallAppButton({
  isInstalled = false,
  isInstalling = false,
  onInstall,
  variant = 'header',
  className = ''
}) {
  if (isInstalled) {
    return (
      <button
        type="button"
        className={`btn-install-app installed ${variant} ${className}`}
        disabled
        title="Streak Tracker is installed on your device"
        aria-label="Application is already installed"
      >
        <IconCheck size={16} className="btn-icon-check" />
        <span className="install-btn-text">Installed</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`btn-install-app ${isInstalling ? 'is-busy' : ''} ${variant} ${className}`}
      onClick={onInstall}
      disabled={isInstalling}
      id={`pwa-download-btn-${variant}`}
      title={isInstalling ? 'Checking installation status...' : 'Download and install Streak Tracker as Web App'}
      aria-label="Download and install Streak Tracker as Web App"
    >
      {isInstalling ? (
        <>
          <IconSpinner size={16} />
          <span className="install-btn-text">Installing...</span>
        </>
      ) : (
        <>
          <IconDownload size={16} className="btn-icon-download" />
          <span className="install-btn-text">
            {variant === 'banner' ? 'Download App' : 'Install App'}
          </span>
        </>
      )}
    </button>
  );
}
