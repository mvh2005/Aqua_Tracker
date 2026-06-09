// Utility functions for Aqua Tracker

export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

export function formatVolume(ml) {
  return ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`;
}

export function calculateStreaks(allLogs, dailyGoal) {
  if (allLogs.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const dailyTotals = new Map();
  allLogs.forEach((log) => {
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + log.amount);
  });

  const sortedDates = Array.from(dailyTotals.keys()).sort();
  if (sortedDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  let bestStreak = 0;
  let tempStreak = 0;
  const startDate = new Date(sortedDates[0]);
  const endDate = new Date();
  const checkDate = new Date(startDate);

  while (checkDate <= endDate) {
    const dateKey = checkDate.toISOString().split('T')[0];
    if ((dailyTotals.get(dateKey) || 0) >= dailyGoal) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  const today = getTodayKey();
  let currentStreak = 0;
  const activeDate = new Date();
  if ((dailyTotals.get(today) || 0) < dailyGoal) {
    activeDate.setDate(activeDate.getDate() - 1);
  }
  while ((dailyTotals.get(activeDate.toISOString().split('T')[0]) || 0) >= dailyGoal) {
    currentStreak++;
    activeDate.setDate(activeDate.getDate() - 1);
    if (currentStreak > 1000) break;
  }

  return { currentStreak, bestStreak };
}

export function getHistoryData(profile, logs) {
  if (!profile) return [];
  const map = new Map();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();
  last7Days.forEach((date) => map.set(date, 0));
  logs.forEach((log) => {
    const dateKey = new Date(log.timestamp).toISOString().split('T')[0];
    if (map.has(dateKey)) map.set(dateKey, map.get(dateKey) + log.amount);
  });
  return Array.from(map.entries()).map(([date, total]) => ({
    date,
    total,
    goal: profile.dailyGoal,
  }));
}
