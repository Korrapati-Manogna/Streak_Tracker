import React, { useState, useMemo, useCallback } from 'react';
import {
  getCurrentUser,
  logout,
  getEntries,
  addEntry,
  deleteEntry,
  toggleEntryCompleted,
  getSettings,
  saveSettings,
  clearAllData,
  loadDemoData
} from './storage.js';
import {
  calculateStreak,
  toDateString,
  getMotivationMessage
} from './streak.js';

import AuthView from './components/AuthView.jsx';
import Navigation from './components/Navigation.jsx';
import FastLogModal from './components/FastLogModal.jsx';
import InstallGuideModal from './components/InstallGuideModal.jsx';
import Toast from './components/Toast.jsx';

import DashboardView from './views/DashboardView.jsx';
import ProblemsView from './views/ProblemsView.jsx';
import CalendarView from './views/CalendarView.jsx';
import AnalyticsView from './views/AnalyticsView.jsx';
import SettingsView from './views/SettingsView.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [entries, setEntriesState] = useState(() => getEntries());
  const [settings, setSettingsState] = useState(() => getSettings());
  const [realToday] = useState(() => toDateString(new Date()));
  const [motivationOverride, setMotivationOverride] = useState({ stateKey: null, text: null });
  const [isFastLogOpen, setIsFastLogOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [fastLogInitialTitle, setFastLogInitialTitle] = useState('');
  const [toast, setToast] = useState(null);

  const handleOpenFastLog = useCallback((prefillTitle = '') => {
    setFastLogInitialTitle(typeof prefillTitle === 'string' ? prefillTitle : '');
    setIsFastLogOpen(true);
  }, []);

  const triggerToast = useCallback((toastData) => {
    setToast(toastData);
  }, []);

  const effectiveToday = settings.devTodayOverride || realToday;
  const isOverridden = Boolean(settings.devTodayOverride && settings.devTodayOverride !== realToday);

  // Compute streak on every render based on entries and settings
  const streakData = useMemo(() => {
    return calculateStreak(entries, {
      dailyGoal: settings.dailyGoal,
      today: effectiveToday
    });
  }, [entries, settings.dailyGoal, effectiveToday]);

  const activeMotivationMessage =
    motivationOverride.stateKey === streakData.stateKey && motivationOverride.text
      ? motivationOverride.text
      : streakData.motivationMessage;

  const handleShuffleMessage = useCallback(() => {
    const newMessage = getMotivationMessage(streakData.stateKey, {
      needed: streakData.recoveryAvailable
        ? streakData.recoveryProblemsNeeded
        : Math.max(1, streakData.dailyGoal - streakData.todayCount),
      streak: streakData.currentStreak,
      goal: streakData.dailyGoal
    });
    setMotivationOverride({
      stateKey: streakData.stateKey,
      text: newMessage
    });
  }, [streakData]);

  const handleAuthSuccess = useCallback((user) => {
    setCurrentUser(user);
    triggerToast({
      message: `Welcome back, ${user.name || user.username}!`,
      type: 'success',
      icon: '👋'
    });
  }, [triggerToast]);

  const handleLogout = useCallback(() => {
    logout();
    setCurrentUser(null);
    triggerToast({
      message: 'Signed out successfully.',
      type: 'info',
      icon: '👋'
    });
  }, [triggerToast]);

  const handleLogProblem = useCallback((problemData) => {
    const created = addEntry(problemData);
    const updatedEntries = getEntries();
    setEntriesState(updatedEntries);

    // Compute preview streak to provide responsive celebratory feedback
    const previewStreak = calculateStreak(updatedEntries, {
      dailyGoal: settings.dailyGoal,
      today: effectiveToday
    });

    if (streakData.recoveryAvailable && !previewStreak.recoveryAvailable && previewStreak.currentStreak > 0) {
      triggerToast({
        message: 'STREAK RECOVERED! Missed day restored and streak extended!',
        type: 'success',
        icon: '🛡️'
      });
    } else if (previewStreak.todayCompleted && !streakData.todayCompleted) {
      triggerToast({
        message: 'Daily goal completed! Streak locked in for today! 🔥',
        type: 'success',
        icon: '🎉'
      });
    } else {
      triggerToast({
        message: `Logged "${created.problemName}" on ${created.platform}`,
        type: 'success',
        icon: '⚡'
      });
    }
  }, [settings.dailyGoal, effectiveToday, streakData, triggerToast]);

  const handleToggleCompleted = useCallback((id) => {
    const updated = toggleEntryCompleted(id);
    setEntriesState(updated);
    const target = updated.find((e) => e.id === id);
    if (target) {
      triggerToast({
        message: `Marked "${target.problemName}" as ${target.completed ? 'completed' : 'in-progress'}.`,
        type: 'info',
        icon: target.completed ? '✓' : '○'
      });
    }
  }, [triggerToast]);

  const handleDeleteEntry = useCallback((id) => {
    const updated = deleteEntry(id);
    setEntriesState(updated);
    triggerToast({
      message: 'Problem removed from history.',
      type: 'info',
      icon: '🗑️'
    });
  }, [triggerToast]);

  const handleSaveSettings = useCallback((newSettings) => {
    const updated = saveSettings(newSettings);
    setSettingsState(updated);
  }, []);

  const handleLoadDemo = useCallback(() => {
    loadDemoData(effectiveToday);
    setEntriesState(getEntries());
    triggerToast({
      message: 'Loaded 10 days of sample practice including recovery!',
      type: 'success',
      icon: '🚀'
    });
  }, [effectiveToday, triggerToast]);

  const handleClearAll = useCallback(() => {
    clearAllData();
    setEntriesState([]);
    setSettingsState(getSettings());
    triggerToast({
      message: 'All application data has been wiped.',
      type: 'info',
      icon: '🗑️'
    });
  }, [triggerToast]);

  // If not authenticated, render login page
  if (!currentUser) {
    return (
      <div className="app-container">
        <AuthView
          onAuthSuccess={handleAuthSuccess}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
        />
        <InstallGuideModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Header & Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={currentUser}
        onLogout={handleLogout}
        onOpenFastLog={() => handleOpenFastLog('')}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        streakCount={streakData.currentStreak}
        isOverridden={isOverridden}
        effectiveToday={effectiveToday}
      />

      {/* Main View Router */}
      <main className="main-content-view">
        {activeTab === 'dashboard' && (
          <DashboardView
            streakData={streakData}
            entries={entries}
            effectiveToday={effectiveToday}
            activeMotivationMessage={activeMotivationMessage}
            onShuffleMessage={handleShuffleMessage}
            onOpenFastLog={() => handleOpenFastLog('')}
            onToggleCompleted={handleToggleCompleted}
            onDeleteEntry={handleDeleteEntry}
            onNavigateToProblems={() => setActiveTab('problems')}
          />
        )}

        {activeTab === 'problems' && (
          <ProblemsView
            entries={entries}
            recoveredDates={streakData.recoveredDates}
            dailyGoal={settings.dailyGoal}
            onOpenFastLog={handleOpenFastLog}
            onToggleCompleted={handleToggleCompleted}
            onDeleteEntry={handleDeleteEntry}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            last14Days={streakData.last14Days}
            entries={entries}
            recoveredDates={streakData.recoveredDates}
            dailyGoal={settings.dailyGoal}
            effectiveToday={effectiveToday}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            entries={entries}
            streakData={streakData}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onLoadDemo={handleLoadDemo}
            onClearAll={handleClearAll}
            realToday={realToday}
            onShowToast={triggerToast}
          />
        )}
      </main>

      {/* Modal for fast problem logging */}
      <FastLogModal
        isOpen={isFastLogOpen}
        onClose={() => setIsFastLogOpen(false)}
        onLogProblem={handleLogProblem}
        defaultDate={effectiveToday}
        initialTitle={fastLogInitialTitle}
        entries={entries}
      />

      {/* Modal for installation guide & 1-click install */}
      <InstallGuideModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Responsive Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <footer className="app-footer">
        <p>Streak Tracker · Daily DSA Practice & Algorithmic Discipline · Pure Storage & Streak Engine</p>
      </footer>
    </div>
  );
}
