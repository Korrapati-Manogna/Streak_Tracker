import React from 'react';
import { formatDateDisplay } from '../streak.js';

export default function StreakHeatmap({ last14Days }) {
  if (!last14Days || last14Days.length === 0) return null;

  return (
    <section className="heatmap-section" aria-label="14-Day Streak View">
      <div className="section-header">
        <div>
          <h2 className="section-title">Last 14 Days Activity</h2>
          <p className="section-subtitle">Visual timeline of completed, recovered, and pending days</p>
        </div>
      </div>

      <div className="heatmap-row-wrapper">
        <div className="heatmap-days-row">
          {last14Days.map((day) => {
            const isToday = day.isToday;
            const statusClass = `status-${day.status}`;
            const formatted = formatDateDisplay(day.date);

            let statusLabel = 'Missed';
            if (day.status === 'completed') statusLabel = 'Completed';
            if (day.status === 'recovered') statusLabel = 'Recovered';
            if (day.status === 'pending') statusLabel = 'Pending';
            if (day.status === 'none') statusLabel = 'Unstarted';

            return (
              <div
                key={day.date}
                className={`heatmap-day-tile ${statusClass} ${isToday ? 'is-today' : ''}`}
                title={`${formatted}: ${statusLabel} (${day.count} solved)`}
              >
                <span className="tile-dow">{day.dayOfWeek}</span>
                <span className="tile-daynum">{day.dayNum}</span>

                <div className="tile-indicator" aria-hidden="true">
                  {day.status === 'completed' && <span className="icon-completed">✓</span>}
                  {day.status === 'recovered' && <span className="icon-recovered">🛡️</span>}
                  {day.status === 'missed' && <span className="icon-missed">✕</span>}
                  {day.status === 'pending' && <span className="icon-pending">⋯</span>}
                  {day.status === 'none' && <span className="icon-none">•</span>}
                </div>

                <span className="tile-count">
                  {day.count > 0 ? `${day.count}` : '0'}
                </span>

                {isToday && <span className="today-chip">Today</span>}
                {day.status === 'recovered' && <span className="recovered-chip">Recovered</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="heatmap-legend" aria-label="Heatmap Legend">
        <div className="legend-item">
          <span className="legend-dot status-completed" />
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot status-recovered" />
          <span>Recovered (via +2 next day)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot status-pending" />
          <span>Pending Today</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot status-missed" />
          <span>Missed</span>
        </div>
      </div>
    </section>
  );
}
