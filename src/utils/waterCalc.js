// ============================================================
// Water Deficit Calculation — based on methodology diagram
// Input Data → Calculation → Output Data (losses & gains)
// Final: Sum of Losses − Sum of Gains = recommended fluid intake
// ============================================================

// ── Activity factors ─────────────────────────────────────────
export const ACTIVITY_LEVELS = [
  { id: 'sedentary',   label: 'Sedentary',          desc: 'Little or no exercise',              factor: 1.2  },
  { id: 'light',       label: 'Light',               desc: '1–3 days/week exercise',             factor: 1.375 },
  { id: 'moderate',    label: 'Moderate',            desc: '3–5 days/week exercise',             factor: 1.55  },
  { id: 'active',      label: 'Active',              desc: '6–7 days/week exercise',             factor: 1.725 },
  { id: 'very_active', label: 'Very Active',         desc: 'Hard exercise + physical job',       factor: 1.9   },
];

// ── Climate offsets (ml extra loss due to hot/humid climate) ─
export const COUNTRIES = [
  { id: 'arctic',     label: 'Arctic / Very Cold',  offset: -300 },
  { id: 'temperate',  label: 'Temperate',            offset: 0    },
  { id: 'subtropical',label: 'Subtropical / Warm',  offset: 250  },
  { id: 'tropical',   label: 'Tropical / Hot',       offset: 500  },
  { id: 'arid',       label: 'Arid / Desert',        offset: 700  },
];

// Fixed losses (set values in diagram)
const FAECAL_LOSS_ML  = 150;
const URINE_LOSS_ML   = 1400;

// ── Step 1: Body Surface Area (DuBois formula) ───────────────
// Inputs: weight (kg), height (cm)
export function calcBSA(weightKg, heightCm) {
  return 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725);
}

// ── Step 2: Skin evaporation loss (insensible perspiration) ──
// ~500 ml/m²/day (insensible water loss through skin)
export function calcSkinEvaporation(bsa) {
  return bsa * 500; // ml/day
}

// ── Step 3: Basal Metabolic Rate (Mifflin-St Jeor) ──────────
// Inputs: weight (kg), height (cm), age (years), gender
export function calcBMR(weightKg, heightCm, age, gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'Female' ? base - 161 : base + 5;
}

// ── Step 4: Caloric Expenditure (TDEE) ───────────────────────
export function calcCaloricExpenditure(bmr, activityFactor) {
  return bmr * activityFactor;
}

// ── Step 5: Respiratory Loss ─────────────────────────────────
// ~0.107 ml water lost per kcal of energy expenditure
export function calcRespiratoryLoss(caloricExpenditure) {
  return caloricExpenditure * 0.107;
}

// ── Step 6: Metabolic Water Production (GAIN) ────────────────
// ~0.12 ml water produced per kcal (oxidative metabolism)
export function calcMetabolicWater(caloricExpenditure) {
  return caloricExpenditure * 0.12;
}

// ── Step 7: Sweat Loss (activity-based + climate) ────────────
export function calcSweatLoss(weightKg, activityFactor, climateOffset) {
  const activitySweat = (activityFactor - 1.2) * weightKg * 12; // ml, scales with exertion
  return Math.max(0, activitySweat) + climateOffset;
}

// ── MASTER CALCULATOR ─────────────────────────────────────────
// Returns a full breakdown object matching the methodology diagram
export function calculateWaterDeficit(profile) {
  const weightKg  = profile.weightUnit === 'lbs'
    ? profile.weight * 0.453592
    : profile.weight;
  const heightCm  = profile.height;
  const age       = profile.age;
  const gender    = profile.gender;

  const activityObj = ACTIVITY_LEVELS.find(a => a.id === profile.activity) || ACTIVITY_LEVELS[2];
  const climateObj  = COUNTRIES.find(c => c.id === profile.country)         || COUNTRIES[1];

  // ── Calculations ─────────────────────────────────────────────
  const bsa                 = calcBSA(weightKg, heightCm);
  const bmr                 = calcBMR(weightKg, heightCm, age, gender);
  const caloricExpenditure  = calcCaloricExpenditure(bmr, activityObj.factor);
  const skinEvaporation     = calcSkinEvaporation(bsa);
  const respiratoryLoss     = calcRespiratoryLoss(caloricExpenditure);
  const metabolicWater      = calcMetabolicWater(caloricExpenditure);
  const sweatLoss           = calcSweatLoss(weightKg, activityObj.factor, climateObj.offset);
  const faecalLoss          = FAECAL_LOSS_ML;
  const urineLoss           = URINE_LOSS_ML;

  // ── Sums ─────────────────────────────────────────────────────
  const totalLoss = skinEvaporation + respiratoryLoss + sweatLoss + faecalLoss + urineLoss;
  const totalGain = metabolicWater;
  const deficit   = Math.round(Math.max(totalLoss - totalGain, 1500)); // minimum 1500ml

  return {
    // Inputs
    bsa: +bsa.toFixed(3),
    bmr: Math.round(bmr),
    caloricExpenditure: Math.round(caloricExpenditure),
    activityFactor: activityObj.factor,
    activityLabel: activityObj.label,
    climateLabel: climateObj.label,
    climateOffset: climateObj.offset,

    // Losses
    skinEvaporation: Math.round(skinEvaporation),
    respiratoryLoss: Math.round(respiratoryLoss),
    sweatLoss: Math.round(sweatLoss),
    faecalLoss,
    urineLoss,
    totalLoss: Math.round(totalLoss),

    // Gains
    metabolicWater: Math.round(metabolicWater),
    totalGain: Math.round(totalGain),

    // Final
    deficit, // = recommended daily fluid intake in ml
  };
}

// ── Helpers ───────────────────────────────────────────────────
export function formatVol(ml) {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`;
  return `${Math.round(ml)}ml`;
}
