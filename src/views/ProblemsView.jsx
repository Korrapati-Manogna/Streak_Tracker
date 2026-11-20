import React, { useState, useMemo } from 'react';
import { PLATFORMS, DIFFICULTIES, TOPICS, formatDateDisplay, getDayOfWeek } from '../streak.js';

export default function ProblemsView({
  entries,
  recoveredDates = [],
  dailyGoal = 1,
  onOpenFastLog,
  onToggleCompleted,
  onDeleteEntry
}) {
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const trimmedSearch = search.trim();

  // Search verification matching
  const searchMatches = useMemo(() => {
    if (!trimmedSearch) return [];
    const q = trimmedSearch.toLowerCase();
    return entries.filter((e) => e.problemName.toLowerCase().includes(q));
  }, [entries, trimmedSearch]);

  const exactMatch = useMemo(() => {
    if (!trimmedSearch) return null;
    const q = trimmedSearch.toLowerCase();
    return entries.find((e) => e.problemName.toLowerCase() === q);
  }, [entries, trimmedSearch]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (trimmedSearch) {
        const q = trimmedSearch.toLowerCase();
        const matchName = entry.problemName.toLowerCase().includes(q);
        const matchTopic = (entry.topic || '').toLowerCase().includes(q);
        const matchNotes = (entry.notes || '').toLowerCase().includes(q);
        if (!matchName && !matchTopic && !matchNotes) return false;
      }

      if (filterPlatform !== 'All' && entry.platform !== filterPlatform) {
        return false;
      }

      if (filterDifficulty !== 'All' && entry.difficulty !== filterDifficulty) {
        return false;
      }

      if (filterTopic !== 'All' && entry.topic !== filterTopic) {
        return false;
      }

      if (filterStatus === 'Completed' && entry.completed === false) {
        return false;
      }

      if (filterStatus === 'In-Progress' && entry.completed !== false) {
        return false;
      }

      return true;
    });
  }, [entries, trimmedSearch, filterPlatform, filterDifficulty, filterTopic, filterStatus]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups = {};
    for (const entry of filteredEntries) {
      if (!groups[entry.date]) {
        groups[entry.date] = [];
      }
      groups[entry.date].push(entry);
    }

    // Include recovered dates if no search filter active
    if (!trimmedSearch && filterPlatform === 'All' && filterDifficulty === 'All' && filterTopic === 'All') {
      for (const recDate of recoveredDates) {
        if (!groups[recDate]) {
          groups[recDate] = [];
        }
      }
    }

    return groups;
  }, [filteredEntries, recoveredDates, trimmedSearch, filterPlatform, filterDifficulty, filterTopic]);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => (b < a ? -1 : b > a ? 1 : 0));
  const recoveredSet = new Set(recoveredDates);

  const completedCount = entries.filter((e) => e.completed !== false).length;
  const inProgressCount = entries.filter((e) => e.completed === false).length;

  return (
    <div className="view-container problems-view">
      <div className="view-header-bar">
        <div>
          <h2 className="view-heading">DSA Problem Catalog</h2>
          <p className="view-subheading">
            Check previous practice, denote completion, and manage algorithms
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => onOpenFastLog('')}
        >
          + Log New Problem
        </button>
      </div>

      {/* Summary stats strip */}
      <div className="problems-stat-strip">
        <div className="p-stat">
          <span className="p-stat-label">Total Logged</span>
          <span className="p-stat-val">{entries.length}</span>
        </div>
        <div className="p-stat">
          <span className="p-stat-label">Completed (Counted)</span>
          <span className="p-stat-val val-green">{completedCount}</span>
        </div>
        <div className="p-stat">
          <span className="p-stat-label">In-Progress</span>
          <span className="p-stat-val val-yellow">{inProgressCount}</span>
        </div>
        <div className="p-stat">
          <span className="p-stat-label">Active Days</span>
          <span className="p-stat-val">{sortedDates.length}</span>
        </div>
      </div>

      {/* Search & Verification Card */}
      <div className="filters-card">
        <div className="search-section">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Type problem name to check if done previously (e.g. Two Sum, 3Sum, LRU Cache)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Result: Previous Completion Verification Panel */}
          {trimmedSearch && (
            <div className={`search-verification-panel ${searchMatches.length > 0 ? 'is-previously-done' : 'is-not-done'}`}>
              {searchMatches.length > 0 ? (
                <div className="verification-content">
                  <div className="verification-status-row">
                    <span className="verification-badge badge-done">
                      ✓ Done Previously ({searchMatches.length} {searchMatches.length === 1 ? 'time' : 'times'})
                    </span>
                    <span className="verification-query">
                      Query: <strong>"{trimmedSearch}"</strong>
                    </span>
                  </div>

                  <p className="verification-detail-text">
                    {exactMatch
                      ? `Match confirmed! You solved "${exactMatch.problemName}" on ${formatDateDisplay(exactMatch.date)} via ${exactMatch.platform} (${exactMatch.difficulty || 'Medium'})${exactMatch.completed !== false ? ' [Completed]' : ' [In-Progress]'}.`
                      : `Found ${searchMatches.length} matching previously solved problem(s).`}
                  </p>

                  <div className="verification-matches-pills">
                    {searchMatches.slice(0, 4).map((item) => (
                      <span key={item.id} className="v-match-pill">
                        <strong>{item.problemName}</strong> · {formatDateDisplay(item.date)} ({item.platform})
                        {item.completed !== false ? ' ✓' : ' ○'}
                      </span>
                    ))}
                    {searchMatches.length > 4 && (
                      <span className="v-more-pill">+{searchMatches.length - 4} more</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="verification-content">
                  <div className="verification-status-row">
                    <span className="verification-badge badge-not-done">
                      ✨ Not Done Previously
                    </span>
                    <span className="verification-query">
                      Query: <strong>"{trimmedSearch}"</strong>
                    </span>
                  </div>

                  <p className="verification-detail-text">
                    No previous practice records found for "{trimmedSearch}". This problem has never been logged in your catalog!
                  </p>

                  <button
                    type="button"
                    className="btn-log-searched-problem"
                    onClick={() => onOpenFastLog(trimmedSearch)}
                  >
                    + Solve & Log "{trimmedSearch}" Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Platform</label>
            <select
              className="filter-select"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
            >
              <option value="All">All Platforms</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Difficulty</label>
            <select
              className="filter-select"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Topic / Pattern</label>
            <select
              className="filter-select"
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
            >
              <option value="All">All Topics</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed Only</option>
              <option value="In-Progress">In-Progress Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems List grouped by date */}
      {sortedDates.length === 0 ? (
        <div className="empty-state-card">
          <span className="empty-icon">🔍</span>
          <h3>No matching problems found</h3>
          <p>
            {entries.length === 0
              ? 'Your practice catalog is empty. Click "+ Log New Problem" above to start!'
              : 'No problems match the current filter or search query. Try clearing your search.'}
          </p>
          {entries.length > 0 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSearch('');
                setFilterPlatform('All');
                setFilterDifficulty('All');
                setFilterTopic('All');
                setFilterStatus('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="problems-date-groups">
          {sortedDates.map((dateStr) => {
            const dateEntries = groupedByDate[dateStr] || [];
            const count = dateEntries.length;
            const completedInDate = dateEntries.filter((e) => e.completed !== false).length;
            const formattedDate = formatDateDisplay(dateStr);
            const isRecovered = recoveredSet.has(dateStr);
            const isDayCompleted = completedInDate >= dailyGoal;

            return (
              <div key={dateStr} className={`date-catalog-card ${isRecovered ? 'is-recovered-day' : ''}`}>
                <div className="catalog-header">
                  <div className="catalog-date-info">
                    <h3 className="catalog-date-title">{formattedDate}</h3>
                    <span className="catalog-date-count">
                      {completedInDate} of {dailyGoal} completed ({count} total logged)
                    </span>
                  </div>

                  <div className="catalog-badges">
                    {isRecovered && (
                      <span className="badge-recovered-history" title="Recovered through +2 next day rule">
                        🛡️ Recovered Day
                      </span>
                    )}
                    {isDayCompleted && !isRecovered && (
                      <span className="badge-completed-history">
                        ✓ Target Met
                      </span>
                    )}
                    {!isDayCompleted && !isRecovered && completedInDate > 0 && (
                      <span className="badge-incomplete-history">
                        {completedInDate} / {dailyGoal} Goal
                      </span>
                    )}
                  </div>
                </div>

                {count === 0 && isRecovered ? (
                  <div className="recovered-empty-note">
                    <span>🛡️ 0 problems logged on this day. Day was restored through the Streak Recovery Rule (+2 problems next day).</span>
                  </div>
                ) : (
                  <ul className="catalog-entries-list">
                    {dateEntries.map((entry) => {
                      const isComplete = entry.completed !== false;
                      return (
                        <li key={entry.id} className={`catalog-entry-item ${isComplete ? 'is-complete' : 'is-pending'}`}>
                          {/* Completion toggle checkbox */}
                          <button
                            type="button"
                            className={`catalog-checkbox ${isComplete ? 'checked' : ''}`}
                            onClick={() => onToggleCompleted(entry.id)}
                            title={isComplete ? 'Mark problem as in-progress' : 'Denote problem as completed'}
                            aria-label={`Toggle completion for ${entry.problemName}`}
                          >
                            {isComplete ? '✓' : ''}
                          </button>

                          <div className="catalog-entry-body">
                            <div className="catalog-title-row">
                              <span className={`catalog-problem-name ${isComplete ? 'title-done' : ''}`}>
                                {entry.problemName}
                              </span>
                              <div className="catalog-tags-row">
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

                            {entry.notes && (
                              <p className="catalog-problem-notes">
                                💡 {entry.notes}
                              </p>
                            )}

                            <div className="catalog-sub-details">
                              <span className="catalog-time">
                                Day: {getDayOfWeek(entry.date, 'short')}
                              </span>
                              <span className="catalog-status-text">
                                {isComplete ? 'Status: Completed' : 'Status: In-Progress (Unsolved)'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() => onDeleteEntry(entry.id)}
                            title="Delete this entry"
                            aria-label={`Delete ${entry.problemName}`}
                          >
                            ✕
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
