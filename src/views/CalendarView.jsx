import React, { useState } from 'react';
import StreakHeatmap from '../components/StreakHeatmap.jsx';
import { parseDate, toDateString, formatDateDisplay, getDayOfWeek } from '../streak.js';

export default function CalendarView({
  last14Days,
  entries,
  recoveredDates = [],
  dailyGoal = 1,
  effectiveToday
}) {
  const [selectedDate, setSelectedDate] = useState(effectiveToday);

  // Group entries by date
  const countsByDate = {};
  const entriesByDate = {};
  for (const e of entries) {
    if (!entriesByDate[e.date]) {
      entriesByDate[e.date] = [];
    }
    entriesByDate[e.date].push(e);
    if (e.completed !== false) {
      countsByDate[e.date] = (countsByDate[e.date] || 0) + 1;
    }
  }

  const recoveredSet = new Set(recoveredDates);

  // Build current month calendar
  const todayDateObj = parseDate(effectiveToday);
  const year = todayDateObj.getFullYear();
  const month = todayDateObj.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  const monthName = firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const calendarDays = [];
  // Pad preceding blanks
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push({ blank: true, key: `blank-${i}` });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const dateStr = toDateString(curDate);
    const count = countsByDate[dateStr] || 0;
    const isToday = dateStr === effectiveToday;
    const isRecovered = recoveredSet.has(dateStr);
    const isCompleted = count >= dailyGoal;
    const isFuture = dateStr > effectiveToday;

    let status = 'none';
    if (isRecovered) status = 'recovered';
    else if (isCompleted) status = 'completed';
    else if (isToday) status = count >= dailyGoal ? 'completed' : 'pending';
    else if (!isFuture && count > 0) status = 'partial';
    else if (!isFuture && count === 0) status = 'missed';

    calendarDays.push({
      blank: false,
      dateStr,
      dayNum: d,
      count,
      status,
      isToday,
      isRecovered,
      isCompleted,
      isFuture,
      key: dateStr
    });
  }

  const selectedEntries = entriesByDate[selectedDate] || [];
  const isSelectedRecovered = recoveredSet.has(selectedDate);
  const selectedCount = selectedEntries.filter((e) => e.completed !== false).length;

  return (
    <div className="view-container calendar-view">
      <div className="view-header-bar">
        <div>
          <h2 className="view-heading">Calendar & Activity Heatmap</h2>
          <p className="view-subheading">
            Track daily practice consistency across 14-day and monthly views
          </p>
        </div>
      </div>

      {/* 14-day Heatmap */}
      <StreakHeatmap last14Days={last14Days} />

      {/* Monthly Grid View */}
      <section className="month-calendar-card" aria-label="Monthly Calendar View">
        <div className="month-header">
          <h3 className="month-title">📅 {monthName}</h3>
          <span className="month-legend-inline">
            <span className="dot dot-completed" /> Met Goal
            <span className="dot dot-recovered" /> Recovered (+2)
            <span className="dot dot-pending" /> Pending
            <span className="dot dot-missed" /> Missed
          </span>
        </div>

        <div className="month-grid-wrapper">
          <div className="month-weekdays-header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
              <span key={w} className="weekday-header-cell">{w}</span>
            ))}
          </div>

          <div className="month-grid">
            {calendarDays.map((cell) => {
              if (cell.blank) {
                return <div key={cell.key} className="calendar-cell cell-blank" />;
              }

              const isSelected = selectedDate === cell.dateStr;
              return (
                <div
                  key={cell.key}
                  className={`calendar-cell cell-${cell.status} ${cell.isToday ? 'cell-today' : ''} ${isSelected ? 'cell-selected' : ''}`}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  title={`${cell.dateStr}: ${cell.count} solved (${cell.status})`}
                >
                  <span className="cell-daynum">{cell.dayNum}</span>
                  <div className="cell-indicator-badge">
                    {cell.status === 'completed' && <span className="cell-icon">✓</span>}
                    {cell.status === 'recovered' && <span className="cell-icon">🛡️</span>}
                    {cell.status === 'pending' && <span className="cell-icon">⋯</span>}
                    {cell.status === 'missed' && <span className="cell-icon">✕</span>}
                  </div>
                  {cell.count > 0 && <span className="cell-count-tag">{cell.count}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspection Drawer */}
        <div className="day-inspector-card">
          <div className="inspector-header">
            <div>
              <h4>Details for {formatDateDisplay(selectedDate)}</h4>
              <span className="inspector-sub">
                {getDayOfWeek(selectedDate, 'long')} · {selectedCount} of {dailyGoal} completed
              </span>
            </div>
            {isSelectedRecovered && (
              <span className="badge-recovered-history">🛡️ Recovered Day</span>
            )}
          </div>

          {selectedEntries.length === 0 ? (
            <p className="inspector-empty">
              {isSelectedRecovered
                ? '0 problems logged directly on this date. Recovered via streak bonus on next day.'
                : 'No problems were logged on this date.'}
            </p>
          ) : (
            <div className="inspector-items-list">
              {selectedEntries.map((e) => (
                <div key={e.id} className="inspector-item">
                  <div className="inspector-item-meta">
                    <span className="inspector-item-name">{e.problemName}</span>
                    <span className="platform-pill">{e.platform}</span>
                    {e.difficulty && <span className="diff-pill">{e.difficulty}</span>}
                    {e.topic && <span className="topic-pill">{e.topic}</span>}
                  </div>
                  <span className="inspector-status-badge">
                    {e.completed !== false ? '✓ Completed' : '○ In-Progress'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
