# 💧 Aqua Tracker (Waret) — Self-Contained Hydration Companion

Aqua Tracker is a lightweight, premium, zero-dependency client-side application for tracking daily water intake, calculating biometric hydration targets, and analyzing streaks.

The entire application (HTML structure, styles, SVG icons, and JavaScript logic) is consolidated into a **single self-contained file** (`index.html`).

---

## 🎯 Key Features

- **Personalized Setup**: Auto-calculates your daily hydration target based on weight, age, activity level, and environmental climate.
- **Interactive Daily Log**: Track water volume with preset fast buttons or manual input. Visualizes progress with a smooth liquid wave animation.
- **Analytics & Biometrics**:
  - **7-Day History Chart**: Visualizes daily intake consistency.
  - **Bio-Metric Analysis**: Radar chart tracking cellular volume, metabolism, kidney filtration rate, ATP energy, and cognitive efficiency.
  - **Streak Tracker**: Tracks current and best hydration streaks in days.
- **Privacy First**: 100% client-side. All data stays in your browser's `localStorage` — no databases, no tracking, and no external servers.

---

## 🚀 Quick Start

### Double-Click to Open
You can open the app directly from your file explorer:
1. Double-click [index.html](file:///c:/GitHub/Aqua_Tracker/index.html) (or drag it into any web browser).
2. Complete the biometric setup.
3. Start tracking!

### Serve Locally (Optional)
If you prefer running a local server:
```bash
# Python 3
python -m http.server 8000

# Node / npx
npx serve .
```
Then navigate to `http://localhost:8000` in your browser.

---

## 📂 Project Structure

```
Aqua_Tracker/
├── assets/
│   ├── style.css      # Core styles, layout, and animations
│   └── app.js         # Application logic, data storage, and calculations
├── index.html         # Core structure referencing stylesheets and scripts
└── README.md          # Project overview and documentation
```

---

## 🎓 Under the Hood

- **No external frameworks**: Hand-coded vanilla HTML5, CSS3 transitions, and modern ES6 JavaScript.
- **Canvas API**: Rendered custom responsive bar and radar charts.
- **Clean separation**: Divided into logical HTML, CSS, and JS components.
- **No Build Steps**: No npm installs, bundlers (Vite/Webpack), or compiler steps needed.