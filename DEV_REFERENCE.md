# Developer Quick Reference

## Project Structure at a Glance

```
src/
├── app.js              # Main App class - orchestrates everything
├── app.css             # Global styles & layout
│
├── pages/              # Page-specific modules
│   ├── setup/          # User profile setup
│   ├── today/          # Daily water tracking
│   └── trends/         # Performance analytics
│
├── profile/            # User data management
│   ├── userProfile.js  # UserProfile class
│   └── profile.css     # Profile UI styles
│
└── shared/             # Reusable utilities
    ├── constants.js    # Enums & config
    ├── icons.js        # SVG icons
    └── utils.js        # Helper functions
```

---

## Core Classes & Functions

### AquaTrackerApp (src/app.js)
```javascript
class AquaTrackerApp {
  loadData()              // Load logs from localStorage
  saveLogs()              // Save logs to localStorage
  addLog(amount, type)    // Add new water intake log
  deleteLog(logId)        // Remove a log entry
  getTodayLogs()          // Get today's logs only
  render()                // Main render function
  handleSetupSubmit()     // Process profile setup
  bindAppEvents()         // Attach event listeners
  init()                  // Initialize the app
}
```

### UserProfile (src/profile/userProfile.js)
```javascript
class UserProfile {
  loadProfile()           // Load from localStorage
  saveProfile(data)       // Save to localStorage
  getProfile()            // Get current profile
  hasProfile()            // Check if profile exists
  clearProfile()          // Remove profile (logout)
  updateProfile(fields)   // Update specific fields
  getProfileInfo()        // Get formatted info
  exportProfile()         // Export as JSON
  importProfile(json)     // Import from JSON
}
```

---

## Common Tasks

### Display User Data
```javascript
const profile = userProfile.getProfile();
console.log(`${profile.name}, Goal: ${profile.dailyGoal}ml`);
```

### Add Water Log
```javascript
app.addLog(250);              // 250ml
app.addLog(100, 'Coffee');    // 100ml coffee
```

### Get Today's Total
```javascript
const todayLogs = app.getTodayLogs();
const total = todayLogs.reduce((sum, log) => sum + log.amount, 0);
console.log(`Today: ${total}ml`);
```

### Calculate Stats
```javascript
import { calculateStreaks, getHistoryData } from './src/shared/utils.js';

const streaks = calculateStreaks(logs, profile.dailyGoal);
const history = getHistoryData(profile, logs);
```

### Use Icons
```javascript
import { icons, presetIcon } from './src/shared/icons.js';

const html = `${icons.droplets} ${presetIcon('glass-md')}`;
```

---

## Event Flow

```
User Action
    ↓
bindAppEvents() listener
    ↓
App method (addLog, deleteLog, etc.)
    ↓
saveLogs() to localStorage
    ↓
render() to update UI
    ↓
bindAppEvents() on new HTML
    ↓
Chart rendering (if needed)
```

---

## localStorage Keys

```javascript
// User Profile
localStorage.getItem('hydrate_me_user_profile')
// Returns: { name, age, weight, dailyGoal, ... }

// Intake Logs
localStorage.getItem('hydrate_me_intake_logs')
// Returns: [{ id, amount, type, timestamp }, ...]
```

---

## Module Imports

```javascript
// Core app
import AquaTrackerApp from './src/app.js';

// Pages
import { renderSetup, bindSetupEvents } from './src/pages/setup/setup.js';
import { renderToday, bindTodayEvents, drawRadarChart } from './src/pages/today/today.js';
import { renderTrends, drawBarChart } from './src/pages/trends/trends.js';

// User profile
import { userProfile } from './src/profile/userProfile.js';

// Utilities
import { calculateStreaks, getHistoryData } from './src/shared/utils.js';
import { icons, presetIcon } from './src/shared/icons.js';
import { STORAGE_KEYS, INTAKE_PRESETS, Gender, WeightUnit } from './src/shared/constants.js';
```

