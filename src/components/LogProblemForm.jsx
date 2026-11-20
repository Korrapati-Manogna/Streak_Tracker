import React, { useState } from 'react';
import { PLATFORMS, getDayOfWeek, formatDateDisplay } from '../streak.js';

export default function LogProblemForm({ onLogProblem, defaultDate }) {
  const [problemName, setProblemName] = useState('');
  const [platform, setPlatform] = useState('LeetCode');
  const [date, setDate] = useState(defaultDate);
  const [prevDefaultDate, setPrevDefaultDate] = useState(defaultDate);
  const [error, setError] = useState('');

  // Recommended React pattern: adjust state during render when prop changes
  if (prevDefaultDate !== defaultDate) {
    setPrevDefaultDate(defaultDate);
    setDate(defaultDate);
  }

  const dayOfWeek = getDayOfWeek(date, 'long');
  const formattedDisplay = formatDateDisplay(date);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problemName.trim()) {
      setError('Please enter a problem name.');
      return;
    }
    setError('');

    onLogProblem({
      problemName: problemName.trim(),
      platform,
      date
    });

    setProblemName('');
  };

  return (
    <section className="form-card" aria-label="Log DSA Problem">
      <div className="section-header">
        <div>
          <h2 className="section-title">Log a DSA Problem</h2>
          <p className="section-subtitle">Record your daily algorithm practice</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="log-form">
        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="form-group">
          <label htmlFor="problem-name" className="form-label">
            Problem Name <span className="required-star">*</span>
          </label>
          <input
            id="problem-name"
            type="text"
            className="form-input"
            placeholder="e.g. 3Sum, LRU Cache, Merge Intervals..."
            value={problemName}
            onChange={(e) => {
              setProblemName(e.target.value);
              if (error) setError('');
            }}
            autoComplete="off"
            required
          />
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="platform-select" className="form-label">Platform</label>
            <select
              id="platform-select"
              className="form-select"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <div className="label-with-dow">
              <label htmlFor="problem-date" className="form-label">Date</label>
              {dayOfWeek && (
                <span className="derived-dow-pill" title={`Derived Day: ${formattedDisplay}`}>
                  {dayOfWeek}
                </span>
              )}
            </div>
            <input
              id="problem-date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            + Log Problem
          </button>
        </div>
      </form>
    </section>
  );
}
