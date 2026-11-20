/**
 * Pure functions for streak calculations and motivation messages.
 * No React dependencies.
 */

export const PLATFORMS = [
  'LeetCode',
  "Striver's Sheet",
  'GeeksforGeeks',
  'HackerRank',
  'CodeChef',
  'Other'
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const TOPICS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Bit Manipulation',
  'Math & Geometry'
];

/**
 * Format Date object to "YYYY-MM-DD" local date string.
 * @param {Date} date
 * @returns {string}
 */
export function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse "YYYY-MM-DD" into a local Date object.
 * @param {string} dateStr
 * @returns {Date}
 */
export function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Add or subtract days from a "YYYY-MM-DD" string.
 * @param {string} dateStr
 * @param {number} days
 * @returns {string}
 */
export function addDays(dateStr, days) {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

/**
 * Get difference in days between two date strings (b - a).
 * @param {string} dateStrA
 * @param {string} dateStrB
 * @returns {number}
 */
export function diffDays(dateStrA, dateStrB) {
  const a = parseDate(dateStrA);
  const b = parseDate(dateStrB);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get the day of the week from a "YYYY-MM-DD" string.
 * @param {string} dateStr
 * @param {'short'|'long'} [format='long']
 * @returns {string}
 */
export function getDayOfWeek(dateStr, format = 'long') {
  if (!dateStr) return '';
  const date = parseDate(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { weekday: format });
}

/**
 * Format a date string to "Mon, 17 Nov 2026".
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const date = parseDate(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

/**
 * Motivation message bank with at least 6 messages per state.
 */
export const MOTIVATION_MESSAGES = {
  new_user: [
    'Welcome to Streak Tracker! Log your first DSA problem today to begin your streak journey.',
    'The best time to start was yesterday; the second best time is today. Log problem #1!',
    'Every algorithm master started with a single problem. Solve one today to start your streak!',
    'Ready to level up your problem-solving skills? Add your first DSA problem to get started.',
    'A 100-day streak begins with a single commit. Log your first problem now!',
    'Welcome! Choose a problem on LeetCode, Striver\'s Sheet, or any platform and kick off Day 1.'
  ],
  alive_pending: [
    'Keep the momentum going! Solve {needed} problem{s} today to keep your {streak}-day streak alive.',
    'Your {streak}-day streak is waiting on you! Knock out {needed} problem{s} before midnight.',
    'Don\'t let your {streak}-day streak slip away! Complete {needed} problem{s} today.',
    'You\'re on a roll with a {streak}-day streak! Solve {needed} problem{s} today to reach {nextStreak}.',
    'Consistency is king. Tackle {needed} DSA problem{s} today to protect your {streak}-day streak.',
    'You\'ve worked hard for this {streak}-day streak. Just {needed} problem{s} needed today!'
  ],
  goal_met: [
    'Daily goal accomplished! You\'ve locked in your {streak}-day streak for today. Outstanding work!',
    'Goal crushed today! Your {streak}-day streak is safe and sound.',
    'Great job hitting your DSA target today! Rest up or keep solving for extra practice.',
    'Streak secured! You\'ve completed today\'s daily goal. Keep this incredible consistency going.',
    'Today\'s goal is done! Another day, another step closer to mastering DSA.',
    'Awesome discipline! Today\'s goal is officially conquered. See you tomorrow!'
  ],
  broken_recovery_available: [
    'Streak broken yesterday, but recovery is available! Solve {needed} problems today ({goal} goal + 2 recovery) to recover your streak.',
    'You missed yesterday, but don\'t panic! Solve {needed} problems today to restore your streak.',
    'One day missed doesn\'t mean game over. Log {needed} problems today to recover your streak and keep moving forward!',
    'Recovery protocol active: solve {needed} problems today to rescue your streak!',
    'Second chance unlocked! Complete {needed} problems today to recover yesterday\'s missed day.',
    'Yesterday slipped by, but you can bounce back! Solve {needed} problems today to erase the break and restore your streak.'
  ],
  broken_no_recovery: [
    'Streaks reset, but your skills don\'t. Start a brand new streak today with your next problem!',
    'Don\'t be discouraged by a broken streak. The best problem solvers rebuild and come back stronger.',
    'A fresh start is a new opportunity. Log a problem today and begin your next big streak!',
    'Consistency isn\'t about never failing; it\'s about getting back up. Start Day 1 of your comeback streak right now!',
    'Reset the counter, keep the knowledge. Solve a problem today to ignite a new streak!',
    'Every grandmaster has had streaks reset. Start fresh today and aim for a new personal best!'
  ],
  milestone: [
    'Incredible milestone! You\'ve reached a {streak}-day streak! That is true elite dedication.',
    'Milestone achieved: {streak} consecutive days of DSA practice! You are building unstoppable habits.',
    '{streak}-Day Streak Milestone! Your dedication to DSA mastery is truly inspiring.',
    'Phenomenal achievement! Reaching {streak} days proves your consistency and growth mindset.',
    'HUGE milestone unlocked: {streak} days strong! Take a moment to celebrate this amazing run.',
    '{streak} days and counting! You are proving what daily discipline looks like.'
  ]
};

/**
 * Pick a random motivation message for a state and interpolate values.
 * @param {string} stateKey
 * @param {Object} values
 * @param {number} [forcedIndex] - Optional index for deterministic testing
 * @returns {string}
 */
export function getMotivationMessage(stateKey, values = {}, forcedIndex = null) {
  const bank = MOTIVATION_MESSAGES[stateKey] || MOTIVATION_MESSAGES.new_user;
  const index = forcedIndex !== null && forcedIndex >= 0 && forcedIndex < bank.length
    ? forcedIndex
    : Math.floor(Math.random() * bank.length);
  const template = bank[index];

  const needed = values.needed !== undefined ? values.needed : 1;
  const streak = values.streak !== undefined ? values.streak : 0;
  const nextStreak = streak + 1;
  const goal = values.goal !== undefined ? values.goal : 1;
  const s = needed === 1 ? '' : 's';

  return template
    .replace(/{needed}/g, String(needed))
    .replace(/{streak}/g, String(streak))
    .replace(/{nextStreak}/g, String(nextStreak))
    .replace(/{goal}/g, String(goal))
    .replace(/{s}/g, s);
}

/**
 * Aggregate entries by date (counting only completed problems).
 * @param {Array} entries
 * @returns {Record<string, number>}
 */
export function getCountsByDate(entries) {
  const counts = {};
  if (!Array.isArray(entries)) return counts;
  for (const entry of entries) {
    if (entry && entry.date && entry.completed !== false) {
      counts[entry.date] = (counts[entry.date] || 0) + 1;
    }
  }
  return counts;
}

/**
 * Main pure function to compute streak and daily statuses.
 * 
 * Rules implemented:
 * - A day is "completed" if problem count >= dailyGoal.
 * - The current streak is the number of consecutive completed days ending today or yesterday.
 *   If today is not yet completed, the streak is still alive as long as yesterday was completed.
 * - Recovery rule: if exactly ONE day was missed, the streak can be recovered on the next day
 *   by solving dailyGoal + 2 problems that day. When that happens, the missed day counts as "recovered"
 *   and the streak continues across it.
 * - If two or more consecutive days are missed, recovery is not possible and the streak resets to 0.
 * - Recovered days count toward the streak length.
 * 
 * @param {Array} entries - List of Entry objects { id, problemName, platform, date, createdAt }
 * @param {Object} [options]
 * @param {number} [options.dailyGoal=1]
 * @param {string} [options.today] - Optional override date "YYYY-MM-DD"
 * @returns {Object}
 */
export function calculateStreak(entries = [], options = {}) {
  const dailyGoal = Number.isInteger(options.dailyGoal) && options.dailyGoal > 0 ? options.dailyGoal : 1;
  const today = options.today || toDateString(new Date());
  const counts = getCountsByDate(entries);
  const todayCount = counts[today] || 0;
  const todayCompleted = todayCount >= dailyGoal;

  if (!entries || entries.length === 0) {
    // Generate empty last 14 days
    const last14Days = [];
    for (let i = 13; i >= 0; i--) {
      const d = addDays(today, -i);
      last14Days.push({
        date: d,
        dayOfWeek: getDayOfWeek(d, 'short'),
        dayNum: parseDate(d).getDate(),
        count: 0,
        status: d === today ? 'pending' : 'none',
        isToday: d === today
      });
    }

    return {
      currentStreak: 0,
      longestStreak: 0,
      todayCount: 0,
      dailyGoal,
      todayCompleted: false,
      isStreakAlive: false,
      recoveryAvailable: false,
      recoveryPossibleCount: dailyGoal + 2,
      recoveryProblemsNeeded: dailyGoal + 2,
      recoveredDates: [],
      dayStatuses: {},
      last14Days,
      stateKey: 'new_user',
      motivationMessage: getMotivationMessage('new_user', { goal: dailyGoal, needed: dailyGoal })
    };
  }

  // Determine chronological start date
  const entryDates = Object.keys(counts).sort();
  const earliestEntryDate = entryDates[0];
  const startDate = earliestEntryDate < today ? earliestEntryDate : today;
  // End date is max(latest entry, today)
  const latestEntryDate = entryDates[entryDates.length - 1];
  const endDate = latestEntryDate > today ? latestEntryDate : today;

  const totalDays = diffDays(startDate, endDate) + 1;
  const dayStatuses = {};
  const recoveredDates = [];

  let currentStreakChain = 0;
  let longestStreak = 0;
  let missedYesterday = false;
  let missedDate = null;
  let streakBeforeMissed = 0;
  let recoveryAvailable = false;
  let recoveryProblemsNeeded = 0;

  for (let i = 0; i < totalDays; i++) {
    const d = addDays(startDate, i);
    const count = counts[d] || 0;
    const isDayToday = d === today;
    const isPastDay = d < today;

    if (isPastDay) {
      if (missedYesterday) {
        // We had exactly 1 missed day (missedDate). Can day d recover it?
        if (count >= dailyGoal + 2) {
          // Recovered!
          dayStatuses[missedDate] = 'recovered';
          recoveredDates.push(missedDate);
          dayStatuses[d] = 'completed';
          currentStreakChain = streakBeforeMissed + 2; // both missed day and recovery day count
          longestStreak = Math.max(longestStreak, currentStreakChain);
          missedYesterday = false;
          missedDate = null;
          streakBeforeMissed = 0;
        } else {
          // Missed day was NOT recovered.
          dayStatuses[missedDate] = 'missed';
          missedYesterday = false;
          missedDate = null;
          streakBeforeMissed = 0;
          currentStreakChain = 0; // streak broken

          // Evaluate day d on its own
          if (count >= dailyGoal) {
            dayStatuses[d] = 'completed';
            currentStreakChain = 1;
            longestStreak = Math.max(longestStreak, currentStreakChain);
          } else {
            dayStatuses[d] = 'missed';
            currentStreakChain = 0;
          }
        }
      } else {
        // No pending missed day
        if (count >= dailyGoal) {
          dayStatuses[d] = 'completed';
          currentStreakChain += 1;
          longestStreak = Math.max(longestStreak, currentStreakChain);
        } else {
          if (currentStreakChain > 0) {
            // Exactly ONE day missed so far
            missedYesterday = true;
            missedDate = d;
            streakBeforeMissed = currentStreakChain;
            currentStreakChain = 0;
            dayStatuses[d] = 'missed'; // tentative until next day
          } else {
            // Already 0, another missed day
            dayStatuses[d] = 'missed';
          }
        }
      }
    } else if (isDayToday) {
      if (missedYesterday) {
        // Yesterday (today - 1) was missed, streakBeforeMissed > 0.
        // Today is the recovery window!
        if (count >= dailyGoal + 2) {
          // Recovery successful today!
          dayStatuses[missedDate] = 'recovered';
          recoveredDates.push(missedDate);
          dayStatuses[d] = 'completed';
          currentStreakChain = streakBeforeMissed + 2;
          longestStreak = Math.max(longestStreak, currentStreakChain);
          missedYesterday = false;
          missedDate = null;
          streakBeforeMissed = 0;
          recoveryAvailable = false;
        } else {
          // Not yet recovered today, but recovery IS available today!
          dayStatuses[missedDate] = 'missed';
          dayStatuses[d] = 'pending';
          recoveryAvailable = true;
          recoveryProblemsNeeded = (dailyGoal + 2) - count;
          currentStreakChain = 0;
        }
      } else {
        // Yesterday was NOT missed
        if (count >= dailyGoal) {
          dayStatuses[d] = 'completed';
          currentStreakChain += 1;
          longestStreak = Math.max(longestStreak, currentStreakChain);
        } else {
          dayStatuses[d] = 'pending';
        }
      }
    } else {
      // Future days (d > today) if any entries exist in future
      if (count >= dailyGoal) {
        dayStatuses[d] = 'completed';
        currentStreakChain += 1;
        longestStreak = Math.max(longestStreak, currentStreakChain);
      } else {
        dayStatuses[d] = 'pending';
      }
    }
  }

  const currentStreak = currentStreakChain;
  const isStreakAlive = currentStreak > 0;

  // Generate last 14 days view ending at today
  const last14Days = [];
  for (let i = 13; i >= 0; i--) {
    const d = addDays(today, -i);
    const count = counts[d] || 0;
    let status = dayStatuses[d];

    if (!status) {
      if (d === today) {
        status = count >= dailyGoal ? 'completed' : 'pending';
      } else if (d < startDate) {
        status = 'none';
      } else {
        status = count >= dailyGoal ? 'completed' : 'missed';
      }
    }

    last14Days.push({
      date: d,
      dayOfWeek: getDayOfWeek(d, 'short'),
      dayNum: parseDate(d).getDate(),
      count,
      status,
      isToday: d === today
    });
  }

  // Determine stateKey for motivation message
  let stateKey = 'new_user';
  if (recoveryAvailable) {
    stateKey = 'broken_recovery_available';
  } else if (currentStreak > 0 && (currentStreak === 7 || currentStreak === 30 || currentStreak === 100)) {
    stateKey = 'milestone';
  } else if (todayCompleted) {
    stateKey = 'goal_met';
  } else if (currentStreak > 0 && todayCount < dailyGoal) {
    stateKey = 'alive_pending';
  } else {
    stateKey = 'broken_no_recovery';
  }

  const motivationMessage = getMotivationMessage(stateKey, {
    needed: recoveryAvailable ? recoveryProblemsNeeded : Math.max(1, dailyGoal - todayCount),
    streak: currentStreak,
    goal: dailyGoal
  });

  return {
    currentStreak,
    longestStreak,
    todayCount,
    dailyGoal,
    todayCompleted,
    isStreakAlive,
    recoveryAvailable,
    recoveryPossibleCount: dailyGoal + 2,
    recoveryProblemsNeeded,
    recoveredDates,
    dayStatuses,
    last14Days,
    stateKey,
    motivationMessage
  };
}
