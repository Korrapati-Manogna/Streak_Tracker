import React from 'react';

export default function StreakHero({ streakData }) {
  const {
    currentStreak,
    longestStreak,
    todayCount,
    dailyGoal,
    todayCompleted,
    recoveryAvailable,
    recoveryProblemsNeeded
  } = streakData;

  const progressPercent = Math.min(100, Math.round((todayCount / dailyGoal) * 100));

  let statusBadge = {
    label: 'Active Streak',
    color: 'badge-active'
  };

  if (recoveryAvailable) {
    statusBadge = {
      label: `Recovery Open (${recoveryProblemsNeeded} needed)`,
      color: 'badge-recovery'
    };
  } else if (todayCompleted) {
    statusBadge = {
      label: 'Goal Met Today',
      color: 'badge-completed'
    };
  } else if (currentStreak > 0) {
    statusBadge = {
      label: 'Alive · Needs Daily Goal',
      color: 'badge-pending'
    };
  } else {
    statusBadge = {
      label: 'No Active Streak',
      color: 'badge-inactive'
    };
  }

  return (
    <section className="streak-hero-card" aria-label="Streak Overview">
      <div className="hero-top-row">
        <span className={`status-pill ${statusBadge.color}`}>
          <span className="status-dot" />
          {statusBadge.label}
        </span>
        <span className="daily-target-tag">
          Daily Goal: <strong>{dailyGoal} {dailyGoal === 1 ? 'problem' : 'problems'}</strong>
        </span>
      </div>

      <div className="hero-main">
        <div className="streak-flame-container">
          <span className="streak-flame" role="img" aria-label="Flame">
            {currentStreak > 0 ? '🔥' : '❄️'}
          </span>
          <div className="streak-number-group">
            <span className="streak-number">{currentStreak}</span>
            <span className="streak-label">{currentStreak === 1 ? 'DAY STREAK' : 'DAYS STREAK'}</span>
          </div>
        </div>

        {recoveryAvailable && (
          <div className="recovery-alert" role="alert">
            <span className="recovery-icon">⚡</span>
            <div>
              <strong>Streak Recovery Active!</strong>
              <p>
                Solve <strong>{recoveryProblemsNeeded} more {recoveryProblemsNeeded === 1 ? 'problem' : 'problems'}</strong> today to recover yesterday’s missed day and continue your streak.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="hero-stats-grid">
        <div className="stat-box">
          <span className="stat-title">Current Streak</span>
          <span className="stat-value highlight">{currentStreak} <span className="stat-unit">days</span></span>
        </div>

        <div className="stat-box">
          <span className="stat-title">Longest Streak</span>
          <span className="stat-value">{longestStreak} <span className="stat-unit">days</span></span>
        </div>

        <div className="stat-box">
          <span className="stat-title">Today's Progress</span>
          <span className="stat-value">
            {todayCount} <span className="stat-unit">/ {dailyGoal}</span>
          </span>
          <div className="progress-bar-track" aria-hidden="true">
            <div
              className={`progress-bar-fill ${todayCompleted ? 'progress-complete' : ''}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
