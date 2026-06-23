// ===================== CONSTANTS =====================
const STORAGE_KEYS = {
  USER_PROFILE: 'aqua_tracker_user_profile',
  INTAKE_LOGS:  'aqua_tracker_intake_logs',
};

const INTAKE_PRESETS = [
  { label: 'Espresso Shot', amount: 200, emoji: '🥤', color: '#22d3ee' },
  { label: 'Medium Glass',  amount: 350, emoji: '🥛', color: '#06b6d4' },
  { label: 'Water Bottle',  amount: 500, emoji: '💧', color: '#0891b2' },
  { label: 'Sport Bottle',  amount: 750, emoji: '🍶', color: '#0e7490' },
];

// ===================== SVG ICONS =====================
const icons = {
  droplets: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  trash:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  plus:     `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  user:     `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  droplet:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6c-.5 2-2 4.3-4 6s-3 3.5-3 5.5a7 7 0 0 0 7 7z"/></svg>`,
  bolt:     `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  fire:     `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  target:   `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
};

// ===================== UTILS =====================
function getTodayKey() { return new Date().toISOString().split('T')[0]; }

function formatVolume(ml) {
  return ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`;
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getTodayLogs(allLogs) {
  const todayKey = getTodayKey();
  return allLogs.filter(l => new Date(l.timestamp).toISOString().startsWith(todayKey));
}

function showToast(msg) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

function calculateStreak(allLogs, dailyGoal) {
  if (!allLogs.length) return 0;
  const byDay = {};
  allLogs.forEach(l => {
    const d = new Date(l.timestamp).toISOString().split('T')[0];
    byDay[d] = (byDay[d] || 0) + l.amount;
  });
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if ((byDay[key] || 0) >= dailyGoal) streak++;
    else if (i > 0) break;
  }
  return streak;
}

// ===================== USER PROFILE =====================
class UserProfile {
  constructor() {
    this.profile = null;
    this.loadProfile();
  }
  loadProfile() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (saved) this.profile = JSON.parse(saved);
    return this.profile;
  }
  saveProfile(data) {
    this.profile = data;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(data));
    return this.profile;
  }
  getProfile()   { return this.profile; }
  hasProfile()   { return !!this.profile; }
  clearProfile() { this.profile = null; localStorage.removeItem(STORAGE_KEYS.USER_PROFILE); }
}
const userProfile = new UserProfile();

// ===================== SETUP PAGE =====================
function renderSetup(profile = {}) {
  const p = profile;
  return `<div class="setup-screen">
    <div class="setup-card">
      <div class="setup-header">
        <div class="setup-icon">${icons.droplets}</div>
        <h1 class="setup-title">Aqua Tracker</h1>
        <p class="setup-subtitle">Set up your daily hydration profile</p>
      </div>
      <form id="setup-form">
        <div class="form-section">
          <div class="form-section-label">${icons.user} Your Profile</div>
          <div class="form-grid-2" style="margin-bottom:0.875rem">
            <div>
              <span class="form-field-label">Full Name</span>
              <input class="form-input" type="text" name="name" required
                placeholder="Enter your name" value="${p.name || ''}">
            </div>
            <div>
              <span class="form-field-label">Age</span>
              <input class="form-input" type="number" name="age" min="1" max="120"
                placeholder="e.g. 21" value="${p.age || ''}">
            </div>
          </div>
          <div class="form-grid-2">
            <div>
              <span class="form-field-label">Gender</span>
              <select class="form-select" name="gender">
                <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                <option value="Other" ${p.gender === 'Other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            <div>
              <span class="form-field-label">Body Weight</span>
              <div class="form-inline">
                <input class="form-input" type="number" name="weight"
                  placeholder="80" value="${p.weight || ''}">
                <select class="form-select" name="weightUnit" style="width:auto;flex-shrink:0">
                  <option value="kg" ${p.weightUnit !== 'lbs' ? 'selected' : ''}>kg</option>
                  <option value="lbs" ${p.weightUnit === 'lbs' ? 'selected' : ''}>lbs</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-label">${icons.target} Daily Goal</div>
          <div>
            <span class="form-field-label">Target (ml per day)</span>
            <div style="display:flex;gap:0.5rem;align-items:center">
              <input class="form-input" type="number" name="dailyGoal" id="goal-input"
                placeholder="e.g. 3000" value="${p.dailyGoal || 3000}" min="500" max="8000">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-top:0.875rem">
            ${[2000,2500,3000,3500,4000,4500].map(g => `
              <button type="button" class="goal-preset-chip ${(p.dailyGoal||3000) === g ? 'active' : ''}"
                data-goal="${g}" onclick="document.getElementById('goal-input').value='${g}';
                  document.querySelectorAll('.goal-preset-chip').forEach(c=>c.classList.remove('active'));
                  this.classList.add('active')">
                ${formatVolume(g)}
              </button>`).join('')}
          </div>
        </div>

        <button type="submit" class="setup-form-button" id="setup-submit-btn">
          ${icons.droplets} Start Tracking
        </button>
      </form>
    </div>
  </div>

  <style>
    .goal-preset-chip {
      padding: 0.5rem;
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(34,211,238,0.18);
      border-radius: 0.625rem;
      color: #94a3b8;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }
    .goal-preset-chip:hover {
      border-color: rgba(34,211,238,0.35);
      color: #22d3ee;
      background: rgba(34,211,238,0.08);
    }
    .goal-preset-chip.active {
      border-color: rgba(34,211,238,0.5);
      color: #22d3ee;
      background: rgba(34,211,238,0.12);
    }
  </style>`;
}

