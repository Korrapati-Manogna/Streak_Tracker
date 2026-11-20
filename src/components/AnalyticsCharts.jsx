import React, { useState } from 'react';
import { formatDateDisplay } from '../streak.js';

export function DailyVelocityChart({ last14Days = [], dailyGoal = 1 }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  if (!last14Days || last14Days.length === 0) return null;

  const maxVal = Math.max(dailyGoal + 2, ...last14Days.map((d) => d.count), 4);
  const chartHeight = 160;
  const chartWidth = 580;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 30;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const barSlotWidth = innerWidth / last14Days.length;
  const barWidth = Math.max(12, barSlotWidth * 0.65);

  const goalY = paddingTop + innerHeight - (dailyGoal / maxVal) * innerHeight;

  return (
    <div className="velocity-chart-wrapper">
      <div className="chart-header-row">
        <div>
          <h3 className="chart-title">Daily Practice Velocity (Last 14 Days)</h3>
          <p className="chart-subtitle">Bar height indicates problems solved each day against your daily goal</p>
        </div>
        <div className="chart-legend-row">
          <span className="legend-chip-goal">
            <span className="dash-line" /> Daily Goal ({dailyGoal})
          </span>
          <span className="legend-chip-completed">
            <span className="box-color bg-green" /> Goal Met
          </span>
          <span className="legend-chip-recovered">
            <span className="box-color bg-purple" /> Recovered (+2)
          </span>
          <span className="legend-chip-pending">
            <span className="box-color bg-blue" /> Today
          </span>
        </div>
      </div>

      <div className="svg-container">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="velocity-svg"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Daily Practice Velocity Chart"
        >
          {/* Background grid lines */}
          {[0, Math.round(maxVal / 2), maxVal].map((val, idx) => {
            const y = paddingTop + innerHeight - (val / maxVal) * innerHeight;
            return (
              <g key={idx} className="grid-line-group">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="axis-label"
                  fontSize="9"
                  fill="#64748b"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Daily Goal reference line */}
          <g className="goal-reference-group">
            <line
              x1={paddingLeft}
              y1={goalY}
              x2={chartWidth - paddingRight}
              y2={goalY}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={chartWidth - paddingRight}
              y={goalY - 5}
              textAnchor="end"
              fill="#f59e0b"
              fontSize="9"
              fontWeight="bold"
            >
              Target: {dailyGoal}
            </text>
          </g>

          {/* Daily Bars */}
          {last14Days.map((day, idx) => {
            const x = paddingLeft + idx * barSlotWidth + (barSlotWidth - barWidth) / 2;
            const barH = day.count > 0 ? (day.count / maxVal) * innerHeight : 3;
            const y = paddingTop + innerHeight - barH;

            let fillColor = '#334155'; // default zero / none
            if (day.status === 'completed') fillColor = '#10b981';
            else if (day.status === 'recovered') fillColor = '#8b5cf6';
            else if (day.status === 'pending') fillColor = '#38bdf8';
            else if (day.status === 'missed') fillColor = '#ef4444';

            const isHovered = hoveredDay === day.date;

            return (
              <g
                key={day.date}
                className="bar-group"
                onMouseEnter={() => setHoveredDay(day.date)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Bar rect */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="3"
                  fill={fillColor}
                  opacity={isHovered ? 1 : 0.88}
                  filter={isHovered ? 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.4))' : undefined}
                />

                {/* Problem count label on top of bar */}
                {day.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {day.count}
                  </text>
                )}

                {/* Day of week & date at bottom */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  fill={day.isToday ? '#38bdf8' : '#94a3b8'}
                  fontSize="8.5"
                  fontWeight={day.isToday ? 'bold' : 'normal'}
                >
                  {day.dayOfWeek}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 2}
                  textAnchor="middle"
                  fill={day.isToday ? '#38bdf8' : '#64748b'}
                  fontSize="7.5"
                >
                  {day.dayNum}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover inspection pill */}
        {hoveredDay && (() => {
          const target = last14Days.find((d) => d.date === hoveredDay);
          if (!target) return null;
          return (
            <div className="chart-tooltip-badge">
              <strong>{formatDateDisplay(target.date)}</strong>
              <span>
                {target.count} {target.count === 1 ? 'problem solved' : 'problems solved'} · Status:{' '}
                <span className={`status-badge-text text-${target.status}`}>
                  {target.status.toUpperCase()}
                </span>
              </span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export function DifficultyDonutChart({ diffCounts, total }) {
  const easy = diffCounts.Easy || 0;
  const medium = diffCounts.Medium || 0;
  const hard = diffCounts.Hard || 0;

  const easyPct = total > 0 ? (easy / total) * 100 : 0;
  const medPct = total > 0 ? (medium / total) * 100 : 0;
  const hardPct = total > 0 ? (hard / total) * 100 : 0;

  // Donut geometry (radius = 42, circumference = 2 * pi * 42 = 263.89)
  const c = 263.89;
  const easyOffset = 0;
  const medOffset = (easyPct / 100) * c;
  const hardOffset = ((easyPct + medPct) / 100) * c;

  return (
    <div className="donut-chart-card">
      <h3 className="chart-title">Difficulty Composition</h3>
      <p className="chart-subtitle">Distribution across Easy, Medium, and Hard challenges</p>

      <div className="donut-body">
        <div className="donut-svg-wrap">
          <svg viewBox="0 0 110 110" className="donut-svg">
            <circle cx="55" cy="55" r="42" fill="none" stroke="#1e293b" strokeWidth="14" />

            {total > 0 && (
              <>
                {/* Easy segment */}
                <circle
                  cx="55"
                  cy="55"
                  r="42"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray={`${(easyPct / 100) * c} ${c}`}
                  strokeDashoffset={-easyOffset}
                  transform="rotate(-90 55 55)"
                />
                {/* Medium segment */}
                <circle
                  cx="55"
                  cy="55"
                  r="42"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="14"
                  strokeDasharray={`${(medPct / 100) * c} ${c}`}
                  strokeDashoffset={-medOffset}
                  transform="rotate(-90 55 55)"
                />
                {/* Hard segment */}
                <circle
                  cx="55"
                  cy="55"
                  r="42"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="14"
                  strokeDasharray={`${(hardPct / 100) * c} ${c}`}
                  strokeDashoffset={-hardOffset}
                  transform="rotate(-90 55 55)"
                />
              </>
            )}
          </svg>

          <div className="donut-center-label">
            <span className="donut-number">{total}</span>
            <span className="donut-sub">Total</span>
          </div>
        </div>

        <div className="donut-legend-stack">
          <div className="donut-legend-item">
            <span className="dot bg-green" />
            <span className="legend-label">Easy</span>
            <span className="legend-val">{easy} ({Math.round(easyPct)}%)</span>
          </div>
          <div className="donut-legend-item">
            <span className="dot bg-yellow" />
            <span className="legend-label">Medium</span>
            <span className="legend-val">{medium} ({Math.round(medPct)}%)</span>
          </div>
          <div className="donut-legend-item">
            <span className="dot bg-red" />
            <span className="legend-label">Hard</span>
            <span className="legend-val">{hard} ({Math.round(hardPct)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
