import React from 'react';
import PlatformSummary from '../components/PlatformSummary.jsx';
import { DailyVelocityChart, DifficultyDonutChart } from '../components/AnalyticsCharts.jsx';
import { TOPICS } from '../streak.js';

export default function AnalyticsView({ entries = [], streakData }) {
  const { currentStreak, longestStreak, last14Days, dailyGoal } = streakData;

  const totalEntries = entries.length;
  const completedEntries = entries.filter((e) => e.completed !== false).length;

  // Distinct active dates
  const uniqueDates = new Set(entries.map((e) => e.date));
  const activeDaysCount = uniqueDates.size;

  // Difficulty counts
  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  for (const e of entries) {
    const diff = e.difficulty || 'Medium';
    if (diffCounts[diff] !== undefined) {
      diffCounts[diff]++;
    } else {
      diffCounts.Medium++;
    }
  }

  // Topic counts
  const topicCounts = {};
  for (const t of TOPICS) topicCounts[t] = 0;
  for (const e of entries) {
    const topic = e.topic || 'Arrays & Hashing';
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  }

  const sortedTopics = Object.entries(topicCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const avgPerDay = activeDaysCount > 0 ? (totalEntries / activeDaysCount).toFixed(1) : '0';

  return (
    <div className="view-container analytics-view">
      <div className="view-header-bar">
        <div>
          <h2 className="view-heading">Practice Analytics & Performance Graphs</h2>
          <p className="view-subheading">
            Deep dive into your DSA velocity, platform breakdown, and pattern mastery
          </p>
        </div>
      </div>

      {/* Top 4 KPI metric cards */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Active Streak</span>
          <span className="kpi-value highlight-orange">{currentStreak} <span className="kpi-unit">days</span></span>
          <span className="kpi-sub">Best: {longestStreak} days</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Total Solved</span>
          <span className="kpi-value highlight-green">{completedEntries}</span>
          <span className="kpi-sub">out of {totalEntries} logged</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Active Practice Days</span>
          <span className="kpi-value">{activeDaysCount} <span className="kpi-unit">days</span></span>
          <span className="kpi-sub">Avg {avgPerDay} problems / day</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Completion Ratio</span>
          <span className="kpi-value highlight-cyan">
            {totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0}%
          </span>
          <span className="kpi-sub">accuracy rate</span>
        </div>
      </div>

      {/* 1. Velocity Graph over time (Last 14 Days) */}
      <section className="analytics-chart-section">
        <DailyVelocityChart last14Days={last14Days} dailyGoal={dailyGoal} />
      </section>

      {/* 2. Platform & Difficulty Graphs Side-by-Side */}
      <div className="analytics-details-grid">
        {/* Platform breakdown */}
        <PlatformSummary entries={entries} />

        {/* Visual Difficulty Donut Graph */}
        <DifficultyDonutChart diffCounts={diffCounts} total={totalEntries} />
      </div>

      {/* 3. Pattern & Topic Mastery Distribution */}
      <section className="topics-mastery-card" aria-label="Pattern & Topic Mastery">
        <div className="section-header">
          <div>
            <h2 className="section-title">Algorithmic Patterns & Topics</h2>
            <p className="section-subtitle">Distribution of practiced data structures and techniques</p>
          </div>
        </div>

        {sortedTopics.length === 0 ? (
          <p className="platform-empty-text">No topic data logged yet. Assign topics when logging problems.</p>
        ) : (
          <div className="topics-chips-grid">
            {sortedTopics.map(([topic, count], idx) => {
              const pct = totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
              return (
                <div key={topic} className="topic-analytic-chip">
                  <div className="topic-top">
                    <span className="topic-title">
                      <span className="topic-rank">#{idx + 1}</span> {topic}
                    </span>
                    <span className="topic-badge-count">{count}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%`, backgroundColor: '#38bdf8' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
