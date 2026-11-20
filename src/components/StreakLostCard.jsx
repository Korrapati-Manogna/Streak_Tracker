import React, { useState } from 'react';

const COMEBACK_QUOTES = [
  {
    quote: "A streak is just a counter; the algorithmic intuition you built stays with you forever.",
    author: "Consistency Mindset"
  },
  {
    quote: "The master has failed more times than the beginner has even tried. Today is Day 1 of your best run yet.",
    author: "Stephen McCranie"
  },
  {
    quote: "Success isn't about never breaking a habit; it's about how quickly you restart.",
    author: "James Clear, Atomic Habits"
  },
  {
    quote: "Every grandmaster, FAANG engineer, and competitive programmer has had streaks broken. What defines you is the comeback.",
    author: "DSA Wisdom"
  }
];

export default function StreakLostCard({ onOpenFastLog, currentStreak, entriesCount }) {
  const [quote] = useState(() => COMEBACK_QUOTES[Math.floor(Math.random() * COMEBACK_QUOTES.length)]);

  // Show only when user has logged problems in the past but current streak is 0
  if (currentStreak > 0 || entriesCount === 0) return null;

  return (
    <div className="streak-lost-card" role="region" aria-label="Comeback Motivation">
      <div className="lost-header">
        <span className="lost-icon">🌱</span>
        <div>
          <h3 className="lost-title">Streak Lost? Start Your Comeback Today</h3>
          <p className="lost-sub">Don't let a reset slow down your algorithm mastery</p>
        </div>
      </div>

      <blockquote className="lost-quote">
        <p>"{quote.quote}"</p>
        <cite>— {quote.author}</cite>
      </blockquote>

      <div className="lost-principles">
        <div className="principle">
          <span className="principle-num">1</span>
          <div>
            <strong>Retain the Knowledge</strong>
            <p>Every problem you solved before still counts in your neural network.</p>
          </div>
        </div>
        <div className="principle">
          <span className="principle-num">2</span>
          <div>
            <strong>Re-ignite Day 1</strong>
            <p>Solve just 1 problem today to launch your next record-breaking streak.</p>
          </div>
        </div>
      </div>

      <div className="lost-actions">
        <button
          type="button"
          className="btn-restart-streak"
          onClick={onOpenFastLog}
        >
          🚀 Log Problem #1 & Reignite Streak
        </button>
      </div>
    </div>
  );
}