---

## Creating New Components

### Add a New Page
```javascript
// src/pages/newpage/newpage.js
export function renderNewPage(data) {
  return `<div class="tab-content">
    <!-- Your HTML here -->
  </div>`;
}

export function bindNewPageEvents(callbacks) {
  // Attach listeners
}
```

### Add a New Utility
```javascript
// src/shared/utils.js
export function myHelper(input) {
  return input * 2;
}
```

### Use New Component
```javascript
// In src/app.js
import { renderNewPage, bindNewPageEvents } from './pages/newpage/newpage.js';

// In render()
if (this.activeTab === 'newpage') {
  main.innerHTML = renderNewPage(data);
  bindNewPageEvents(callbacks);
}
```

---

## Hydration Goal Formula

```javascript
function calculateHydrationGoal(profile) {
  const weightKg = profile.weightUnit === 'lbs' 
    ? profile.weight * 0.453592 
    : profile.weight;
  
  const baseFactor = profile.gender === 'Male' ? 35 : 31;
  let total = weightKg * baseFactor;
  
  // Exercise
  const dailyWorkout = (profile.exerciseMinutesPerSession * profile.exerciseDaysPerWeek) / 7;
  total += dailyWorkout * 16.6;
  
  // Caffeine & Soda
  total += profile.caffeineCups * 100;
  total += profile.sodaCans * 150;
  
  return Math.max(1200, Math.round(total));
}
```

---

## Debugging Tips

### Check Stored Data
```javascript
// In browser console
JSON.parse(localStorage.getItem('hydrate_me_user_profile'))
JSON.parse(localStorage.getItem('hydrate_me_intake_logs'))
```

### Clear All Data
```javascript
localStorage.clear();
location.reload();
```

### Trace Rendering
```javascript
// Add to render() method
console.log('Rendering as:', this.activeTab);
console.log('Profile exists:', userProfile.hasProfile());
```

### Monitor Storage Changes
```javascript
window.addEventListener('storage', (e) => {
  console.log('Storage changed:', e.key, e.newValue);
});
```

---

## Performance Optimization

### Caching
- logs are loaded once on init
- Rendered only when updated
- Charts use requestAnimationFrame

### Bundle Size
- Modular: Tree-shaking friendly
- CSS: Only needed styles loaded
- Icons: Inline SVG (no HTTP requests)

### Responsive Design
- Mobile-first CSS
- Breakpoints: 480px, 640px, 768px
- Touch-friendly buttons

---

## Testing Ideas

- [ ] Test profile creation with various metrics
- [ ] Test water log addition and deletion
- [ ] Test localStorage persistence
- [ ] Test streak calculation
- [ ] Test chart rendering on resize
- [ ] Test mobile responsiveness
- [ ] Test data export/import
- [ ] Test edge cases (0 logs, extreme values)

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES6 Modules | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| Canvas API | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |

---

## Performance Checklist

- [ ] All images optimized
- [ ] CSS minified for production
- [ ] JS modules can be bundled
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessible (ARIA labels)
- [ ] Fast initial load
- [ ] Smooth animations

---

## Key Files to Know

| File | Purpose | Lines |
|------|---------|-------|
| src/app.js | Main orchestration | ~280 |
| src/pages/today/today.js | Daily tracker | ~150 |
| src/pages/trends/trends.js | Analytics | ~80 |
| src/profile/userProfile.js | Data management | ~100 |
| src/shared/utils.js | Helpers | ~80 |
| src/shared/constants.js | Config | ~20 |

**Total: ~710 lines (vs. ~1500 in monolithic)**

---

## Quick Links

- 📖 Full Architecture: [ARCHITECTURE.md](ARCHITECTURE.md)
- 👤 User Guide: [USER_GUIDE.md](USER_GUIDE.md)
- 🔄 Migration Info: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- 📝 Main README: [README.md](README.md)

---

**Happy coding! 🚀**
