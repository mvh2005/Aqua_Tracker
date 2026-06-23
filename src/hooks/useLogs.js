import { useState, useEffect, useCallback } from 'react';

const LOGS_KEY = 'aqua_tracker_intake_logs';

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

export function useLogs() {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const persist = (newLogs) => {
    localStorage.setItem(LOGS_KEY, JSON.stringify(newLogs));
    setLogs(newLogs);
  };

  const addLog = useCallback((amount) => {
    const ml = parseInt(amount);
    if (!ml || ml <= 0 || ml > 5000) return false;
    const entry = {
      id: Math.random().toString(36).substr(2, 9),
      amount: ml,
      timestamp: Date.now(),
    };
    setLogs(prev => {
      const next = [entry, ...prev];
      localStorage.setItem(LOGS_KEY, JSON.stringify(next));
      return next;
    });
    return true;
  }, []);

  const removeLog = useCallback((id) => {
    setLogs(prev => {
      const next = prev.filter(l => l.id !== id);
      localStorage.setItem(LOGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const todayLogs = logs.filter(l =>
    new Date(l.timestamp).toISOString().startsWith(getTodayKey())
  );

  const todayTotal = todayLogs.reduce((s, l) => s + l.amount, 0);

  const calculateStreak = (dailyGoal) => {
    if (!logs.length) return 0;
    const byDay = {};
    logs.forEach(l => {
      const d = new Date(l.timestamp).toISOString().split('T')[0];
      byDay[d] = (byDay[d] || 0) + l.amount;
    });
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if ((byDay[key] || 0) >= dailyGoal) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  return { logs, todayLogs, todayTotal, addLog, removeLog, calculateStreak };
}
