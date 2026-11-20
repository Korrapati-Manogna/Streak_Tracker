import React, { useState } from 'react';
import { addDays, formatDateDisplay } from '../streak.js';
import { exportDataJSON, importDataJSON } from '../storage.js';
import InstallAppButton from '../components/InstallAppButton.jsx';
import { IconSpark, IconCheck } from '../components/InstallIcons.jsx';

export default function SettingsView({
  settings,
  onSaveSettings,
  onLoadDemo,
  onClearAll,
  realToday,
  onShowToast,
  pwaInstallProps
}) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const effectiveToday = settings.devTodayOverride || realToday;
  const isOverridden = Boolean(settings.devTodayOverride && settings.devTodayOverride !== realToday);

  const handleGoalChange = (val) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1) {
      onSaveSettings({ dailyGoal: num });
      if (onShowToast) onShowToast({ message: `Daily goal updated to ${num} problems.`, type: 'success', icon: '🎯' });
    }
  };

  const handleProfileSave = (name, role) => {
    onSaveSettings({ userName: name, targetRole: role });
    if (onShowToast) onShowToast({ message: 'Profile updated successfully.', type: 'success', icon: '👤' });
  };

  const handleDateOverride = (dateStr) => {
    onSaveSettings({ devTodayOverride: dateStr });
    if (onShowToast) onShowToast({ message: `Date simulated to ${dateStr}`, type: 'info', icon: '🛠️' });
  };

  const handleResetDate = () => {
    onSaveSettings({ devTodayOverride: '' });
    if (onShowToast) onShowToast({ message: 'Reset to real calendar today.', type: 'info', icon: '↺' });
  };

  const handleStepDay = (delta) => {
    const nextDate = addDays(effectiveToday, delta);
    onSaveSettings({ devTodayOverride: nextDate });
    if (onShowToast) onShowToast({ message: `Stepped to ${nextDate}`, type: 'info', icon: '⏩' });
  };

  const handleExport = () => {
    const json = exportDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streak-tracker-backup-${effectiveToday}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onShowToast) onShowToast({ message: 'Data exported to JSON file.', type: 'success', icon: '💾' });
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const res = importDataJSON(importText);
    if (res.success) {
      setShowImportBox(false);
      setImportText('');
      if (onShowToast) onShowToast({ message: `Successfully imported ${res.count} problems!`, type: 'success', icon: '📥' });
      window.location.reload();
    } else {
      if (onShowToast) onShowToast({ message: `Import error: ${res.error}`, type: 'error', icon: '⚠️' });
    }
  };

  return (
    <div className="view-container settings-view">
      <div className="view-header-bar">
        <div>
          <h2 className="view-heading">Settings & Preferences</h2>
          <p className="view-subheading">
            Configure daily targets, time-travel simulation, profile, and data management
          </p>
        </div>
      </div>

      <div className="settings-cards-stack">
        {/* 1. Daily Goal & Streak Rules */}
        <section className="settings-section-card" aria-label="Goal Settings">
          <div className="section-header">
            <div>
              <h3 className="section-title">Daily Practice Goal</h3>
              <p className="section-subtitle">Number of solved problems required to complete each day</p>
            </div>
            <span className="goal-active-badge">Target: {settings.dailyGoal}/day</span>
          </div>

          <div className="goal-setting-body">
            <div className="goal-selector-row">
              <input
                id="setting-daily-goal"
                type="number"
                min="1"
                max="20"
                className="goal-input-large"
                value={settings.dailyGoal}
                onChange={(e) => handleGoalChange(e.target.value)}
              />
              <div className="quick-goal-chips">
                {[1, 2, 3, 5, 8].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`btn-goal-chip ${settings.dailyGoal === g ? 'active' : ''}`}
                    onClick={() => handleGoalChange(g)}
                  >
                    {g} {g === 1 ? 'Problem' : 'Problems'}
                  </button>
                ))}
              </div>
            </div>

            <div className="rule-explanation-box">
              <span className="rule-icon">🛡️</span>
              <div>
                <strong>Single-Day Recovery Protocol:</strong>
                <p>
                  With your daily goal set to <strong>{settings.dailyGoal}</strong>, if you miss 1 day,
                  you can recover your entire streak on the next day by solving <strong>{settings.dailyGoal + 2} problems</strong> ({settings.dailyGoal} goal + 2 recovery bonus).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Dev Date Override Simulator */}
        <section className="settings-section-card dev-card" aria-label="Dev Simulator">
          <div className="section-header">
            <div>
              <h3 className="section-title">🛠️ Dev-Only Date Simulator (Time Travel)</h3>
              <p className="section-subtitle">
                Demonstrate streak breaking, pending recovery, and resets without waiting for real days to pass
              </p>
            </div>
            {isOverridden && (
              <span className="override-active-pill">
                Active: {formatDateDisplay(effectiveToday)}
              </span>
            )}
          </div>

          <div className="simulator-controls">
            <div className="simulator-input-row">
              <label htmlFor="sim-date-picker" className="control-label">Simulated "Today" Date:</label>
              <input
                id="sim-date-picker"
                type="date"
                className="date-input"
                value={effectiveToday}
                onChange={(e) => handleDateOverride(e.target.value)}
              />
            </div>

            <div className="step-actions-group">
              <button
                type="button"
                className="btn-step"
                onClick={() => handleStepDay(-1)}
                title="Step backward 1 day"
              >
                ◀ -1 Day
              </button>
              <button
                type="button"
                className="btn-step"
                onClick={() => handleStepDay(1)}
                title="Fast-forward 1 day (Test if streak holds or breaks)"
              >
                +1 Day (Tomorrow) ▶
              </button>
              <button
                type="button"
                className="btn-step"
                onClick={() => handleStepDay(2)}
                title="Fast-forward 2 days (Test two consecutive missed days)"
              >
                +2 Days ▶▶
              </button>
              {isOverridden && (
                <button
                  type="button"
                  className="btn-reset-date"
                  onClick={handleResetDate}
                >
                  ↺ Reset to Real Date ({realToday})
                </button>
              )}
            </div>

            <p className="simulator-help-text">
              💡 <em>Demo tip:</em> Load the 10-day demo data, then fast-forward to test the recovery window and permanent streak resets!
            </p>
          </div>
        </section>

        {/* 3. User Profile */}
        <section className="settings-section-card" aria-label="Profile Settings">
          <div className="section-header">
            <div>
              <h3 className="section-title">Profile & Target Role</h3>
              <p className="section-subtitle">Personalize your journey and career milestones</p>
            </div>
          </div>

          <div className="profile-edit-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="pref-name">Display Name</label>
              <input
                id="pref-name"
                type="text"
                className="form-input"
                defaultValue={settings.userName}
                onBlur={(e) => handleProfileSave(e.target.value, settings.targetRole)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pref-role">Target Engineering Role</label>
              <input
                id="pref-role"
                type="text"
                className="form-input"
                defaultValue={settings.targetRole}
                placeholder="e.g. SDE II @ FAANG / Backend Engineer"
                onBlur={(e) => handleProfileSave(settings.userName, e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Web App & Mobile Installation */}
        <section className="settings-section-card" aria-label="Web App & Mobile Installation">
          <div className="section-header">
            <div>
              <h3 className="section-title">Web App & Mobile Installation</h3>
              <p className="section-subtitle">
                Download and install Streak Tracker directly to your device home screen for instant offline practice.
              </p>
            </div>
            {pwaInstallProps?.isInstalled ? (
              <span className="installed-pill">
                <IconCheck size={14} /> Installed
              </span>
            ) : (
              <span className="pwa-badge">Desktop & Mobile PWA</span>
            )}
          </div>

          <div className="pwa-settings-status-box">
            <div className="status-box-header">
              <div className="status-box-icon">
                <IconSpark size={18} className="pwa-spark-svg" />
              </div>
              <div>
                <strong>
                  {pwaInstallProps?.isInstalled
                    ? 'Streak Tracker is Installed'
                    : 'Web Application Ready for Install'}
                </strong>
                <p className="status-box-subtext">
                  {pwaInstallProps?.isInstalled
                    ? 'Running in standalone progressive web app mode with cached offline capabilities.'
                    : 'Install to Android, iPhone, iPad or Desktop without downloading from any app store.'}
                </p>
              </div>
            </div>

            <div className="pwa-settings-actions">
              <InstallAppButton
                isInstalled={pwaInstallProps?.isInstalled}
                isInstalling={pwaInstallProps?.isInstalling}
                onInstall={pwaInstallProps?.onInstall}
                variant="card"
              />
            </div>
          </div>
        </section>

        {/* 4. Data Management: Demo, Backup, Wipe */}
        <section className="settings-section-card" aria-label="Data Management">
          <div className="section-header">
            <div>
              <h3 className="section-title">Data Management</h3>
              <p className="section-subtitle">Load demonstration datasets, backup, or reset data</p>
            </div>
          </div>

          <div className="data-management-actions">
            <button
              type="button"
              className="btn-demo-load"
              onClick={() => {
                onLoadDemo();
                if (onShowToast) onShowToast({ message: 'Loaded 10 days of sample practice with recovery!', type: 'success', icon: '🚀' });
              }}
            >
              🚀 Load Demo Data (10 Days with Recovery Demo)
            </button>

            <div className="backup-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleExport}
              >
                💾 Export Data (JSON)
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowImportBox(!showImportBox)}
              >
                📥 Import Data (JSON)
              </button>
            </div>

            {showImportBox && (
              <div className="import-box">
                <label className="form-label">Paste Exported JSON Content:</label>
                <textarea
                  className="import-textarea"
                  rows={4}
                  placeholder='{"version": "1.0", "entries": [...]}'
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
                <div className="import-btn-row">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleImportSubmit}
                  >
                    Load JSON
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowImportBox(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="danger-zone">
              {!showConfirmClear ? (
                <button
                  type="button"
                  className="btn-danger-outline"
                  onClick={() => setShowConfirmClear(true)}
                >
                  🗑️ Clear All Application Data
                </button>
              ) : (
                <div className="confirm-clear-box">
                  <span>Are you sure? This action will permanently remove all problem entries and reset daily goals.</span>
                  <div className="confirm-btn-group">
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => {
                        onClearAll();
                        setShowConfirmClear(false);
                        if (onShowToast) onShowToast({ message: 'All practice data wiped.', type: 'info', icon: '🗑️' });
                      }}
                    >
                      Yes, Clear Everything
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowConfirmClear(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
