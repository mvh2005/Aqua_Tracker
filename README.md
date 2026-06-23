# 💧 Aqua Tracker — Scientific Daily Hydration

> **Measures** your daily water capacity — not guesses it.  
> Powered by **React + Vite**, built with a premium water-themed UI.

Aqua Tracker calculates your exact fluid requirement using established biometric formulas (DuBois BSA, Mifflin-St Jeor BMR, and the fluid balance methodology), then lets you log your intake throughout the day against that measured target.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([download](https://nodejs.org))
- **npm** v9+

### Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/mvh2005/Aqua_Tracker.git
cd Aqua_Tracker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build locally
```

---

## 🎯 How It Works — Usage Guide

### Step 1 · Profile
Fill in your **name**, **age**, and **gender**.  
Gender affects the Mifflin-St Jeor BMR formula (male/female offset).

### Step 2 · Body Measurements
Enter your **weight** (kg or lbs) and **height** (cm).  
The app instantly calculates your **Body Surface Area** (DuBois formula) and shows it live:

```
BSA = 0.007184 × weight^0.425 × height^0.725
```

This value drives the skin evaporation loss calculation.

### Step 3 · Lifestyle
Pick your **activity level** and **climate/region**:

| Activity | Multiplier |
|---|---|
| Sedentary | ×1.2 |
| Light (1–3 days/week) | ×1.375 |
| Moderate (3–5 days/week) | ×1.55 |
| Active (6–7 days/week) | ×1.725 |
| Very Active | ×1.9 |

| Climate | Sweat Offset |
|---|---|
| Arctic / Very Cold | −300 ml |
| Temperate | baseline |
| Subtropical / Warm | +250 ml |
| Tropical / Hot | +500 ml |
| Arid / Desert | +700 ml |

### Step 4 · Your Measured Capacity
The app runs the full **fluid balance calculation** and shows you a breakdown:

```
Daily Target = Total Losses − Total Gains
```

| Component | Formula | Type |
|---|---|---|
| Skin evaporation | BSA × 500 ml/m²/day | Loss |
| Respiratory loss | TDEE × 0.107 ml/kcal | Loss |
| Skin sweat | Activity × weight × factor + climate offset | Loss |
| Faecal loss | 150 ml (fixed) | Loss |
| Urine | 1400 ml (fixed) | Loss |
| Metabolic water | TDEE × 0.12 ml/kcal | **Gain** |

Click **💧 Start Tracking** to go to the dashboard.

---

## 📊 Dashboard

Once set up, the main dashboard gives you:

| Feature | Description |
|---|---|
| **Water Orb** | Animated sphere that fills as you log water |
| **Stats Bar** | Today's intake · Remaining · Day streak |
| **Quick Add** | One-tap presets (Espresso 200ml, Glass 350ml, Bottle 500ml, Sport 750ml) |
| **Custom Amount** | Type any ml value and press Enter or Add |
| **Today's Log** | Timestamped list of all entries, swipe to delete |
| **⚗️ Methodology** | Opens the interactive calculation diagram showing your exact numbers |
| **Goal Banner** | Celebration when you hit your daily target 🎉 |

### ⚗️ Methodology Panel
Click the **"Scientifically calculated · Xml/day"** badge under the water orb to open the methodology diagram — a live interactive breakdown matching the fluid balance flowchart:

```
Input Data  →  Calculation  →  Sum of Losses / Sum of Gains
                                             ↓
                              = Estimated water deficit
                          (compensated by your fluid intake)
```

### ⚙️ Settings / Reset Profile
Click the settings icon (top-right) to reset your profile. Your **intake log history is preserved**.

---

## 📂 Project Structure

```
Aqua_Tracker/
├── index.html              # Vite entry point
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # Route: Setup ↔ Dashboard
│   ├── index.css           # Global dark water theme + animations
│   ├── hooks/
│   │   ├── useProfile.js   # localStorage profile persistence
│   │   └── useLogs.js      # localStorage intake log + streak logic
│   ├── utils/
│   │   └── waterCalc.js    # BSA, BMR, all loss/gain formulas
│   └── components/
│       ├── SetupWizard.jsx / .module.css   # 4-step onboarding wizard
│       ├── Dashboard.jsx   / .module.css   # Main tracking view
│       ├── WaterOrb.jsx    / .module.css   # Animated water sphere
│       └── MethodologyPanel.jsx / .module.css  # Interactive diagram
├── css/
│   └── style.css           # (legacy — no longer used)
└── js/
    └── app.js              # (legacy — no longer used)
```

---

## 🔬 Science Behind the Calculation

The methodology follows the **water balance** model used in nutrition science:

1. **Body Surface Area (DuBois, 1916)**  
   Predicts insensible skin water loss based on body geometry.

2. **Basal Metabolic Rate (Mifflin-St Jeor, 1990)**  
   Most accurate BMR formula for modern populations (±10%).

3. **Total Daily Energy Expenditure (TDEE)**  
   BMR × activity factor = actual caloric burn per day.

4. **Respiratory Water Loss**  
   ~0.107 ml of water is exhaled per kcal of energy expenditure.

5. **Metabolic Water Production**  
   ~0.12 ml of water is produced per kcal via oxidative metabolism (H₂O is a byproduct of burning carbs, fats, and proteins).

6. **Fixed losses** — Faecal (150 ml) and Urinary (1400 ml) are standard clinical reference values.

---

## 🛡️ Privacy

- **100% client-side** — no servers, no tracking, no accounts.
- All data lives in your browser's `localStorage` under keys:
  - `aqua_tracker_user_profile`
  - `aqua_tracker_intake_logs`
- Clear your browser data to reset everything.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | CSS Modules + Glassmorphism |
| Fonts | Inter + Space Grotesk (Google Fonts) |
| Storage | `localStorage` (no database) |
| Calculation | Vanilla JS (DuBois BSA, Mifflin-St Jeor BMR) |

---

## 📝 License

MIT © 2026 mvh2005