/**
 * Storage service: all localStorage operations are isolated here.
 * Components must NEVER touch localStorage directly.
 */

import { toDateString, addDays } from './streak.js';

const STORAGE_KEYS = {
  ENTRIES: 'streak_tracker_entries',
  SETTINGS: 'streak_tracker_settings',
  USERS: 'streak_tracker_users',
  SESSION: 'streak_tracker_session'
};

const DEFAULT_SETTINGS = {
  dailyGoal: 1,
  devTodayOverride: '',
  userName: 'DSA Warrior',
  targetRole: 'Software Engineer',
  soundEnabled: true
};

const DEFAULT_USER = {
  id: 'demo-user-1',
  username: 'alex',
  password: 'password123',
  name: 'Alex Chen',
  avatar: '👨‍💻',
  role: 'Software Engineer Candidate'
};

// In-memory fallback if localStorage is unavailable
const memoryStorage = {
  _data: {},
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null;
  },
  setItem(key, value) {
    this._data[key] = String(value);
  },
  removeItem(key) {
    delete this._data[key];
  },
  clear() {
    this._data = {};
  }
};

function getStorageBackend() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage;
    }
  } catch {
    // Access denied in private mode or non-browser
  }
  return memoryStorage;
}

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function readStorage(key, defaultValue) {
  try {
    const storage = getStorageBackend();
    const raw = storage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading from storage key "${key}":`, err);
    return defaultValue;
  }
}

function writeStorage(key, value) {
  try {
    const storage = getStorageBackend();
    storage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing to storage key "${key}":`, err);
  }
}

// ----------------------------------------------------------------------
// Authentication
// ----------------------------------------------------------------------

/**
 * Get all registered users.
 * Seeds a default user if none exist.
 */
export function getUsers() {
  const users = readStorage(STORAGE_KEYS.USERS, null);
  if (!users || !Array.isArray(users) || users.length === 0) {
    writeStorage(STORAGE_KEYS.USERS, [DEFAULT_USER]);
    return [DEFAULT_USER];
  }
  return users;
}

/**
 * Get current session user, or null if logged out.
 */
export function getCurrentUser() {
  return readStorage(STORAGE_KEYS.SESSION, null);
}

/**
 * Log in with username and password.
 * @param {Object} credentials
 * @param {string} credentials.username
 * @param {string} credentials.password
 * @returns {{ success: boolean, user?: Object, error?: string }}
 */
export function login({ username, password }) {
  const users = getUsers();
  const found = users.find(
    (u) => u.username.toLowerCase() === (username || '').trim().toLowerCase()
  );

  if (!found) {
    return { success: false, error: 'User not found. Check username or create an account.' };
  }

  if (found.password !== (password || '').trim()) {
    return { success: false, error: 'Invalid password. Try again.' };
  }

  const sessionUser = {
    id: found.id,
    username: found.username,
    name: found.name,
    avatar: found.avatar || '👨‍💻',
    role: found.role || 'Problem Solver'
  };

  writeStorage(STORAGE_KEYS.SESSION, sessionUser);
  return { success: true, user: sessionUser };
}

/**
 * Sign up a new user account.
 * @param {Object} data
 * @param {string} data.username
 * @param {string} data.password
 * @param {string} data.name
 * @returns {{ success: boolean, user?: Object, error?: string }}
 */
export function signup({ username, password, name }) {
  const cleanUsername = (username || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();
  const cleanName = (name || '').trim();

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters long.' };
  }
  if (!cleanPassword || cleanPassword.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!/[a-zA-Z]/.test(cleanPassword) || !/[0-9]/.test(cleanPassword)) {
    return { success: false, error: 'Password must contain at least one letter and one number.' };
  }

  const users = getUsers();
  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: 'Username is already taken. Choose another.' };
  }

  const newUser = {
    id: generateId(),
    username: cleanUsername,
    password: cleanPassword,
    name: cleanName || cleanUsername,
    avatar: '🚀',
    role: 'Software Engineer'
  };

  const updatedUsers = [...users, newUser];
  writeStorage(STORAGE_KEYS.USERS, updatedUsers);

  const sessionUser = {
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
    avatar: newUser.avatar,
    role: newUser.role
  };
  writeStorage(STORAGE_KEYS.SESSION, sessionUser);

  return { success: true, user: sessionUser };
}

