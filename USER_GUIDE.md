# Aqua Tracker - User Guide

## Getting Started

### 1. First Time Setup
When you open the app for the first time, you'll see a profile configuration screen:

1. **Enter Your Information:**
   - Full Name
   - Age
   - Gender
   - Weight (and select kg or lbs)
   - Daily Activity Level
   - Caffeine consumption (cups per day)
   - Soda consumption (cans per day)
   - Current climate
   - Any clinical conditions (optional)

2. **View Your Daily Goal:**
   The app calculates your personalized daily hydration goal based on these metrics.

3. **Start Tracking:**
   Click "Initialize Plan" to save your profile and begin tracking.

---

## Daily Tracking (Today Tab)

### Logging Water Intake

#### Quick Log Buttons
Use preset amounts for quick logging:
- **Small Glass:** 200ml
- **Medium Glass:** 350ml
- **Large Bottle:** 500ml
- **XL Bottle:** 750ml

#### Manual Entry
For custom amounts:
1. Enter the amount in milliliters
2. The "Add" button becomes active
3. Click to log the intake

#### View Your Progress
- **Water Wave Indicator:** Shows your progress percentage
- **Current Total:** Displays total intake (e.g., 1.5L)
- **Daily Goal:** Your personalized goal target

### Bio-Metric Analysis
Real-time metrics based on your hydration level:
- **Energy:** Reflects your hydration impact on energy
- **Cognitive:** Focus and mental clarity metrics
- **Immune:** Immune system support indicator

### Viewing Your Logs
All entries for today are listed with:
- Time of intake
- Amount consumed
- Type (Water, Coffee, etc.)
- Delete button for corrections

---

## Performance Tracking (Progress Tab)

### 7-Day History Chart
A bar chart showing your intake for the last 7 days:
- **Blue bars:** Days you met your goal
- **Gray bars:** Days you didn't meet your goal

### Streak Statistics
- **Current Streak:** Days in a row you've met your goal
- **Best Record:** Your highest streak ever

### Daily Efficiency Average
- Shows your average daily intake
- Helps identify your hydration patterns

---

## Updating Your Profile

### Changing Your Profile
1. Click the **Settings icon** (gear) in the top right
2. Your profile form will appear
3. Modify any information
4. Click "Initialize Plan" to save changes

### Profile Information Saved
- Personal metrics
- Activity level
- Environmental factors
- Daily hydration goal (recalculated automatically)

---

## Understanding Your Daily Goal

Your daily goal is calculated using a scientifically-based formula:

$$\text{Daily Goal} = \text{Base} + \text{Exercise} + \text{Caffeine} + \text{Soda}$$

**Where:**
- **Base:** Weight (kg) × Gender Factor (M: 35, F: 31)
- **Exercise:** (Duration × Days/week ÷ 7) × 16.6
- **Caffeine:** Cups × 100ml (increases goal)
- **Soda:** Cans × 150ml (increases goal)
- **Minimum:** 1200ml guaranteed

**Example:**
- 70kg male, Light activity: ~2,450ml
- 60kg female, Very active: ~2,500ml+

---

## Tips for Success

### ✅ Best Practices
1. **Spread Throughout the Day:** Don't drink all at once
2. **Start Early:** Begin hydrating in the morning
3. **Track Regularly:** Log intake immediately after drinking
4. **Check Progress:** Review your daily and weekly stats
5. **Adjust Intake:** Increase on activity days

### 🚨 When to Drink More
- During/after exercise
- In hot/humid climates
- When consuming caffeine
- During illness or recovery
- At high altitude

### ⚠️ Warnings
- Excessive water intake (>4L/hour) can be harmful
- Listen to your body's thirst signals
- Medical conditions may require different hydration levels
- Consult a doctor if you have specific health concerns

---

## Data & Privacy

### Where Is My Data Stored?
All data is stored **locally in your browser** using localStorage:
- User profile
- Daily intake logs
- Statistics

**Benefits:**
- No server access required
- Private and secure
- Works offline
- Persistent across sessions

### Clearing Your Data
To reset everything:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find entries: `hydrate_me_user_profile` and `hydrate_me_intake_logs`
4. Delete them

---

## Troubleshooting

### Problem: Data Not Saving
**Solution:**
1. Check if cookies/localStorage are enabled
2. Try clearing browser cache
3. Refresh the page and try again
4. Use a different browser

### Problem: Can't See Charts
**Solution:**
1. Ensure JavaScript is enabled
2. Use a modern browser (Chrome, Firefox, Safari, Edge)
3. Check console for errors (F12)

### Problem: Goal Seems Too High/Low
**Solution:**
1. Verify your weight and height are correct
2. Check activity level selection
3. Review caffeine and soda intake
4. Update profile with accurate information

### Problem: Data Lost After Closing Browser
**Solution:**
1. Ensure localStorage is not disabled
2. Check browser privacy settings
3. Try disabling privacy mode/incognito
4. Export your data regularly as backup

---

## Advanced Features

### Exporting Your Data
View browser developer tools to see your stored data:
```javascript
// In browser console
localStorage.getItem('hydrate_me_user_profile')
localStorage.getItem('hydrate_me_intake_logs')
```

### Importing Data
You can manually add data to localStorage through console (advanced users).

---

## FAQ

**Q: What if I forget to log?**
A: Log it when you remember. The timestamp will show the actual time, not when you logged it.

**Q: Can I log different beverages?**
A: Yes! Manually enter the type (Coffee, Juice, etc.) and amount.

**Q: Does water from food count?**
A: This app tracks liquids only. Food water content is typically factored into the baseline calculation.

**Q: Can I change my goal manually?**
A: Currently, goals are auto-calculated. Reset your profile with different metrics to adjust.

**Q: Is there a mobile app?**
A: Not yet, but the web app is mobile-responsive!

---

## Contact & Support

For issues, suggestions, or feedback, refer to the main README.md file.

**Happy hydrating! 💧**
