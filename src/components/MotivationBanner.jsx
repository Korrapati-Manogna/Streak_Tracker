import React from 'react';

const STATE_ICONS = {
  new_user: '🚀',
  alive_pending: '⏳',
  goal_met: '🎉',
  broken_recovery_available: '🛡️',
  broken_no_recovery: '🌱',
  milestone: '🏆'
};

const STATE_TITLES = {
  new_user: 'Welcome to Streak Tracker',
  alive_pending: 'Streak Pending Today',
  goal_met: 'Target Conquered',
  broken_recovery_available: 'Recovery Protocol Ready',
  broken_no_recovery: 'New Opportunity',
  milestone: 'Milestone Unlocked!'
};

export default function MotivationBanner({ streakData, onShuffleMessage }) {
  const { stateKey, motivationMessage } = streakData;
  const icon = STATE_ICONS[stateKey] || '💡';
  const title = STATE_TITLES[stateKey] || 'Daily Motivation';

  return (
    <aside className={`motivation-banner state-${stateKey}`} aria-label="Daily Motivation">
      <div className="motivation-icon-wrap" aria-hidden="true">
        <span className="motivation-icon">{icon}</span>
      </div>
      <div className="motivation-content">
        <div className="motivation-header">
          <span className="motivation-badge">{title}</span>
        </div>
        <p className="motivation-text">{motivationMessage}</p>
      </div>
      {onShuffleMessage && (
        <button
          type="button"
          onClick={onShuffleMessage}
          className="btn-shuffle"
          title="Pick another motivation message"
          aria-label="Pick another message"
        >
          🎲
        </button>
      )}
    </aside>
  );
}
