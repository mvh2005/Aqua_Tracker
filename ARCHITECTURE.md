# Aqua Tracker - Refactored Architecture

A modular, well-organized water intake tracking application with user profiles and performance analytics.

## 📁 Project Structure

```
Aqua_Tracker/
├── index.html                 # Main HTML entry point
├── src/
│   ├── app.js                # Main app orchestration
│   ├── app.css               # Global app styles
│   │
│   ├── pages/
│   │   ├── setup/            # Profile setup page
│   │   │   ├── setup.js
│   │   │   └── setup.css
│   │   ├── today/            # Daily water tracking page
│   │   │   ├── today.js
│   │   │   └── today.css
│   │   └── trends/           # Performance progress page
│   │       ├── trends.js
│   │       └── trends.css
│   │
│   ├── profile/              # User profile management
│   │   ├── userProfile.js    # Profile class & localStorage
│   │   └── profile.css
│   │
│   └── shared/               # Shared utilities & constants
│       ├── constants.js      # App constants & enums
│       ├── icons.js          # SVG icons collection
│       └── utils.js          # Utility functions
│
├── README.md                 # This file
└── old_files/               # (Optional) Keep old files for reference
    ├── script.js
    ├── style.css
```

## 🎯 Key Features

### 1. **User Profile Management** (`src/profile/userProfile.js`)
- Create and save user profiles with personal metrics
- Store data to browser localStorage
- Load, update, and clear profiles
- Export/import profile data

**Profile Data Includes:**
- Personal info (name, age, gender)
- Physical metrics (weight, height)
- Activity level and lifestyle (caffeine, soda consumption)
- Environmental factors (climate, medical conditions)
- Auto-calculated daily hydration goal

### 2. **Setup Page** (`src/pages/setup/`)
- Initial profile configuration form
- Input validation
- Automatic hydration goal calculation
- Professional, accessible UI

### 3. **Today Page** (`src/pages/today/`)
- Real-time water intake tracking
- Visual progress indicator (water wave animation)
- Quick preset buttons (200ml, 350ml, 500ml, 750ml)
- Manual entry option
- Interactive radar chart showing bio-metrics
- Daily intake history with timestamps
- Delete individual entries

### 4. **Trends Page** (`src/pages/trends/`)
- 7-day performance history visualization
- Bar chart showing daily intake vs. goals
- Streak statistics (current & best)
- Daily efficiency averages
- Historical data analysis

## 🔧 How to Use

### Running the App
1. Open `index.html` in a modern web browser
2. Create a user profile with your personal metrics
3. Start logging water intake
4. View progress on Today and Trends pages

### Managing User Data
```javascript
// Import the user profile class
import { userProfile } from './src/profile/userProfile.js';

// Get current profile
const profile = userProfile.getProfile();

// Update profile
userProfile.updateProfile({ name: 'John Doe' });

// Export profile as JSON
const data = userProfile.exportProfile();

// Clear profile (logout)
userProfile.clearProfile();
```

### Adding Water Logs Programmatically
```javascript
// In the app context, add logs via the app instance
app.addLog(250, 'Water');           // 250ml water
app.addLog(100, 'Coffee');          // 100ml coffee
```

## 📊 Data Storage

All data is stored in **browser localStorage**:

- `hydrate_me_user_profile` - User profile data (JSON)
- `hydrate_me_intake_logs` - Water intake logs (JSON array)

Data persists across browser sessions automatically.

## 🎨 Styling Architecture

The app uses a consistent design system:

- **Colors:**
  - Primary: `#0891b2` (Cyan)
  - Secondary: `#64748b` (Slate)
  - Background: `#f8fafc` (Light blue)
  - Text: `#0f172a` (Navy)

- **Spacing:** Consistent 0.25rem, 0.5rem, 1rem, 1.5rem, 2.5rem units
- **Border Radius:** 0.5rem, 0.75rem, 1rem, 1.5rem
- **Responsive:** Mobile-first design with breakpoints at 640px, 768px

## 🔌 Module System

The app uses **ES6 Modules** for clean code organization:

### Core Modules:
- `app.js` - Main orchestration class
- `constants.js` - Configuration & enums
- `icons.js` - Reusable SVG components
- `utils.js` - Helper functions
- `userProfile.js` - Profile management

### Page Modules:
- `setup.js` - Profile setup logic & rendering
- `today.js` - Daily tracking logic & visualization
- `trends.js` - Analytics & charting

Each module is self-contained and has clear responsibilities.

## 📈 Hydration Goal Calculation

The app automatically calculates your daily hydration goal based on:

1. **Base metabolism:** Weight (kg) × Gender factor (35 for male, 31 for female)
2. **Exercise:** (Duration × Days/week ÷ 7) × 16.6 ml
3. **Caffeine intake:** Cups × 100 ml
4. **Soda consumption:** Cans × 150 ml
5. **Minimum:** 1200 ml

Formula: `Total = Base + Exercise + Caffeine + Soda` (min: 1200ml)

## 🔄 Data Flow

```
┌─────────────┐
│  index.html │
└──────┬──────┘
       │
       ├─> Load CSS (app, pages, profile)
       │
       └─> Load app.js (ES6 Module)
            │
            ├─> Import userProfile
            ├─> Import page modules (setup, today, trends)
            ├─> Import utilities & constants
            │
            └─> Initialize AquaTrackerApp
                 │
                 ├─> Load user profile from localStorage
                 ├─> Load intake logs from localStorage
                 │
                 ├─> Check if profile exists
                 │   ├─> No: Render setup page
                 │   └─> Yes: Render main app (today or trends)
                 │
                 └─> Bind event listeners
                     ├─> Navigation (today/trends tabs)
                     ├─> Profile setup form
                     ├─> Water intake buttons
                     ├─> Manual entry
                     └─> Delete entries
```

## 🚀 Future Enhancements

- [ ] Cloud sync with Firebase
- [ ] Mobile app version
- [ ] Integration with wearables
- [ ] Social features (friend challenges)
- [ ] Personalized recommendations
- [ ] Advanced analytics
- [ ] Dark mode
- [ ] Multi-language support

## 📝 Browser Compatibility

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Modern mobile browsers

**Note:** Uses ES6 Modules, which require a modern browser. Not compatible with IE11.

## 📄 License

This project is open source and available for personal use.

---

**Made with ❤️ for better hydration habits**
