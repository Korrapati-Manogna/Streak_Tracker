import React from 'react';
import { PLATFORMS } from '../streak.js';

const PLATFORM_COLORS = {
  LeetCode: '#ffa116',
  "Striver's Sheet": '#e056fd',
  GeeksforGeeks: '#2f9e44',
  HackerRank: '#00ea64',
  CodeChef: '#795548',
  Other: '#64748b'
};

export default function PlatformSummary({ entries = [] }) {
  const countsByPlatform = {};
  for (const p of PLATFORMS) {
    countsByPlatform[p] = 0;
  }

  for (const entry of entries) {
    const platform = PLATFORMS.includes(entry.platform) ? entry.platform : 'Other';
    countsByPlatform[platform] = (countsByPlatform[platform] || 0) + 1;
  }

  const total = entries.length;

  return (
    <section className="platform-summary-card" aria-label="Platform Summary">
      <div className="section-header">
        <div>
          <h2 className="section-title">Platform Breakdown</h2>
          <p className="section-subtitle">Distribution of DSA practice across platforms</p>
        </div>
        <span className="platform-total-tag">
          Total: <strong>{total}</strong>
        </span>
      </div>

      {total === 0 ? (
        <p className="platform-empty-text">No problems logged yet. Your platform statistics will appear here.</p>
      ) : (
        <div className="platform-bars-list">
          {PLATFORMS.map((platform) => {
            const count = countsByPlatform[platform];
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            const color = PLATFORM_COLORS[platform] || '#3b82f6';

            return (
              <div key={platform} className="platform-bar-row">
                <div className="platform-meta">
                  <span className="platform-name">
                    <span className="platform-dot" style={{ backgroundColor: color }} />
                    {platform}
                  </span>
                  <span className="platform-count">
                    <strong>{count}</strong> <span className="platform-percent">({percent}%)</span>
                  </span>
                </div>

                <div className="bar-track" aria-hidden="true">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
