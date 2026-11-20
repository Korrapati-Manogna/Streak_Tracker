# ⚡ Streak Tracker — Daily DSA Practice

A web application designed for tracking daily Data Structures and Algorithms (DSA) practice, maintaining consistency, and recovering broken streaks through focused practice.

---

## 🌟 Key Features

1. **Authentication Gate**:
   - Clean Login & Registration screen with credentials.
   - **1-Click Demo Login** pre-loaded with sample account credentials (`alex` / `password123`) for instant testing.
   - User profile with avatar and sign-out control.

2. **Multi-View Navigation Architecture**:
   - 🎯 **Dashboard**: The focal streak overview, live today's practice card, contextual motivation banner, and 14-day activity heatmap.
   - 📚 **Practice & Problems**: Catalog of all problems with instant search, filters (Platform, Difficulty, Topic, Status), and **one-click completion denoting**.
   - 📅 **Calendar & Heatmap**: 14-day activity row + full monthly calendar grid with status dots and a day inspector drawer.
   - 📈 **Analytics**: Real-time breakdown of platforms, difficulty ratios (Easy/Medium/Hard), topic mastery, and consistency velocity.
   - ⚙️ **Settings (Dedicated Page)**: Separate settings screen for Daily Goal adjustment, Profile, Time-Travel Simulator, Demo Data loading, JSON Import/Export, and Storage Wipe.

3. **Streak & Recovery Protocol (Implemented Exactly)**:
   - **Completed Day**: Count of completed problems $\ge \text{dailyGoal}$.
   - **Active Streak**: Consecutive completed days ending today or yesterday (alive as long as yesterday was completed).
   - **Recovery Rule (+2 Bonus)**: If **exactly 1 day** is missed, it can be recovered on the next day by solving $\text{dailyGoal} + 2$ problems. When satisfied, the missed day is marked as **Recovered** (`🛡️`) and both days count toward the streak length.
   - **Streak Lost & Reset**: If 2 or more consecutive days are missed, recovery is permanently locked and the streak resets to `0`. A dedicated Comeback Motivation Card guides the user to start Day 1.

4. **Fast Problem Logging Modal**:
   - Accessible from any screen via the `+ Log Problem` button.
   - Captures Problem Name, Platform dropdown, Date (with dynamically derived Day of Week), Difficulty, Algorithmic Pattern / Topic, Completed checkbox, and Notes.

5. **Toast Notification System**:
   - Responsive feedback on problem logging, completion toggling, goal milestones, streak recovery, and settings updates.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser (typically http://localhost:5173)
```

### Available Scripts

- `npm run dev` — Run Vite dev server with Hot Module Replacement (HMR)
- `npm test` — Run all 21 Vitest unit tests (`src/streak.test.js`, `src/storage.test.js`)
- `npm run lint` — Run OxLint static analysis (0 warnings, 0 errors)
- `npm run build` — Build production bundle to `dist/`
