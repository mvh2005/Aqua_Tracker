
import { UserProfile, Gender, Climate, WeightUnit, IntakeLog } from '../types';

export const calculateHydrationGoal = (profile: Partial<UserProfile>): number => {
  const { 
    weight = 70, 
    weightUnit = WeightUnit.KG, 
    gender = Gender.MALE, 
    exerciseMinutesPerSession = 0, 
    exerciseDaysPerWeek = 0,
    caffeineCups = 0,
    sodaCans = 0 
  } = profile;

  // Convert weight to KG if needed
  const weightInKg = weightUnit === WeightUnit.LBS ? weight * 0.453592 : weight;
  
  // 1. Gender-based Base
  const baseFactor = gender === Gender.MALE ? 35 : 31;
  let total = weightInKg * baseFactor;

  // 2. Add Workout (approx 16.6ml per minute)
  // We use the weekly average to set a consistent daily goal
  const dailyAverageWorkout = (exerciseMinutesPerSession * exerciseDaysPerWeek) / 7;
  total += (dailyAverageWorkout * 16.6);

  // 3. Add Drink Offsets
  total += (caffeineCups * 100);
  total += (sodaCans * 150);

  return Math.max(1200, Math.round(total));
};

export const getTodayKey = (): string => new Date().toISOString().split('T')[0];
export const formatVolume = (ml: number): string => ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`;

export const calculateStreaks = (logs: IntakeLog[], dailyGoal: number) => {
  if (logs.length === 0) return { currentStreak: 0, bestStreak: 0 };
  
  const dailyTotals = new Map<string, number>();
  logs.forEach(log => {
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + log.amount);
  });

  const sortedDates = Array.from(dailyTotals.keys()).sort();
  if (sortedDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Calculate best streak historically
  const startDate = new Date(sortedDates[0]);
  const endDate = new Date();
  let checkDate = new Date(startDate);

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

  // Calculate current streak backwards from today or yesterday
  const today = getTodayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];

  currentStreak = 0;
  let activeDate = new Date();
  
  // If today is not yet met, start checking from yesterday
  if ((dailyTotals.get(today) || 0) < dailyGoal) {
    activeDate.setDate(activeDate.getDate() - 1);
  }

  while ((dailyTotals.get(activeDate.toISOString().split('T')[0]) || 0) >= dailyGoal) {
    currentStreak++;
    activeDate.setDate(activeDate.getDate() - 1);
    if (currentStreak > 1000) break; // Safety break
  }

  return { currentStreak, bestStreak };
};
