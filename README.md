# Aqua Tracker

A smart, minimal water intake tracker. Log daily hydration, maintain streaks, and view your 7-day progress — all in the browser with no build step.

## Features

- Daily water tracking with animated progress ring
- Quick-log presets and custom amounts
- Personalized daily goal from your profile
- Streak tracking (current and best)
- 7-day performance chart
- Data saved locally in your browser (localStorage)

## Files

This project is intentionally simple — three files:

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `style.css` | All styling |
| `script.js` | App logic, charts, localStorage |

## Run locally

Open `index.html` in any browser, or serve the folder with any static server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

No `npm install` or build step required.

## Deploy

Upload the three files to any static host (GitHub Pages, Netlify, Vercel, etc.).