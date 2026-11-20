import React, { useState } from 'react';
import { addDays, formatDateDisplay } from '../streak.js';

export default function DemoToolbar({
  settings,
  onSaveSettings,
  onLoadDemo,
  onClearAll,
  realToday
}) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const effectiveToday = settings.devTodayOverride || realToday;
  const isOverridden = Boolean(settings.devTodayOverride && settings.devTodayOverride !== realToday);

  const handleDailyGoalChange = (newGoal) => {
    const val = parseInt(newGoal, 10);
    if (!isNaN(val) && val >= 1) {
      onSaveSettings({ dailyGoal: val });
    }
  };

  const handleOverrideDateChange = (dateStr) => {
    onSaveSettings({ devTodayOverride: dateStr });
  };

  const handleResetToRealToday = () => {
    onSaveSettings({ devTodayOverride: '' });
  };

  const handleStepDay = (delta) => {
    const nextDate = addDays(effectiveToday, delta);
    onSaveSettings({ devTodayOverride: nextDate });
  };

  return (
    <section className="demo-toolbar-card" aria-label="Settings and Demo Controls">
      <div className="demo-toolbar-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="toolbar-header-title">
          <span className="toolbar-icon">⚙️</span>
          <div>
            <h2 className="toolbar-heading">Settings & Demo Controls</h2>
            <p className="toolbar-sub">Configure daily goals and test streak simulation</p>
          </div>
        </div>
        <button
          type="button"
          className="btn-toggle-toolbar"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse toolbar' : 'Expand toolbar'}
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {isOpen && (
        <div className="demo-toolbar-body">
          {/* Daily Goal Setting */}
          <div className="control-block">
            <label htmlFor="daily-goal-input" className="control-label">
              Daily Goal (Problems per day)
            </label>
            <div className="goal-input-row">
              <input
                id="daily-goal-input"
                type="number"
                min="1"
                max="20"
                className="goal-input"
                value={settings.dailyGoal}
                onChange={(e) => handleDailyGoalChange(e.target.value)}
              />
              <div className="quick-goals">
                {[1, 2, 3, 5].map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`btn-chip ${settings.dailyGoal === g ? 'active' : ''}`}
                    onClick={() => handleDailyGoalChange(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <span className="control-help">
              Recovery requires <strong>{settings.dailyGoal + 2}</strong> problems on the day after a single missed day.
            </span>
          </div>

          {/* Dev-Only Simulated "Today" Override */}
          <div className="control-block dev-block">
            <div className="dev-header-row">
              <label htmlFor="dev-today-picker" className="control-label">
                🛠️ Dev-Only Date Override (Simulated "Today")
              </label>
              {isOverridden && (
                <span className="override-active-pill">
                  Simulating: {formatDateDisplay(effectiveToday)}
                </span>
              )}
            </div>

            <div className="date-override-row">
              <input
                id="dev-today-picker"
                type="date"
                className="date-input"
                value={effectiveToday}
                onChange={(e) => handleOverrideDateChange(e.target.value)}
              />

              <div className="step-date-buttons">
                <button
                  type="button"
                  className="btn-step"
                  onClick={() => handleStepDay(-1)}
                  title="Step 1 day back"
                >
                  -1 Day
                </button>
                <button
                  type="button"
                  className="btn-step"
                  onClick={() => handleStepDay(1)}
                  title="Fast forward 1 day to test streak breaks or recovery"
                >
                  +1 Day
                </button>
                <button
                  type="button"
                  className="btn-step"
                  onClick={() => handleStepDay(2)}
                  title="Fast forward 2 days to test streak breaking"
                >
                  +2 Days
                </button>
                {isOverridden && (
                  <button
                    type="button"
                    className="btn-reset-date"
                    onClick={handleResetToRealToday}
                    title="Reset to real current date"
                  >
                    ↺ Real Today
                  </button>
                )}
              </div>
            </div>

            <span className="control-help">
              Change the simulated "Today" to test how the streak remains alive yesterday, breaks after a missed day, offers recovery, or resets after 2 missed days.
            </span>
          </div>

          {/* Demo Data & Reset Actions */}
          <div className="demo-actions-row">
            <button
              type="button"
              className="btn-demo-load"
              onClick={onLoadDemo}
            >
              🚀 Load Demo Data (10 Days with Recovery)
            </button>

            {!showConfirmClear ? (
              <button
                type="button"
                className="btn-danger-outline"
                onClick={() => setShowConfirmClear(true)}
              >
                🗑️ Clear All Data
              </button>
            ) : (
              <div className="confirm-clear-box">
                <span>Are you sure? This removes all entries and resets settings.</span>
                <div className="confirm-btn-group">
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => {
                      onClearAll();
                      setShowConfirmClear(false);
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
      )}
    </section>
  );
}
