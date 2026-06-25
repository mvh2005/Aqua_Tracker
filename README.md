# 💧 Aqua Tracker — Scientific Daily Hydration

> **Measures** your daily water capacity — not guesses it.  
> Powered by **React + Vite**, built with a premium water-themed UI.

Aqua Tracker calculates your exact fluid requirement using established biometric formulas (DuBois BSA, Mifflin-St Jeor BMR, and the fluid balance methodology), then lets you log your intake throughout the day against that measured target.

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| **Node.js** (includes npm) | v18+ | [nodejs.org](https://nodejs.org) |
| **Git** | any | [git-scm.com](https://git-scm.com) |

### 1 · Clone the repository

```bash
git clone https://github.com/mvh2005/Aqua_Tracker.git
cd Aqua_Tracker
```

### 2 · Install dependencies

```bash
npm install
```

> `node_modules/` is **not** committed to Git. This step re-creates it locally from `package.json`.

### 3 · Run the website locally for development

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser. The dev server supports hot-module replacement — your changes appear instantly.

### 4 · Build for production (optional preview)

```bash
npm run build       # compiles to /dist  (not committed to Git)
npm run preview     # serves /dist locally to verify the build
```

---

## 📦 What Is and Is NOT Committed to Git

| ✅ Committed | ❌ NOT Committed (auto-generated) |
|---|---|
| `src/`, `index.html` — source code | `node_modules/` — recreated by `npm install` |
| `package.json`, `package-lock.json` | `dist/` — recreated by `npm run build` |
| `vite.config.js`, `capacitor.config.json` | `android/app/build/` — recreated by Gradle |
| `android/` project structure (config & source only) | `.apk` / `.aab` release files |

Capacitor automatically places a `.gitignore` inside `android/` that excludes its own build outputs.

---

## 📱 Building the Android App (APK)

Aqua Tracker uses **Capacitor 8** to wrap the compiled web app inside a native Android WebView.

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Android Studio** | Meerkat (2024.3+) | [download](https://developer.android.com/studio) |
| **JDK** | 17+ | Bundled with Android Studio |
| **Android SDK** | 36 | Install via *Android Studio → SDK Manager* |
| `ANDROID_HOME` env var | — | Must point to your SDK folder |

### Step 1 · Install dependencies

```bash
npm install
```

### Step 2 · Build the production web assets

Capacitor wraps the **compiled** output — not the dev server. Always build first:

```bash
npm run build
```

This runs Vite and outputs all assets to `dist/`.

### Step 3 · Sync the built assets to the Android folder

```bash
npx cap sync
```

This copies everything in `dist/` into `android/app/src/main/assets/public/` (where the native WebView reads from) and updates any native plugin dependencies.

> Re-run `npx cap sync` every time you rebuild the web app or add/remove Capacitor plugins.

### Step 4 · Open the project in Android Studio

```bash
npx cap open android
```

Or use the npm shortcut:

```bash
npm run cap:build   # = npm run build && npx cap sync
npm run cap:open    # = npx cap open android
```

### Step 5 · Generate the APK

Inside Android Studio:

1. Wait for Gradle to finish syncing.
2. Connect a physical device (enable **USB Debugging**) **or** start an AVD emulator.
3. To run directly → click **▶ Run** (Shift + F10).
4. To generate an APK file → go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

Once finished, the `.apk` file will be at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### Release APK (command line)

```bash
cd android
./gradlew assembleRelease       # macOS / Linux
gradlew.bat assembleRelease     # Windows
```

Output: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

> To distribute on Google Play you will need to [sign the APK](https://developer.android.com/studio/publish/app-signing) with your own keystore.

### Live Reload (Development)

For rapid iteration on a physical device on the same network:

```bash
npx cap run android --livereload --external
```

Changes appear instantly without a full rebuild.

### Android Configuration Reference

| Setting | Value | File |
|---|---|---|
| App ID | `com.mvh2005.aquatracker` | `capacitor.config.json` |
| Min SDK | 24 (Android 7.0) | `android/variables.gradle` |
| Target / Compile SDK | 36 | `android/variables.gradle` |
| Gradle Plugin | 8.13.0 | `android/build.gradle` |
| Web Dir | `dist` | `capacitor.config.json` |

---

## 🔧 Setting Up Capacitor from Scratch

> If you are adding Capacitor to a fresh clone of this project (or your own Vite project), follow these steps end-to-end. If Capacitor is already configured, jump to [Quick Build & Run](#quick-build--run).

### Step 1 · Install Capacitor Core & CLI

```bash
npm install @capacitor/core @capacitor/cli
```

This installs two packages:

| Package | Purpose |
|---|---|
| `@capacitor/core` | Runtime bridge between your JS and native APIs |
| `@capacitor/cli` | `npx cap` command-line tool |

---

### Step 2 · Initialise Capacitor in Your Project

```bash
npx cap init [app-name] [app-id] --web-dir=dist
```

Replace the placeholders:

| Placeholder | Example | Notes |
|---|---|---|
| `[app-name]` | `Aqua Tracker` | Human-readable name shown on the device |
| `[app-id]` | `com.mvh2005.aquatracker` | Reverse-domain bundle ID — must be unique on the Play Store |
| `--web-dir=dist` | *(keep as-is)* | Tells Capacitor where Vite outputs the built files |

**For this project the exact command is:**

```bash
npx cap init "Aqua Tracker" com.mvh2005.aquatracker --web-dir=dist
```

This creates **`capacitor.config.json`** in your project root (already committed in this repo).

---

### Step 3 · Add the Android Platform

```bash
npm install @capacitor/android
npx cap add android
```

- `npm install @capacitor/android` — downloads the Android Capacitor adapter.
- `npx cap add android` — scaffolds the native Android project into the **`android/`** folder. This is a full Gradle project managed by Capacitor; you normally don't edit it by hand.

> **Prerequisites before this step:**
> - **Android Studio** Meerkat (2024.3+) — [download](https://developer.android.com/studio)
> - **JDK 17+** (bundled with Android Studio, or install separately)
> - **Android SDK 36** — install via *Android Studio → SDK Manager*
> - `ANDROID_HOME` environment variable pointing to your SDK folder

---

### Step 4 · Build the Web App

Capacitor wraps your **compiled** web output, not the dev server. Always build first:

```bash
npm run build
```

This runs Vite and outputs all assets to `dist/`. You should see something like:

```
dist/index.html
dist/assets/index-<hash>.js
dist/assets/index-<hash>.css
```

---

### Step 5 · Sync Web Assets into the Android Project

```bash
npx cap sync
```

`cap sync` does two things in one command:

1. **Copies** everything in `dist/` into `android/app/src/main/assets/public/` (where the native WebView reads from).
2. **Updates** native plugin dependencies — any `@capacitor/*` plugin you've installed gets linked into the Gradle build.

> Run `npx cap sync` every time you rebuild the web app or add/remove Capacitor plugins.

---

### Step 6 · Open in Android Studio

```bash
npx cap open android
```

This opens the `android/` folder as an Android Studio project. Once it finishes indexing and syncing Gradle:

1. Connect a physical device via USB (enable **USB Debugging** in Developer Options), **or** start an AVD emulator.
2. Select your target device from the toolbar.
3. Click **▶ Run** (Shift + F10) to build and deploy the APK.

---

### Putting It All Together — Full Workflow

```bash
# 1. Clone the repo
git clone https://github.com/mvh2005/Aqua_Tracker.git
cd Aqua_Tracker

# 2. Install all npm dependencies (including Capacitor)
npm install

# 3. Build the web app
npm run build

# 4. Sync assets into the Android project
npx cap sync

# 5. Open in Android Studio (then click ▶ Run)
npx cap open android
```

Or use the convenience scripts already in `package.json`:

```bash
npm run cap:build   # = npm run build && npx cap sync
npm run cap:open    # = npx cap open android
```

---

### Troubleshooting

| Problem | Fix |
|---|---|
| `ANDROID_HOME is not set` | Add `ANDROID_HOME=C:\Users\<you>\AppData\Local\Android\Sdk` to your system environment variables, then restart your terminal |
| Gradle sync fails | Open Android Studio → *File → Sync Project with Gradle Files* |
| APK installs but shows blank screen | Make sure you ran `npm run build` before `npx cap sync` |
| Changes not reflecting on device | Re-run `npm run cap:build`, then click ▶ Run again in Android Studio |
| `cap sync` complains about plugin versions | Run `npm install` first to ensure all packages are at compatible versions |

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
├── capacitor.config.json   # Capacitor native bridge config
├── android/                # Native Android project (auto-managed by Capacitor)
│   ├── app/
│   │   └── build.gradle    # App-level Gradle config
│   ├── build.gradle        # Root Gradle config (AGP 8.13.0)
│   ├── variables.gradle    # SDK versions & dependency versions
│   ├── gradlew / gradlew.bat
│   └── …
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
| Native Bridge | Capacitor 8 |
| Android | Gradle 8.13 · SDK 36 · Min SDK 24 |
| Styling | CSS Modules + Glassmorphism |
| Fonts | Inter + Space Grotesk (Google Fonts) |
| Storage | `localStorage` (no database) |
| Calculation | Vanilla JS (DuBois BSA, Mifflin-St Jeor BMR) |

---

## 📚 References

- [Hydration Calculator — Methodology](https://www.hydrationforhealth.com/en/hydration-tools/hydration-calculator/#section-methodology) — Hydration for Health (Danone Research). Describes the fluid balance methodology and scientific basis for estimating daily water needs.

---

## 📝 License

MIT © 2026 mvh2005