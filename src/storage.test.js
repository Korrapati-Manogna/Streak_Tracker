import { describe, it, expect, beforeEach } from 'vitest';
import {
  getEntries,
  addEntry,
  deleteEntry,
  setEntries,
  getSettings,
  saveSettings,
  clearAllData,
  loadDemoData,
  login,
  signup,
  logout,
  getCurrentUser,
  quickDemoLogin,
  toggleEntryCompleted
} from './storage.js';

describe('Storage Service', () => {
  beforeEach(() => {
    clearAllData();
    logout();
  });

  it('retrieves default empty entries', () => {
    expect(getEntries()).toEqual([]);
  });

  it('adds and retrieves entries with generated id and createdAt', () => {
    const entry = addEntry({
      problemName: 'Binary Search',
      platform: 'LeetCode',
      date: '2026-11-20',
      difficulty: 'Easy',
      topic: 'Binary Search'
    });

    expect(entry.id).toBeDefined();
    expect(entry.createdAt).toBeDefined();
    expect(entry.problemName).toBe('Binary Search');
    expect(entry.platform).toBe('LeetCode');
    expect(entry.date).toBe('2026-11-20');
    expect(entry.difficulty).toBe('Easy');
    expect(entry.completed).toBe(true);

    const all = getEntries();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(entry.id);
  });

  it('toggles problem completed status', () => {
    const entry = addEntry({
      problemName: 'LRU Cache',
      platform: 'LeetCode',
      date: '2026-11-20'
    });
    expect(entry.completed).toBe(true);

    toggleEntryCompleted(entry.id);
    let updated = getEntries().find((e) => e.id === entry.id);
    expect(updated.completed).toBe(false);

    toggleEntryCompleted(entry.id);
    updated = getEntries().find((e) => e.id === entry.id);
    expect(updated.completed).toBe(true);
  });

  it('deletes an entry by id', () => {
    const e1 = addEntry({ problemName: 'P1', platform: 'LeetCode', date: '2026-11-19' });
    const e2 = addEntry({ problemName: 'P2', platform: 'LeetCode', date: '2026-11-20' });

    expect(getEntries()).toHaveLength(2);
    deleteEntry(e1.id);

    const remaining = getEntries();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(e2.id);
  });

  it('handles settings retrieval and saving', () => {
    const initial = getSettings();
    expect(initial.dailyGoal).toBe(1);

    const saved = saveSettings({ dailyGoal: 3, devTodayOverride: '2026-11-25' });
    expect(saved.dailyGoal).toBe(3);
    expect(saved.devTodayOverride).toBe('2026-11-25');

    const retrieved = getSettings();
    expect(retrieved.dailyGoal).toBe(3);
    expect(retrieved.devTodayOverride).toBe('2026-11-25');
  });

  it('clears all data', () => {
    addEntry({ problemName: 'P1', platform: 'LeetCode', date: '2026-11-20' });
    saveSettings({ dailyGoal: 5 });

    clearAllData();
    expect(getEntries()).toEqual([]);
    expect(getSettings().dailyGoal).toBe(1);
  });

  it('sets entries directly', () => {
    setEntries([{ id: 'test-1', problemName: 'P1', platform: 'CodeChef', date: '2026-11-20' }]);
    expect(getEntries()).toHaveLength(1);
  });

  it('loads demo data with sample problems and recovery pattern', () => {
    const demo = loadDemoData('2026-11-20');
    expect(demo.length).toBeGreaterThan(5);
    const stored = getEntries();
    expect(stored.length).toBe(demo.length);
  });

  it('manages authentication: login, logout, and quick demo login', () => {
    expect(getCurrentUser()).toBeNull();

    // Quick demo login
    const demoRes = quickDemoLogin();
    expect(demoRes.success).toBe(true);
    expect(demoRes.user.username).toBe('alex');
    expect(getCurrentUser().username).toBe('alex');

    // Logout
    logout();
    expect(getCurrentUser()).toBeNull();

    // Signup new user
    const shortPassRes = signup({
      username: 'shortpass',
      password: 'p1',
      name: 'Short Pass'
    });
    expect(shortPassRes.success).toBe(false);
    expect(shortPassRes.error).toContain('8 characters');

    const signupRes = signup({
      username: 'johndoe',
      password: 'mypassword123',
      name: 'John Doe'
    });
    expect(signupRes.success).toBe(true);
    expect(signupRes.user.username).toBe('johndoe');
    expect(getCurrentUser().username).toBe('johndoe');

    // Failed login check
    logout();
    const failRes = login({ username: 'johndoe', password: 'wrongpassword' });
    expect(failRes.success).toBe(false);
  });
});
