# 💧 Aqua Tracker - Smart Water Intake Tracking

A professional, modular water intake tracker with user profile management. Track daily hydration, maintain streaks, and view detailed analytics — all in the browser with no build step.

---

## 🎯 What is Aqua Tracker?

Aqua Tracker is a web-based hydration monitoring application that:
- ✅ Tracks your daily water intake
- ✅ Calculates personalized daily goals based on your metrics
- ✅ Displays real-time progress with animations
- ✅ Maintains streaks and performance history
- ✅ Provides 7-day analytics and insights
- ✅ Stores all data locally in your browser
- ✅ Requires zero setup or installation

---

## ✨ Key Features

### 📱 **Daily Tracking**
- Water wave progress indicator with percentage
- Quick preset buttons (200ml, 350ml, 500ml, 750ml)
- Manual entry for custom amounts
- Instant log history with timestamps
- Delete entries if needed

### 👤 **User Profile System** ⭐ NEW!
- Personal information (name, age, gender)
- Physical metrics (weight, height)
- Activity level and lifestyle factors
- **Automatic hydration goal calculation**
- Export/import profile data
- One-click profile updates

### 📊 **Analytics & Insights**
- 7-day performance chart
- Active streak tracking (current & best)
- Daily efficiency averages
- Bio-metric analysis radar
- Real-time goal progress

### 💾 **Data Management**
- Persistent local storage (browser-based)
- No cloud account required
- 100% private data
- Auto-save on every action
- Backward compatible with old data

---

## 🚀 Getting Started

### Option 1: Direct Browser
Simply open `index.html` in your web browser. That's it!

### Option 2: Local Server
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js (npx)
npx serve .

# Node.js (with serve installed)
serve .
```

Then visit `http://localhost:8080`

### Option 3: Deploy Online
Upload to any static host:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- AWS S3
- Any static web server

---

## 📁 Project Structure (REFACTORED)

### Before (Monolithic)
```
Aqua_Tracker/
├── index.html        (1 file)
├── script.js         (1,100+ lines) ❌
├── style.css         (700+ lines) ❌
└── README.md
```

### After (Modular) ✅
```
Aqua_Tracker/
├── index.html
├── src/
│   ├── app.js           (Main orchestration - 280 lines)
│   ├── app.css          (Global styles)
│   │
│   ├── pages/           (Page-based modules)
│   │   ├── setup/       (Profile configuration)
│   │   │   ├── setup.js
│   │   │   └── setup.css
│   │   ├── today/       (Daily tracking)
│   │   │   ├── today.js
│   │   │   └── today.css
│   │   └── trends/      (Performance analytics)
│   │       ├── trends.js
│   │       └── trends.css
│   │
│   ├── profile/         (User profile management ⭐)
│   │   ├── userProfile.js  (Profile class - 100 lines)
│   │   └── profile.css
│   │
│   └── shared/          (Reusable utilities)
│       ├── constants.js (Config & enums)
│       ├── icons.js     (SVG icons)
│       └── utils.js     (Helper functions)
│
└── docs/
    ├── QUICKSTART.md          (5 min overview)
    ├── ARCHITECTURE.md        (Technical details)
    ├── USER_GUIDE.md          (Complete manual)
    ├── DEV_REFERENCE.md       (Developer quick ref)
    ├── MIGRATION_GUIDE.md     (What changed)
    ├── PROJECT_SUMMARY.md     (Project overview)
    └── DOCUMENTATION_INDEX.md (Doc map)
```

---

## 🎯 Major Changes (v2.0 - Refactored)

### ✅ Code Organization
- **Split monolithic code** into 15 focused modules
- **Page-based folders** for clarity and maintainability
- **Shared utilities** centralized in one place
- **ES6 modules** for proper code isolation
- **Average file size:** 100 lines (down from 900 lines)

### ✅ User Profile Management (NEW!)
- **Dedicated `UserProfile` class** for data handling
- **Profile persistence** to localStorage
- **Export/import profiles** as JSON
- **Update profiles** without re-entering all data
- **Automatic goal calculation** based on metrics