function bindSetupEvents(onSubmit) {
  const form = document.getElementById('setup-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const btn = document.getElementById('setup-submit-btn');
    btn.textContent = '✓ Saved!';
    btn.style.background = 'linear-gradient(135deg, #059669, #047857)';

    const data = {
      name:       fd.get('name') || 'Hydration Hero',
      age:        parseInt(fd.get('age')) || 25,
      gender:     fd.get('gender'),
      weight:     parseFloat(fd.get('weight')) || 70,
      weightUnit: fd.get('weightUnit'),
      dailyGoal:  parseInt(fd.get('dailyGoal')) || 3000,
    };
    setTimeout(() => onSubmit && onSubmit(data), 400);
  });
}

// ===================== MAIN APP RENDER =====================
function renderApp(logs, profile) {
  const todayLogs  = getTodayLogs(logs);
  const todayTotal = todayLogs.reduce((a, l) => a + l.amount, 0);
  const progressPct = Math.min((todayTotal / profile.dailyGoal) * 100, 100);
  const fillPct    = progressPct;
  const remaining  = Math.max(profile.dailyGoal - todayTotal, 0);
  const streak     = calculateStreak(logs, profile.dailyGoal);
  const goalReached = todayTotal >= profile.dailyGoal;

  return `<div class="app">
    <!-- HEADER -->
    <header class="header glass-panel">
      <div class="header-left">
        <div class="header-logo">${icons.droplets}</div>
        <div>
          <h1 class="header-title">Aqua Tracker</h1>
          <p class="header-status">👤 ${profile.name}</p>
        </div>
      </div>
      <div class="header-right">
        <button class="btn-icon" id="btn-settings" title="Reset Profile">${icons.settings}</button>
      </div>
    </header>

    <main class="main">
      <!-- STATS BAR -->
      <div class="stats-bar">
        <div class="stat-card">
          <div class="stat-value">${formatVolume(todayTotal)}</div>
          <div class="stat-label">Today</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${formatVolume(remaining)}</div>
          <div class="stat-label">Remaining</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${streak > 0 ? '🔥' : ''}${streak}</div>
          <div class="stat-label">Day Streak</div>
        </div>
      </div>

      ${goalReached ? `
      <div class="goal-reached-banner">
        <div class="goal-reached-icon">🎉</div>
        <div>
          <div class="goal-reached-title">Goal Reached!</div>
          <div class="goal-reached-sub">You've hit ${formatVolume(profile.dailyGoal)} today</div>
        </div>
      </div>` : ''}

      <!-- WATER SPHERE -->
      <div class="section">
        <div class="progress-center">
          <div class="water-wave-wrap">
            <div class="water-wave-glow"></div>
            <div class="water-wave">
              <div class="water-fill" id="water-fill-el"
                style="transform: translateY(calc(100% - ${fillPct}%))">
              </div>
              <div class="water-content">
                <div class="water-label">Hydration</div>
                <div class="water-percent">
                  <div class="water-percent-num" id="pct-num">${Math.round(progressPct)}</div>
                  <div class="water-percent-sym">%</div>
                </div>
                <div class="water-sub">${formatVolume(todayTotal)} / ${formatVolume(profile.dailyGoal)}</div>
              </div>
            </div>
          </div>

          <!-- Linear progress bar -->
          <div class="progress-bar-wrap">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${fillPct}%"></div>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;width:100%;margin-top:0.3rem">
            <span style="font-size:0.68rem;color:#475569">0ml</span>
            <span style="font-size:0.68rem;color:#22d3ee;font-weight:600">${Math.round(progressPct)}% complete</span>
            <span style="font-size:0.68rem;color:#475569">${formatVolume(profile.dailyGoal)}</span>
          </div>
        </div>
      </div>

      <!-- QUICK ADD PRESETS -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">Quick Add</h3>
        </div>
        <div class="preset-grid">
          ${INTAKE_PRESETS.map(p => `
            <button type="button" class="preset-btn" data-amount="${p.amount}" id="preset-${p.amount}">
              <div class="preset-btn-icon">${p.emoji}</div>
              <span class="preset-btn-label">${p.label}</span>
              <span class="preset-btn-amount">+${p.amount}ml</span>
            </button>`).join('')}
        </div>
      </div>

      <!-- CUSTOM INTAKE -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">Custom Amount</h3>
        </div>
        <div class="custom-input-wrap">
          <input class="custom-input" type="number" id="custom-amount"
            placeholder="Enter ml (e.g. 420)" min="1" max="5000">
          <button class="btn-add-custom" id="btn-custom-add">
            ${icons.plus} Add
          </button>
        </div>
      </div>

      <div class="divider"></div>

      <!-- LOG LIST -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">Today's Log</h3>
          <span style="font-size:0.72rem;color:#475569">${todayLogs.length} entr${todayLogs.length === 1 ? 'y' : 'ies'}</span>
        </div>
        <div class="log-list" id="log-list">
          ${todayLogs.length === 0
            ? `<div class="log-empty">
                <div class="log-empty-icon">💧</div>
                <div>No intake recorded yet</div>
                <div style="font-size:0.75rem;margin-top:0.3rem;color:#334155">Tap a preset above to get started</div>
               </div>`
            : todayLogs.map((log, i) => `
              <div class="log-item" data-id="${log.id}" style="animation-delay:${i * 0.05}s">
                <div class="log-item-left">
                  <div class="log-dot"></div>
                  <div>
                    <div class="log-amount">${formatVolume(log.amount)}</div>
                    <div class="log-time">${formatTime(log.timestamp)}</div>
                  </div>
                </div>
                <button class="log-delete btn-delete" data-id="${log.id}" title="Remove entry">
                  ${icons.trash}
                </button>
              </div>`).join('')
          }
        </div>
      </div>
    </main>
  </div>`;
}

