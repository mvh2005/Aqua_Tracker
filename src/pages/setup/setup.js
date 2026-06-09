// Setup Page - Initial profile configuration

import { icons } from '../shared/icons.js';
import { Gender, WeightUnit, ActivityLevel, Climate, INTAKE_PRESETS } from '../shared/constants.js';

export function renderSetup(profile = {}) {
  const p = profile;
  return `<div class="setup-screen">
    <div class="setup-card scrollbar-hide">
      <div class="setup-header">
        <div class="setup-icon">${icons.activity}</div>
        <h2 class="setup-title">Profile Configuration</h2>
        <p class="setup-subtitle">Enter your biological metrics for precision calculation.</p>
      </div>
      <form id="setup-form">
        <div class="form-section">
          <label class="form-section-label">${icons.user} Identity & Vitality</label>
          <div class="form-grid-2" style="margin-bottom:1rem">
            <input class="form-input" type="text" name="name" required placeholder="Full Name" value="${p.name || ''}">
            <input class="form-input" type="number" name="age" placeholder="Age" value="${p.age || 25}">
          </div>
          <div class="form-grid-2">
            <select class="form-select" name="gender">
              <option value="Male" ${(p.gender || Gender.MALE) === Gender.MALE ? 'selected' : ''}>Male</option>
              <option value="Female" ${p.gender === Gender.FEMALE ? 'selected' : ''}>Female</option>
              <option value="Other" ${p.gender === Gender.OTHER ? 'selected' : ''}>Other</option>
            </select>
            <div class="form-inline">
              <input class="form-input" type="number" name="weight" placeholder="Weight" value="${p.weight || 70}">
              <select class="form-select" name="weightUnit">
                <option value="kg" ${(p.weightUnit || WeightUnit.KG) === WeightUnit.KG ? 'selected' : ''}>kg</option>
                <option value="lbs" ${p.weightUnit === WeightUnit.LBS ? 'selected' : ''}>lbs</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-section">
          <label class="form-section-label">${icons.activity} Metabolism & Active Load</label>
          <div class="form-grid-2">
            <div>
              <span class="form-field-label">Daily Activity</span>
              <select class="form-select" name="activityLevel">
                <option value="Sedentary">Sedentary</option>
                <option value="Light" ${(p.activityLevel || ActivityLevel.LIGHT) === ActivityLevel.LIGHT ? 'selected' : ''}>Lightly Active</option>
                <option value="Moderate">Moderately Active</option>
                <option value="Very Active">Very Active</option>
              </select>
            </div>
            <div>
              <span class="form-field-label">Caffeine Frequency (Cups)</span>
              <div class="form-icon-row">${icons.coffee}<input type="number" name="caffeineCups" value="${p.caffeineCups ?? 1}"></div>
            </div>
            <div>
              <span class="form-field-label">Soda Consumption (Cans)</span>
              <div class="form-icon-row">${icons.activity.replace('width="32"','width="18"').replace('height="32"','height="18"')}<input type="number" name="sodaCans" value="${p.sodaCans ?? 0}"></div>
            </div>
          </div>
        </div>
        <div class="form-section">
          <label class="form-section-label">${icons.cloud} Environmental Constants</label>
          <div class="form-grid-2">
            <div>
              <span class="form-field-label">Current Climate</span>
              <select class="form-select" name="climate">
                <option value="Moderate" selected>Moderate</option>
                <option value="Hot/Humid">Hot/Humid</option>
                <option value="Cold">Cold</option>
                <option value="High Altitude">High Altitude</option>
              </select>
            </div>
            <div class="checkbox-row">
              <div class="checkbox-icon ${p.hasMedicalCondition ? 'active' : ''}" id="med-icon">${icons.heart}</div>
              <div class="checkbox-info">
                <p>Clinical Conditions</p>
                <p>Impact factor</p>
              </div>
              <input type="checkbox" name="hasMedicalCondition" ${p.hasMedicalCondition ? 'checked' : ''}>
            </div>
          </div>
        </div>
        <button type="submit" class="btn-primary">Initialize Plan <span style="width:24px;height:1px;background:rgba(255,255,255,0.3);display:inline-block"></span></button>
      </form>
    </div>
  </div>`;
}

/**
 * Bind setup form events
 */
export function bindSetupEvents(onSubmit) {
  const form = document.getElementById('setup-form');
  if (!form) return;

  const checkbox = form.querySelector('[name="hasMedicalCondition"]');
  const medIcon = document.getElementById('med-icon');

  checkbox?.addEventListener('change', () => {
    medIcon?.classList.toggle('active', checkbox.checked);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      name: fd.get('name'),
      age: parseInt(fd.get('age')) || 25,
      weight: parseFloat(fd.get('weight')) || 70,
      weightUnit: fd.get('weightUnit'),
      height: 170,
      gender: fd.get('gender'),
      activityLevel: fd.get('activityLevel'),
      exerciseMinutesPerSession: 45,
      exerciseDaysPerWeek: 3,
      climate: fd.get('climate'),
      caffeineCups: parseInt(fd.get('caffeineCups')) || 0,
      sodaCans: parseInt(fd.get('sodaCans')) || 0,
      hasMedicalCondition: fd.get('hasMedicalCondition') === 'on',
    };
    
    if (onSubmit) {
      onSubmit(data);
    }
  });
}

/**
 * Calculate daily hydration goal based on profile
 */
export function calculateHydrationGoal(profile) {
  const weight = profile.weight ?? 70;
  const weightUnit = profile.weightUnit ?? WeightUnit.KG;
  const gender = profile.gender ?? Gender.MALE;
  const exerciseMinutesPerSession = profile.exerciseMinutesPerSession ?? 0;
  const exerciseDaysPerWeek = profile.exerciseDaysPerWeek ?? 0;
  const caffeineCups = profile.caffeineCups ?? 0;
  const sodaCans = profile.sodaCans ?? 0;

  const weightInKg = weightUnit === WeightUnit.LBS ? weight * 0.453592 : weight;
  const baseFactor = gender === Gender.MALE ? 35 : 31;
  let total = weightInKg * baseFactor;
  const dailyAverageWorkout = (exerciseMinutesPerSession * exerciseDaysPerWeek) / 7;
  total += dailyAverageWorkout * 16.6;
  total += caffeineCups * 100;
  total += sodaCans * 150;
  return Math.max(1200, Math.round(total));
}