/**
 * Quick 1-click Demo login.
 */
export function quickDemoLogin() {
  return login({ username: 'alex', password: 'password123' });
}

/**
 * Log out current session.
 */
export function logout() {
  const storage = getStorageBackend();
  storage.removeItem(STORAGE_KEYS.SESSION);
}

// ----------------------------------------------------------------------
// Problem Entries
// ----------------------------------------------------------------------

/**
 * Retrieve all problem entries.
 * @returns {Array<{ id: string, problemName: string, platform: string, date: string, difficulty?: string, topic?: string, completed?: boolean, notes?: string, createdAt: string }>}
 */
export function getEntries() {
  const entries = readStorage(STORAGE_KEYS.ENTRIES, []);
  if (!Array.isArray(entries)) return [];
  return entries;
}

/**
 * Add a new problem entry.
 * @param {Object} param0
 * @param {string} param0.problemName
 * @param {string} param0.platform
 * @param {string} param0.date - YYYY-MM-DD
 * @param {string} [param0.difficulty='Medium']
 * @param {string} [param0.topic='General']
 * @param {boolean} [param0.completed=true]
 * @param {string} [param0.notes='']
 * @returns {Object} The created entry
 */
export function addEntry({
  problemName,
  platform,
  date,
  difficulty = 'Medium',
  topic = 'Arrays & Hashing',
  completed = true,
  notes = ''
}) {
  const entries = getEntries();
  const newEntry = {
    id: generateId(),
    problemName: (problemName || '').trim(),
    platform: (platform || 'LeetCode').trim(),
    date: date || toDateString(new Date()),
    difficulty: difficulty || 'Medium',
    topic: topic || 'General',
    completed: completed !== false,
    notes: (notes || '').trim(),
    createdAt: new Date().toISOString()
  };

  const updated = [newEntry, ...entries];
  writeStorage(STORAGE_KEYS.ENTRIES, updated);
  return newEntry;
}

/**
 * Update an existing problem entry.
 * @param {string} id
 * @param {Object} updates
 * @returns {Array} Updated entries
 */
export function updateEntry(id, updates = {}) {
  const entries = getEntries();
  const updated = entries.map((entry) => {
    if (entry.id === id) {
      return { ...entry, ...updates };
    }
    return entry;
  });
  writeStorage(STORAGE_KEYS.ENTRIES, updated);
  return updated;
}

/**
 * Toggle problem completed status.
 * @param {string} id
 * @returns {Array} Updated entries
 */
export function toggleEntryCompleted(id) {
  const entries = getEntries();
  const updated = entries.map((entry) => {
    if (entry.id === id) {
      return { ...entry, completed: !entry.completed };
    }
    return entry;
  });
  writeStorage(STORAGE_KEYS.ENTRIES, updated);
  return updated;
}

/**
 * Delete a problem entry by id.
 * @param {string} id
 * @returns {Array} Updated entries
 */
export function deleteEntry(id) {
  const entries = getEntries();
  const updated = entries.filter((entry) => entry.id !== id);
  writeStorage(STORAGE_KEYS.ENTRIES, updated);
  return updated;
}

/**
 * Replace all entries directly.
 * @param {Array} entries
 */
export function setEntries(entries) {
  writeStorage(STORAGE_KEYS.ENTRIES, Array.isArray(entries) ? entries : []);
}

// ----------------------------------------------------------------------
// Settings & Preferences
// ----------------------------------------------------------------------

/**
 * Retrieve user settings.
 * @returns {{ dailyGoal: number, devTodayOverride: string, userName: string, targetRole: string, soundEnabled: boolean }}
 */
export function getSettings() {
  const saved = readStorage(STORAGE_KEYS.SETTINGS, {});
  return {
    dailyGoal: Number.isInteger(saved.dailyGoal) && saved.dailyGoal > 0 ? saved.dailyGoal : DEFAULT_SETTINGS.dailyGoal,
    devTodayOverride: typeof saved.devTodayOverride === 'string' ? saved.devTodayOverride : DEFAULT_SETTINGS.devTodayOverride,
    userName: saved.userName || DEFAULT_SETTINGS.userName,
    targetRole: saved.targetRole || DEFAULT_SETTINGS.targetRole,
    soundEnabled: saved.soundEnabled !== false
  };
}