// ===================== INTAKE LOGS CLASS =====================
class IntakeLogs {
  constructor() {
    this.logs = [];
    this.loadLogs();
  }

  loadLogs() {
    const saved = localStorage.getItem(STORAGE_KEYS.INTAKE_LOGS);
    this.logs = saved ? JSON.parse(saved) : [];
  }

  saveLogs() {
    localStorage.setItem(STORAGE_KEYS.INTAKE_LOGS, JSON.stringify(this.logs));
  }

  addLog(amount) {
    const intAmount = parseInt(amount);
    if (!intAmount || intAmount <= 0 || intAmount > 5000) return;
    this.logs.unshift({
      id: Math.random().toString(36).substr(2, 9),
      amount: intAmount,
      timestamp: Date.now(),
    });
    this.saveLogs();
    this.render();
    showToast(`+${formatVolume(intAmount)} added 💧`);
  }

  removeLog(id) {
    this.logs = this.logs.filter(l => l.id !== id);
    this.saveLogs();
    this.render();
    showToast('Entry removed');
  }

  render() {
    const app = document.getElementById('app');
    const profile = userProfile.getProfile();

    if (!profile) {
      app.innerHTML = renderSetup();
      bindSetupEvents(data => {
        userProfile.saveProfile(data);
        this.render();
        showToast(`Welcome, ${data.name}! Let's stay hydrated 💧`);
      });
      return;
    }

    app.innerHTML = renderApp(this.logs, profile);
    this._bindEvents();
  }

  _bindEvents() {
    // Settings / reset
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      if (confirm('Reset your profile? Your log history will be kept.')) {
        userProfile.clearProfile();
        this.render();
      }
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.style.transform = 'scale(0.94)';
        setTimeout(() => { btn.style.transform = ''; }, 150);
        this.addLog(parseInt(btn.dataset.amount));
      });
    });

    // Custom add button
    document.getElementById('btn-custom-add')?.addEventListener('click', () => {
      const input = document.getElementById('custom-amount');
      const val = parseInt(input.value);
      if (!val || val <= 0) {
        input.style.borderColor = 'rgba(239,68,68,0.6)';
        input.focus();
        setTimeout(() => { input.style.borderColor = ''; }, 800);
        return;
      }
      this.addLog(val);
      input.value = '';
    });

    // Custom input enter key
    document.getElementById('custom-amount')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('btn-custom-add')?.click();
    });

    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.log-item');
        if (item) {
          item.style.opacity = '0';
          item.style.transform = 'translateX(20px)';
          item.style.transition = 'all 0.25s ease';
        }
        setTimeout(() => this.removeLog(btn.dataset.id), 220);
      });
    });
  }

  init() { this.render(); }
}

// ===================== BOOT =====================
document.addEventListener('DOMContentLoaded', () => {
  const app = new IntakeLogs();
  app.init();
});