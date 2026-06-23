import { useState, useEffect } from 'react';

const PROFILE_KEY = 'aqua_tracker_user_profile';

export function useProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const saveProfile = (data) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    setProfile(data);
  };

  const clearProfile = () => {
    localStorage.removeItem(PROFILE_KEY);
    setProfile(null);
  };

  return { profile, saveProfile, clearProfile };
}
