import React, { useState, useEffect } from 'react';
import { PLATFORMS, DIFFICULTIES, TOPICS, getDayOfWeek, formatDateDisplay } from '../streak.js';

export default function FastLogModal({
  isOpen,
  onClose,
  onLogProblem,
  defaultDate,
  initialTitle = '',
  entries = []
}) {
  const [problemName, setProblemName] = useState(initialTitle || '');
  const [platform, setPlatform] = useState('LeetCode');
  const [date, setDate] = useState(defaultDate);
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState('Arrays & Hashing');
  const [completed, setCompleted] = useState(true);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialTitle, setPrevInitialTitle] = useState(initialTitle);

  // Synchronize state during render when modal opens or initialTitle changes
  if (prevIsOpen !== isOpen || prevInitialTitle !== initialTitle) {
    setPrevIsOpen(isOpen);
    setPrevInitialTitle(initialTitle);
    if (isOpen) {
      setProblemName(initialTitle || '');
      setDate(defaultDate);
      setError('');
      setCompleted(true);
      setNotes('');
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dayOfWeek = getDayOfWeek(date, 'long');
  const formattedDisplay = formatDateDisplay(date);

  // Check whether the problem was previously solved
  const trimmedName = problemName.trim().toLowerCase();
  const previousMatch = trimmedName
    ? entries.find((e) => e.problemName.toLowerCase() === trimmedName)
    : null;

  const resetForm = () => {
    setProblemName('');
    setNotes('');
    setError('');
    setCompleted(true);
    setDate(defaultDate);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!problemName.trim()) {
      setError('Please provide a problem name.');
      return;
    }
    setError('');

    onLogProblem({
      problemName: problemName.trim(),
      platform,
      date,
      difficulty,
      topic,
      completed,
      notes: notes.trim()
    });

    resetForm();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="modal-icon">⚡</span>
            <h2 id="modal-title" className="modal-title">Log DSA Problem</h2>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="modal-error" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="fast-problem-name" className="form-label">
              Problem Title <span className="required-star">*</span>
            </label>
            <input
              id="fast-problem-name"
              type="text"
              className="form-input"
              placeholder="e.g. Trapping Rain Water, Course Schedule, 3Sum..."
              value={problemName}
              onChange={(e) => {
                setProblemName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              required
            />

            {/* Previously done or fresh indicator */}
            {trimmedName.length > 1 && (
              <div className={`previous-check-pill ${previousMatch ? 'check-done' : 'check-new'}`}>
                {previousMatch ? (
                  <span>
                    ✓ Previously done on {formatDateDisplay(previousMatch.date)} ({previousMatch.platform})
                  </span>
                ) : (
                  <span>
                    ✨ Fresh problem! Never logged previously
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="fast-platform" className="form-label">Platform</label>
              <select
                id="fast-platform"
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
                <label htmlFor="fast-date" className="form-label">Practice Date</label>
                {dayOfWeek && (
                  <span className="derived-dow-pill" title={`Derived Day: ${formattedDisplay}`}>
                    {dayOfWeek}
                  </span>
                )}
              </div>
              <input
                id="fast-date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="fast-difficulty" className="form-label">Difficulty</label>
              <select
                id="fast-difficulty"
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fast-topic" className="form-label">Topic / Pattern</label>
              <select
                id="fast-topic"
                className="form-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="custom-checkbox"
              />
              <span>
                <strong>Mark as Completed</strong> (Counts toward daily goal and streak)
              </span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="fast-notes" className="form-label">Notes / Time Complexity (Optional)</label>
            <input
              id="fast-notes"
              type="text"
              className="form-input"
              placeholder="e.g. O(N) time with monotonic stack, tricky edge case on zeros"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              + Save & Log Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
