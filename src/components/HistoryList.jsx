import React from 'react';
import { formatDateDisplay, getDayOfWeek } from '../streak.js';

export default function HistoryList({ entries, recoveredDates = [], dailyGoal = 1, onDeleteEntry }) {
  // Aggregate entries by date
  const groupedByDate = {};
  for (const entry of entries) {
    if (!groupedByDate[entry.date]) {
      groupedByDate[entry.date] = [];
    }
    groupedByDate[entry.date].push(entry);
  }

  // Also include any recoveredDates that might have 0 entries
  for (const recDate of recoveredDates) {
    if (!groupedByDate[recDate]) {
      groupedByDate[recDate] = [];
    }
  }

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => (b < a ? -1 : b > a ? 1 : 0));

  if (sortedDates.length === 0) {
    return (
      <section className="history-section" aria-label="Problem History">
        <div className="section-header">
          <div>
            <h2 className="section-title">Practice History</h2>
            <p className="section-subtitle">Chronological record of your solved DSA problems</p>
          </div>
        </div>

        <div className="empty-state-card">
          <span className="empty-icon">📝</span>
          <h3>No problems logged yet</h3>
          <p>
            Start your streak journey by logging your first problem using the form above, or click
            <strong> "Load demo data"</strong> to see 10 days of sample practice and streak recovery in action.
          </p>
        </div>
      </section>
    );
  }

  const recoveredSet = new Set(recoveredDates);

  return (
    <section className="history-section" aria-label="Problem History">
      <div className="section-header">
        <div>
          <h2 className="section-title">Practice History</h2>
          <p className="section-subtitle">
            {entries.length} total {entries.length === 1 ? 'problem' : 'problems'} logged across {sortedDates.length} {sortedDates.length === 1 ? 'date' : 'dates'} (newest first)
          </p>
        </div>
      </div>

      <div className="history-groups-list">
        {sortedDates.map((dateStr) => {
          const dateEntries = groupedByDate[dateStr] || [];
          const count = dateEntries.length;
          const formattedDate = formatDateDisplay(dateStr);
          const isRecovered = recoveredSet.has(dateStr);
          const isCompleted = count >= dailyGoal;

          return (
            <div key={dateStr} className={`date-group-card ${isRecovered ? 'group-recovered' : ''}`}>
              <div className="date-group-header">
                <div className="date-group-meta">
                  <h3 className="date-group-title">{formattedDate}</h3>
                  <span className="date-group-count">
                    {count} {count === 1 ? 'problem solved' : 'problems solved'}
                  </span>
                </div>

                <div className="date-group-badges">
                  {isRecovered && (
                    <span className="badge-recovered-history" title="This missed day was recovered by solving dailyGoal + 2 on the next day">
                      🛡️ Recovered Day
                    </span>
                  )}
                  {isCompleted && !isRecovered && (
                    <span className="badge-completed-history">
                      ✓ Completed
                    </span>
                  )}
                  {!isCompleted && !isRecovered && count > 0 && (
                    <span className="badge-incomplete-history">
                      {count} / {dailyGoal} Goal
                    </span>
                  )}
                </div>
              </div>

              {count === 0 && isRecovered ? (
                <div className="recovered-empty-note">
                  <span>ℹ️ 0 problems logged on this day. Day was restored through streak recovery rule (+2 problems next day).</span>
                </div>
              ) : (
                <ul className="entries-list">
                  {dateEntries.map((entry) => (
                    <li key={entry.id} className="entry-item">
                      <div className="entry-info">
                        <span className="entry-name">{entry.problemName}</span>
                        <div className="entry-sub-meta">
                          <span className={`platform-pill platform-${entry.platform.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                            {entry.platform}
                          </span>
                          <span className="entry-day-inline">
                            {getDayOfWeek(entry.date, 'short')}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteEntry(entry.id)}
                        className="btn-delete"
                        title="Delete this entry"
                        aria-label={`Delete ${entry.problemName}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