/**
 * Save user settings.
 * @param {Partial<{ dailyGoal: number, devTodayOverride: string, userName: string, targetRole: string, soundEnabled: boolean }>} newSettings
 * @returns {Object} Updated settings
 */
export function saveSettings(newSettings = {}) {
  const current = getSettings();
  const updated = {
    ...current,
    ...newSettings
  };

  if (updated.dailyGoal < 1) updated.dailyGoal = 1;
  writeStorage(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

/**
 * Export all data to JSON string.
 */
export function exportDataJSON() {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    entries: getEntries(),
    settings: getSettings()
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON string.
 * @param {string} jsonString
 * @returns {{ success: boolean, count?: number, error?: string }}
 */
export function importDataJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data || !Array.isArray(data.entries)) {
      return { success: false, error: 'Invalid data format. "entries" array required.' };
    }
    setEntries(data.entries);
    if (data.settings) {
      saveSettings(data.settings);
    }
    return { success: true, count: data.entries.length };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to parse JSON file.' };
  }
}

/**
 * Clear all entries and reset settings.
 */
export function clearAllData() {
  const storage = getStorageBackend();
  storage.removeItem(STORAGE_KEYS.ENTRIES);
  storage.removeItem(STORAGE_KEYS.SETTINGS);
}

/**
 * Load 10 days of sample demo entries demonstrating:
 * - A 10-day span with past consecutive days
 * - Exactly ONE missed day (at T - 6)
 * - Successful recovery on T - 5 with 3 problems (dailyGoal + 2)
 * - Continued streak through today
 * @param {string} [referenceDate] - YYYY-MM-DD
 * @returns {Array} The demo entries created
 */
export function loadDemoData(referenceDate) {
  const today = referenceDate || toDateString(new Date());

  const samplePlan = [
    { offset: -9, name: 'Two Sum', platform: 'LeetCode', difficulty: 'Easy', topic: 'Arrays & Hashing' },
    { offset: -8, name: 'Valid Parentheses', platform: 'LeetCode', difficulty: 'Easy', topic: 'Stack' },
    { offset: -7, name: "Kadane's Algorithm", platform: "Striver's Sheet", difficulty: 'Medium', topic: 'Arrays & Hashing' },
    // offset: -6 is MISSED! (0 problems logged)
    // offset: -5 is RECOVERY DAY! (3 problems: dailyGoal + 2)
    { offset: -5, name: 'Trapping Rain Water', platform: 'LeetCode', difficulty: 'Hard', topic: 'Two Pointers' },
    { offset: -5, name: 'Longest Substring Without Repeating Characters', platform: 'LeetCode', difficulty: 'Medium', topic: 'Sliding Window' },
    { offset: -5, name: 'Merge Two Sorted Lists', platform: "Striver's Sheet", difficulty: 'Easy', topic: 'Linked List' },
    { offset: -4, name: 'Detect Cycle in Linked List', platform: 'GeeksforGeeks', difficulty: 'Medium', topic: 'Linked List' },
    { offset: -3, name: 'Binary Tree Level Order Traversal', platform: 'LeetCode', difficulty: 'Medium', topic: 'Trees' },
    { offset: -3, name: 'Climbing Stairs', platform: 'CodeChef', difficulty: 'Easy', topic: 'Dynamic Programming' },
    { offset: -2, name: 'Search in Rotated Sorted Array', platform: 'LeetCode', difficulty: 'Medium', topic: 'Binary Search' },
    { offset: -1, name: 'LRU Cache', platform: 'LeetCode', difficulty: 'Medium', topic: 'Design & Linked List' },
    { offset: 0, name: 'Median of Two Sorted Arrays', platform: 'HackerRank', difficulty: 'Hard', topic: 'Binary Search' }
  ];

  const demoEntries = samplePlan.map((item, idx) => ({
    id: `demo-${idx + 1}-${Date.now()}`,
    problemName: item.name,
    platform: item.platform,
    date: addDays(today, item.offset),
    difficulty: item.difficulty,
    topic: item.topic,
    completed: true,
    notes: 'Sample solved problem demonstrating active streak flow.',
    createdAt: new Date(Date.now() - (9 - idx) * 3600000).toISOString()
  }));

  setEntries(demoEntries);
  return demoEntries;
}
