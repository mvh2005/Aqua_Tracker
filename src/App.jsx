import React from 'react';
import { useProfile } from './hooks/useProfile';
import { useLogs } from './hooks/useLogs';
import SetupWizard from './components/SetupWizard';
import Dashboard from './components/Dashboard';

export default function App() {
  const { profile, saveProfile, clearProfile } = useProfile();
  const { logs, todayLogs, todayTotal, addLog, removeLog, calculateStreak } = useLogs();

  if (!profile) {
    return (
      <SetupWizard
        onComplete={(data) => {
          saveProfile(data);
        }}
      />
    );
  }

  return (
    <Dashboard
      profile={profile}
      logs={logs}
      todayLogs={todayLogs}
      todayTotal={todayTotal}
      addLog={addLog}
      removeLog={removeLog}
      calculateStreak={calculateStreak}
      onResetProfile={clearProfile}
    />
  );
}
