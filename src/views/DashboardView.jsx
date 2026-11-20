import React from 'react';
import StreakHero from '../components/StreakHero.jsx';
import InstallAppCard from '../components/InstallAppCard.jsx';
import MotivationBanner from '../components/MotivationBanner.jsx';
import RecoveryMissionCard from '../components/RecoveryMissionCard.jsx';
import StreakLostCard from '../components/StreakLostCard.jsx';
import StreakHeatmap from '../components/StreakHeatmap.jsx';
import { formatDateDisplay, getDayOfWeek } from '../streak.js';

export default function DashboardView({
  streakData,
  entries,
  effectiveToday,
  activeMotivationMessage,
  onShuffleMessage,
  onOpenFastLog,
  onToggleCompleted,
  onDeleteEntry,
  onNavigateToProblems,
  pwaInstallProps
}) {
  const { currentStreak, todayCount, dailyGoal } = streakData;

  // Filter entries logged for "today"
  const todayEntries = entries.filter((e) => e.date === effectiveToday);

  return (
    <div className="view-container dashboard-view">
      {/* 1. Focal Visual Element: Streak Hero */}
      <StreakHero streakData={streakData} />

      {/* 2. Install App directly on the dashboard */}
      <InstallAppCard {...(pwaInstallProps || {})} />

      {/* 3. Recovery Protocol Mode: Gaining the streak by solving 2 problems more */}
      <RecoveryMissionCard
        streakData={streakData}
        onOpenFastLog={onOpenFastLog}
      />

      {/* 4. Motivating if the streak is lost */}
      <StreakLostCard
        currentStreak={currentStreak}
        entriesCount={entries.length}
        onOpenFastLog={onOpenFastLog}
      />

      {/* 5. Contextual Motivation Message Bank */}
      <MotivationBanner
        streakData={{
          ...streakData,
          motivationMessage: activeMotivationMessage
        }}
        onShuffleMessage={onShuffleMessage}
      />

      {/* 6. 14-Day Activity Heatmap */}
      <StreakHeatmap last14Days={streakData.last14Days} />

      {/* 6. Today's Practice Panel */}
      <section className="today-practice-section" aria-label="Today's Practice">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Today's Practice ({formatDateDisplay(effectiveToday)})
            </h2>
            <p className="section-subtitle">
              {todayCount} of {dailyGoal} {dailyGoal === 1 ? 'problem' : 'problems'} completed today
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenFastLog}
          >
            + Log Problem
          </button>
        </div>

        {todayEntries.length === 0 ? (
          <div className="empty-today-card">
            <span className="empty-today-icon">⚡</span>
            <h4>No problems logged for today yet</h4>
            <p>
              {streakData.recoveryAvailable
                ? `Solve ${streakData.recoveryProblemsNeeded} problems today to restore your streak!`
                : currentStreak > 0
                ? `Solve ${dailyGoal} problem to keep your ${currentStreak}-day streak alive!`
                : 'Solve your first problem today to kick off a new streak!'}
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={onOpenFastLog}
            >
              + Log Today's Problem
            </button>
          </div>
        ) : (
          <div className="today-items-grid">
            {todayEntries.map((entry) => (
              <div key={entry.id} className={`today-entry-card ${entry.completed !== false ? 'completed' : 'in-progress'}`}>
                <div className="today-entry-left">
                  <button
                    type="button"
                    className={`btn-check-toggle ${entry.completed !== false ? 'checked' : ''}`}
                    onClick={() => onToggleCompleted(entry.id)}
                    title={entry.completed !== false ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {entry.completed !== false ? '✓' : '○'}
                  </button>
                  <div className="today-entry-details">
                    <span className="today-entry-name">{entry.problemName}</span>
                    <div className="today-entry-tags">
                      <span className={`platform-pill platform-${entry.platform.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                        {entry.platform}
                      </span>
                      {entry.difficulty && (
                        <span className={`diff-pill diff-${entry.difficulty.toLowerCase()}`}>
                          {entry.difficulty}
                        </span>
                      )}
                      {entry.topic && (
                        <span className="topic-pill">{entry.topic}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="today-entry-right">
                  <span className="today-entry-time">
                    {getDayOfWeek(entry.date, 'short')}
                  </span>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => onDeleteEntry(entry.id)}
                    title="Delete entry"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="view-more-footer">
          <button
            type="button"
            className="btn-link"
            onClick={onNavigateToProblems}
          >
            View all {entries.length} solved problems in Practice & Problems →
          </button>
        </div>
      </section>
    </div>
  );
}
