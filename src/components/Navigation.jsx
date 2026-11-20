import React from 'react';
import InstallAppButton from './InstallAppButton.jsx';

export default function Navigation({
  activeTab,
  onSelectTab,
  user,
  onLogout,
  onOpenFastLog,
  onOpenInstallModal,
  streakCount,
  isOverridden,
  effectiveToday,
  isInstalled,
  isInstalling,
  onInstall
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'problems', label: 'Practice & Problems', icon: '📚' },
    { id: 'calendar', label: 'Calendar & Heatmap', icon: '📅' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <header className="app-header-nav">
      <div className="header-top-bar">
        <div className="header-brand-group">
          <div className="brand-logo" onClick={() => onSelectTab('dashboard')} style={{ cursor: 'pointer' }}>
            <span className="brand-flame">⚡</span>
            <div>
              <span className="brand-name">Streak Tracker</span>
              <span className="brand-tag">DSA Discipline</span>
            </div>
          </div>

          <div className="header-streak-badge" title="Current Active Streak">
            <span className="badge-flame-icon">{streakCount > 0 ? '🔥' : '❄️'}</span>
            <strong>{streakCount}</strong>
            <span className="badge-streak-text">{streakCount === 1 ? 'day' : 'days'}</span>
          </div>
        </div>

        <div className="header-user-actions">
          {isOverridden && (
            <span className="header-sim-pill" title="Simulated Date Active">
              🛠️ {effectiveToday}
            </span>
          )}

          {/* Download / Install Web App Button */}
          <InstallAppButton
            isInstalled={isInstalled}
            isInstalling={isInstalling}
            onInstall={onInstall}
            variant="header"
          />

          <button
            type="button"
            className="btn-install-nav"
            onClick={onOpenInstallModal}
            title="Install Streak Tracker as desktop or mobile app"
          >
            📲 Install App
          </button>

          <button
            type="button"
            className="btn-fast-log"
            onClick={onOpenFastLog}
            title="Log a DSA problem"
          >
            + Log Problem
          </button>

          {user && (
            <div className="user-profile-menu">
              <span className="user-avatar-badge" title={user.name || user.username}>
                {user.avatar || '👨‍💻'}
              </span>
              <div className="user-name-role">
                <span className="user-name">{user.name || user.username}</span>
              </div>
              <button
                type="button"
                className="btn-logout"
                onClick={onLogout}
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <nav className="header-tabs-bar" aria-label="Main Navigation">
        <div className="tabs-container">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab-btn ${isActive ? 'tab-active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                {isActive && <span className="tab-indicator" />}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