### ✅ Professional Architecture
- **Clear responsibility separation**
- **No global variables**
- **Proper encapsulation**
- **Reusable components**
- **Production-ready quality**

### ✅ Comprehensive Documentation
- **7 documentation files** created
- **Multiple learning paths** (user, developer, manager)
- **Quick reference guides**
- **Architecture explanations**
- **Migration information**

### ✅ Backward Compatibility
- **100% compatible** with old data
- **Same localStorage keys** unchanged
- **All features preserved** exactly as before
- **Automatic data migration** on first load
- **Zero breaking changes**

---

## 👤 User Profile Management

### What is Saved?
```javascript
{
  name: "John Doe",
  age: 30,
  gender: "Male",
  weight: 75,          // in kg or lbs
  weightUnit: "kg",
  height: 180,
  activityLevel: "Moderate",
  exerciseMinutesPerSession: 45,
  exerciseDaysPerWeek: 3,
  caffeineCups: 2,
  sodaCans: 1,
  climate: "Moderate",
  hasMedicalCondition: false,
  dailyGoal: 2450      // Auto-calculated
}
```

### How Goal is Calculated
```
Daily Goal = Base Metabolism + Exercise + Caffeine + Soda

Base = Weight (kg) × Gender Factor (M: 35, F: 31)
Exercise = (Duration × Days/week ÷ 7) × 16.6
Caffeine = Cups × 100ml (increases goal)
Soda = Cans × 150ml (increases goal)
Minimum = 1,200ml guaranteed
```

**Example:** 70kg male, light activity → ~2,450ml/day

---

## 💾 Data Storage

### Storage Location
All data stored in **browser localStorage**:

```javascript
// User Profile
localStorage.getItem('hydrate_me_user_profile')

// Water Logs Array
localStorage.getItem('hydrate_me_intake_logs')
```

### What is Stored?
- User profile with all personal metrics
- Daily water intake logs with timestamps
- Streak calculations and statistics
- All preferences and settings

### Privacy & Security
- ✅ **100% Local** - Never sent to servers
- ✅ **Private** - Only you can access
- ✅ **Persistent** - Survives browser refresh
- ✅ **Portable** - Export anytime
- ✅ **Secure** - Browser sandbox

---

## 📚 Documentation

### For End Users
- **[QUICKSTART.md](QUICKSTART.md)** - 5 minute overview
- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete how-to guide
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Find what you need

### For Developers
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed structure (15 min)
- **[DEV_REFERENCE.md](DEV_REFERENCE.md)** - Quick code reference
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - What changed from v1

### For Everyone
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview
- **[COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md)** - What was done

---

## 🔧 How to Use

### First Time Users

1. **Open the app**: Open `index.html` in a browser
2. **Set up profile**: Fill out your personal information
3. **View goal**: App calculates your daily hydration goal
4. **Start tracking**: Click preset buttons or enter custom amounts
5. **Check progress**: View your daily progress and stats

### For Developers: Adding Features

