// Constants and enums for Aqua Tracker

export const STORAGE_KEYS = {
  USER_PROFILE: 'hydrate_me_user_profile',
  INTAKE_LOGS: 'hydrate_me_intake_logs',
};

export const INTAKE_PRESETS = [
  { label: 'Small Glass', amount: 200, icon: 'glass-sm' },
  { label: 'Medium Glass', amount: 350, icon: 'glass-md' },
  { label: 'Large Bottle', amount: 500, icon: 'droplet' },
  { label: 'Large Bottle XL', amount: 750, icon: 'droplet-lg' },
];

export const Gender = { MALE: 'Male', FEMALE: 'Female', OTHER: 'Other' };
export const WeightUnit = { KG: 'kg', LBS: 'lbs' };
export const ActivityLevel = { SEDENTARY: 'Sedentary', LIGHT: 'Light', MODERATE: 'Moderate', ACTIVE: 'Very Active' };
export const Climate = { HOT_HUMID: 'Hot/Humid', MODERATE: 'Moderate', COLD: 'Cold', HIGH_ALTITUDE: 'High Altitude' };
