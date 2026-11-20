import { describe, it, expect } from 'vitest';
import {
  calculateStreak,
  addDays,
  diffDays,
  getDayOfWeek,
  formatDateDisplay,
  MOTIVATION_MESSAGES,
  getMotivationMessage
} from './streak.js';

describe('Streak Calculation & Recovery Rules', () => {
  const BASE_TODAY = '2026-11-20';

  // 1. Empty data
  it('handles empty data correctly', () => {
    const result = calculateStreak([], { dailyGoal: 1, today: BASE_TODAY });

    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.todayCount).toBe(0);
    expect(result.todayCompleted).toBe(false);
    expect(result.isStreakAlive).toBe(false);
    expect(result.recoveryAvailable).toBe(false);
    expect(result.recoveredDates).toEqual([]);
    expect(result.stateKey).toBe('new_user');
    expect(result.last14Days).toHaveLength(14);
    expect(result.motivationMessage).toBeTruthy();
  });

  // 2. A simple streak
  it('calculates a simple 3-day streak ending today', () => {
    const entries = [
      { id: '1', problemName: 'Two Sum', platform: 'LeetCode', date: '2026-11-18' },
      { id: '2', problemName: 'Reverse Linked List', platform: 'LeetCode', date: '2026-11-19' },
      { id: '3', problemName: 'Valid Parentheses', platform: 'LeetCode', date: '2026-11-20' }
    ];

    const result = calculateStreak(entries, { dailyGoal: 1, today: BASE_TODAY });

    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
    expect(result.todayCount).toBe(1);
    expect(result.todayCompleted).toBe(true);
    expect(result.isStreakAlive).toBe(true);
    expect(result.recoveryAvailable).toBe(false);
    expect(result.stateKey).toBe('goal_met');
  });

  // 3. A streak alive but today not yet done
  it('keeps streak alive when yesterday was completed and today is not yet done', () => {
    const entries = [
      { id: '1', problemName: 'Problem 1', platform: 'LeetCode', date: '2026-11-18' },
      { id: '2', problemName: 'Problem 2', platform: 'LeetCode', date: '2026-11-19' }
      // nothing on 2026-11-20 (today)
    ];

    const result = calculateStreak(entries, { dailyGoal: 1, today: BASE_TODAY });

    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
    expect(result.todayCount).toBe(0);
    expect(result.todayCompleted).toBe(false);
    expect(result.isStreakAlive).toBe(true);
    expect(result.recoveryAvailable).toBe(false);
    expect(result.stateKey).toBe('alive_pending');
  });

  // 4. One missed day with successful recovery
  it('recovers streak when exactly one day was missed and dailyGoal + 2 is solved the next day', () => {
    // 2026-11-17: 1 problem (completed)
    // 2026-11-18: 1 problem (completed)
    // 2026-11-19: 0 problems (missed yesterday)
    // 2026-11-20: 3 problems (dailyGoal 1 + 2 = 3 on today)
    const entries = [
      { id: '1', problemName: 'P1', platform: 'LeetCode', date: '2026-11-17' },
      { id: '2', problemName: 'P2', platform: 'LeetCode', date: '2026-11-18' },
      { id: '3', problemName: 'P3', platform: 'LeetCode', date: '2026-11-20' },
      { id: '4', problemName: 'P4', platform: 'LeetCode', date: '2026-11-20' },
      { id: '5', problemName: 'P5', platform: 'LeetCode', date: '2026-11-20' }
    ];

    const result = calculateStreak(entries, { dailyGoal: 1, today: BASE_TODAY });

    // Both the missed day (19th) and today (20th) count, extending the 2-day streak to 4 days
    expect(result.currentStreak).toBe(4);
    expect(result.longestStreak).toBe(4);
    expect(result.todayCount).toBe(3);
    expect(result.todayCompleted).toBe(true);
    expect(result.recoveredDates).toContain('2026-11-19');
    expect(result.recoveryAvailable).toBe(false);
    expect(result.dayStatuses['2026-11-19']).toBe('recovered');
  });

  // 5. One missed day without recovery
  it('indicates recovery is available when yesterday was missed and today has not yet met recovery requirement', () => {
    // 2026-11-18: 1 problem (completed)
    // 2026-11-19: 0 problems (missed yesterday)
    // 2026-11-20 (today): 0 problems
    const entries = [
      { id: '1', problemName: 'P1', platform: 'LeetCode', date: '2026-11-18' }
    ];

    const result = calculateStreak(entries, { dailyGoal: 1, today: BASE_TODAY });

    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(1);
    expect(result.recoveryAvailable).toBe(true);
    expect(result.recoveryProblemsNeeded).toBe(3); // dailyGoal + 2 - 0
    expect(result.stateKey).toBe('broken_recovery_available');
    expect(result.dayStatuses['2026-11-19']).toBe('missed');
  });

  it('permanently breaks streak and starts fresh if the next day fails to recover', () => {
    // Past failure:
    // 2026-11-16: 1 problem
    // 2026-11-17: 0 problems (missed)
    // 2026-11-18: 1 problem (only 1 solved, needed 3 to recover; dailyGoal=1 met so starts new streak of 1)
    // 2026-11-19: 1 problem (streak = 2)
    // 2026-11-20 (today): 1 problem (streak = 3)
    const entries = [
      { id: '1', problemName: 'P1', platform: 'LeetCode', date: '2026-11-16' },
      { id: '2', problemName: 'P2', platform: 'LeetCode', date: '2026-11-18' },
      { id: '3', problemName: 'P3', platform: 'LeetCode', date: '2026-11-19' },
      { id: '4', problemName: 'P4', platform: 'LeetCode', date: '2026-11-20' }
    ];

    const result = calculateStreak(entries, { dailyGoal: 1, today: BASE_TODAY });

    expect(result.currentStreak).toBe(3); // 18, 19, 20
    expect(result.recoveredDates).not.toContain('2026-11-17');
    expect(result.dayStatuses['2026-11-17']).toBe('missed');
  });

  // 6. Two missed days resetting the streak
  it('resets streak to 0 when two consecutive days are missed and prevents recovery', () => {
    // 2026-11-16: 1 problem (completed)
    // 2026-11-17: 0 problems (missed)
    // 2026-11-18: 0 problems (missed)
    // 2026-11-19: 0 problems (missed)
    // 2026-11-20 (today): 0 problems
    const entries = [
      { id: '1', problemName: 'P1', platform: 'LeetCode', date: '2026-11-16' }
    ];

    const result = calculateStreak(entries, { dailyGoal: 1, today: BASE_TODAY });

    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(1);
    expect(result.recoveryAvailable).toBe(false);
    expect(result.stateKey).toBe('broken_no_recovery');
  });

  it('does not allow recovery after two consecutive missed days even if 3 problems are solved', () => {
    // 2026-11-16: 1 problem
    // 2026-11-17: 0 (missed day 1)
    // 2026-11-18: 0 (missed day 2)
    // 2026-11-19: 3 problems
    // 2026-11-20 (today): 1 problem
    const entries = [
      { id: '1', problemName: 'P1', platform: 'LeetCode', date: '2026-11-16' },
      { id: '2', problemName: 'P2', platform: 'LeetCode', date: '2026-11-19' },
      { id: '3', problemName: 'P3', platform: 'LeetCode', date: '2026-11-19' },
      { id: '4', problemName: 'P4', platform: 'LeetCode', date: '2026-11-19' },
      { id: '5', problemName: 'P5', platform: 'LeetCode', date: '2026-11-20' }
    ];

    const result = calculateStreak(entries, { dailyGoal: 1, today: BASE_TODAY });

    // Streak reset on 17/18, 19th starts new streak (1), 20th makes it 2
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
    expect(result.recoveredDates).toHaveLength(0);
  });

  // 7. A daily goal greater than 1
  it('correctly applies streak and recovery rules when dailyGoal > 1', () => {
    // dailyGoal = 2
    // Recovery requires dailyGoal + 2 = 4 problems
    // 2026-11-18: 2 problems (completed)
    // 2026-11-19: 1 problem (missed because 1 < 2)
    // 2026-11-20: 4 problems (recovered because 4 >= 2 + 2)
    const entries = [
      { id: '1', problemName: 'P1', platform: 'LeetCode', date: '2026-11-18' },
      { id: '2', problemName: 'P2', platform: 'LeetCode', date: '2026-11-18' },
      { id: '3', problemName: 'P3', platform: 'LeetCode', date: '2026-11-19' },
      { id: '4', problemName: 'P4', platform: 'LeetCode', date: '2026-11-20' },
      { id: '5', problemName: 'P5', platform: 'LeetCode', date: '2026-11-20' },
      { id: '6', problemName: 'P6', platform: 'LeetCode', date: '2026-11-20' },
      { id: '7', problemName: 'P7', platform: 'LeetCode', date: '2026-11-20' }
    ];

    const result = calculateStreak(entries, { dailyGoal: 2, today: BASE_TODAY });

    expect(result.currentStreak).toBe(3); // 18, 19 (recovered), 20 (completed)
    expect(result.longestStreak).toBe(3);
    expect(result.recoveredDates).toContain('2026-11-19');
    expect(result.todayCompleted).toBe(true);
  });

  it('milestone streaks trigger milestone message state', () => {
    // 7-day streak
    const entries = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(BASE_TODAY, -i);
      entries.push({ id: `m-${i}`, problemName: `P-${i}`, platform: 'LeetCode', date: d });
    }

    const result = calculateStreak(entries, { dailyGoal: 1, today: BASE_TODAY });
    expect(result.currentStreak).toBe(7);
    expect(result.stateKey).toBe('milestone');
  });

  it('motivation messages bank has at least 5 messages per state', () => {
    const requiredStates = [
      'new_user',
      'alive_pending',
      'goal_met',
      'broken_recovery_available',
      'broken_no_recovery',
      'milestone'
    ];

    for (const state of requiredStates) {
      expect(MOTIVATION_MESSAGES[state].length).toBeGreaterThanOrEqual(5);
      const msg = getMotivationMessage(state, { streak: 5, needed: 2, goal: 1 });
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(10);
    }
  });

  it('date utility helpers work accurately across boundaries', () => {
    expect(diffDays('2026-11-20', '2026-11-21')).toBe(1);
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(getDayOfWeek('2026-11-20', 'long')).toBe('Friday');
    expect(formatDateDisplay('2026-11-20')).toBe('Fri, 20 Nov 2026');
  });
});
