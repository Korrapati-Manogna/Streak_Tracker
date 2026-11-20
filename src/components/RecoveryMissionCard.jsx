import React from 'react';

export default function RecoveryMissionCard({
  streakData,
  onOpenFastLog
}) {
  const {
    recoveryAvailable,
    recoveryProblemsNeeded,
    recoveryPossibleCount,
    todayCount,
    dailyGoal,
    recoveredDates
  } = streakData;

  // If yesterday was recovered today, show celebratory banner
  const hasJustRecovered = recoveredDates.length > 0 && todayCount >= dailyGoal + 2;

  if (hasJustRecovered) {
    return (
      <div className="recovery-success-banner" role="status">
        <div className="banner-icon">🛡️✨</div>
        <div className="banner-text">
          <h3>Streak Successfully Recovered!</h3>
          <p>
            You solved <strong>{todayCount} problems</strong> today ({dailyGoal} daily goal + 2 recovery bonus).
            Yesterday's missed day has been restored and your streak is continuing unbroken!
          </p>
        </div>
      </div>
    );
  }

  if (!recoveryAvailable) return null;

  const totalNeeded = recoveryPossibleCount; // dailyGoal + 2
  const bonusCount = 2;

  return (
    <div className="recovery-mission-card" role="region" aria-label="Streak Recovery Protocol">
      <div className="mission-header">
        <div className="mission-badge">
          <span className="badge-shield">🛡️</span>
          <span>RECOVERY PROTOCOL ACTIVE</span>
        </div>
        <span className="mission-countdown">
          {recoveryProblemsNeeded} {recoveryProblemsNeeded === 1 ? 'problem' : 'problems'} left to recover
        </span>
      </div>

      <div className="mission-body">
        <h3 className="mission-title">Gain Your Streak Back (+2 Bonus Required)</h3>
        <p className="mission-desc">
          You missed practice yesterday. By solving <strong>{totalNeeded} problems</strong> today
          ({dailyGoal} daily goal + {bonusCount} recovery bonus), you will recover yesterday’s missed day and keep your full streak alive!
        </p>

        <div className="mission-steps-progress">
          <div className="steps-header">
            <span>Recovery Progress</span>
            <strong>{Math.min(todayCount, totalNeeded)} / {totalNeeded} Solved</strong>
          </div>

          <div className="checklist-items">
            {Array.from({ length: totalNeeded }).map((_, idx) => {
              const isDone = todayCount > idx;
              const isBonus = idx >= dailyGoal;
              return (
                <div key={idx} className={`checklist-item ${isDone ? 'done' : 'pending'}`}>
                  <span className="item-check">{isDone ? '✓' : idx + 1}</span>
                  <span className="item-text">
                    {idx < dailyGoal
                      ? `Problem ${idx + 1} (Daily Target)`
                      : `Problem ${idx + 1} (Recovery Bonus +${idx - dailyGoal + 1})`}
                  </span>
                  {isBonus && <span className="bonus-tag">+1 Recovery</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mission-actions">
          <button
            type="button"
            className="btn-recovery-action"
            onClick={onOpenFastLog}
          >
            ⚡ Solve Recovery Problem Now
          </button>
        </div>
      </div>
    </div>
  );
}
