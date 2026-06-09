// User Profile Manager - Handles profile data and persistence

import { STORAGE_KEYS, Gender, WeightUnit } from '../shared/constants.js';

export class UserProfile {
  constructor() {
    this.profile = null;
    this.loadProfile();
  }

  /**
   * Load profile from localStorage
   */
  loadProfile() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (saved) {
      this.profile = JSON.parse(saved);
    }
    return this.profile;
  }

  /**
   * Save profile to localStorage
   */
  saveProfile(profileData) {
    this.profile = profileData;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profileData));
    return this.profile;
  }

  /**
   * Get current profile
   */
  getProfile() {
    return this.profile;
  }

  /**
   * Check if profile exists
   */
  hasProfile() {
    return this.profile !== null && this.profile !== undefined;
  }

  /**
   * Clear profile (for logout/reset)
   */
  clearProfile() {
    this.profile = null;
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  }

  /**
   * Update specific profile fields
   */
  updateProfile(fields) {
    if (!this.profile) return null;
    this.profile = { ...this.profile, ...fields };
    return this.saveProfile(this.profile);
  }

  /**
   * Get profile display information
   */
  getProfileInfo() {
    if (!this.profile) return null;
    return {
      name: this.profile.name || 'User',
      age: this.profile.age || 0,
      weight: this.profile.weight || 0,
      weightUnit: this.profile.weightUnit || WeightUnit.KG,
      gender: this.profile.gender || Gender.MALE,
      dailyGoal: this.profile.dailyGoal || 0,
      activityLevel: this.profile.activityLevel || 'Light',
      caffeineCups: this.profile.caffeineCups || 0,
      sodaCans: this.profile.sodaCans || 0,
      climate: this.profile.climate || 'Moderate',
      hasMedicalCondition: this.profile.hasMedicalCondition || false,
    };
  }

  /**
   * Export profile data as JSON
   */
  exportProfile() {
    return JSON.stringify(this.profile, null, 2);
  }

  /**
   * Import profile data from JSON
   */
  importProfile(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      return this.saveProfile(data);
    } catch (error) {
      console.error('Failed to import profile:', error);
      return null;
    }
  }
}

// Export singleton instance
export const userProfile = new UserProfile();