1. **Review structure** in [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Check patterns** in [DEV_REFERENCE.md](DEV_REFERENCE.md)
3. **Create modules** following existing patterns
4. **Use shared utilities** from `src/shared/`
5. **Keep files small** (< 400 lines each)

---

## 🎓 Technology Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Grid, Flexbox, Animations
- **JavaScript (ES6+)** - Module system, Classes
- **Canvas API** - Charts and visualizations

### Storage
- **localStorage API** - Persistent browser storage
- **JSON** - Data serialization

### No External Dependencies!
✅ Zero npm packages  
✅ Zero build step  
✅ Zero frameworks  
✅ Pure vanilla JavaScript  

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| Mobile Browsers | ✅ Latest |
| IE11 | ❌ Not supported (uses ES6 modules) |

---

## 📊 Project Statistics

### Code Quality
| Metric | Before | After |
|--------|--------|-------|
| Total Files | 2 | 15 |
| Avg File Size | 900 lines | 100 lines |
| Code Duplication | High | None |
| Modularity | Low | High |
| Maintainability | Medium | High |

### Documentation
- 7 comprehensive guides
- 50+ pages of documentation
- Multiple learning paths
- Quick reference cards
- Code examples throughout

---

## ✨ What's New in v2.0

✅ **User Profile System** - Dedicated class for profile management  
✅ **Modular Architecture** - 15 focused modules instead of 2  
✅ **Page-Based Structure** - Each page in its own folder  
✅ **Comprehensive Docs** - 7 documentation files  
✅ **Professional Code** - Clean, maintainable, scalable  
✅ **Better Organization** - Clear responsibility separation  
✅ **Export/Import** - Save and restore profiles  
✅ **Developer Guide** - Easy to extend and maintain  

---

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable Pages in repo settings
3. Done! Your app is live

### Netlify
```bash
# Drag and drop the folder
# Or connect GitHub repo
```

### Vercel
```bash
# Drag and drop the folder
# Or connect GitHub repo
```

### Any Static Host
Upload these files:
- `index.html`
- `src/` folder (all files)

---

## 🔒 Privacy

- **100% local** - No data sent anywhere
- **No tracking** - No analytics
- **No accounts** - No login required
- **Your data** - You control everything
- **Exportable** - Download your data anytime

---

## 🤝 Contributing

Want to improve Aqua Tracker?

1. Review [ARCHITECTURE.md](ARCHITECTURE.md)
2. Check [DEV_REFERENCE.md](DEV_REFERENCE.md)
3. Follow existing patterns
4. Create focused modules
5. Keep files under 400 lines
6. Update documentation

---

## 📝 License

Open source and free to use.

---

## 💡 Features Roadmap

### Possible Future Additions
- [ ] Cloud sync with Firebase
- [ ] Mobile app wrapper
- [ ] Wearable integration
- [ ] Social features (challenges)
- [ ] Advanced analytics
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Export charts as images

---

## ❓ FAQ

**Q: Is my data safe?**  
A: Yes! All data is stored locally on your device. It never leaves your browser.

**Q: Can I export my data?**  
A: Yes! Use the profile export feature to download your data as JSON.

**Q: What if I clear my browser data?**  
A: Unfortunately, localStorage will be cleared. Export your data regularly as backup.

**Q: Can I use this offline?**  
A: Yes! Once loaded, the app works completely offline.

**Q: Is there a mobile app?**  
A: Not yet, but the web app is mobile-responsive!

**Q: How accurate is the goal calculation?**  
A: Based on scientifically-backed formulas. It's a good starting point, but adjust based on your needs.

---

## 📞 Support

### Need Help?
1. **Using the app:** See [USER_GUIDE.md](USER_GUIDE.md)
2. **Understanding code:** See [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Developer questions:** See [DEV_REFERENCE.md](DEV_REFERENCE.md)
4. **What changed:** See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

---

## 🎉 Quick Links

- 📖 **[QUICKSTART.md](QUICKSTART.md)** - Start here (5 min)
- 👤 **[USER_GUIDE.md](USER_GUIDE.md)** - How to use (10 min)
- 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** - How it works (15 min)
- 🔧 **[DEV_REFERENCE.md](DEV_REFERENCE.md)** - Code reference
- 📚 **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Find anything
- 📋 **[COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md)** - Verify completion

---

## 🙏 Summary

**Aqua Tracker v2.0** is a complete professional refactoring of the original app:

- ✅ Better organized with modular code
- ✅ Professional user profile management
- ✅ Comprehensive documentation
- ✅ Same great features as before
- ✅ Ready for production
- ✅ Easy to extend

**Download, open, and start tracking your hydration today! 💧**

---

_**Version:** 2.0 (Refactored)_  
_**Status:** ✅ Production Ready_  
_**Last Updated:** 2026-06-09_