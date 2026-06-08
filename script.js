(function () {
  'use strict';

  const STORAGE_KEYS = {
    USER_PROFILE: 'hydrate_me_user_profile',
    INTAKE_LOGS: 'hydrate_me_intake_logs',
  };

  const INTAKE_PRESETS = [
    { label: 'Small Glass', amount: 200, icon: 'glass-sm' },
    { label: 'Medium Glass', amount: 350, icon: 'glass-md' },
    { label: 'Large Bottle', amount: 500, icon: 'droplet' },
    { label: 'Large Bottle XL', amount: 750, icon: 'droplet-lg' },
  ];

  const Gender = { MALE: 'Male', FEMALE: 'Female', OTHER: 'Other' };
  const WeightUnit = { KG: 'kg', LBS: 'lbs' };
  const ActivityLevel = { SEDENTARY: 'Sedentary', LIGHT: 'Light', MODERATE: 'Moderate', ACTIVE: 'Very Active' };
  const Climate = { HOT_HUMID: 'Hot/Humid', MODERATE: 'Moderate', COLD: 'Cold', HIGH_ALTITUDE: 'High Altitude' };

  let profile = null;
  let logs = [];
  let activeTab = 'today';

  // ── Icons (inline SVG) ──────────────────────────────────────────
  const icons = {
    droplets: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    history: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    flame: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    flameLg: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    activity: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.94a2 2 0 0 1-1.94 1.48h-2.65a2 2 0 0 1-1.94-1.48L7.24 2.57a2 2 0 0 0-1.93-1.46H3"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    coffee: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
    cloud: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>',
    glassSm: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.8 17.21A2 2 0 0 1 15.2 22Z"/><path d="M6 12a6 6 0 0 0 12 0"/></svg>',
    glassMd: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.8 17.21A2 2 0 0 1 15.2 22Z"/><path d="M6 12a6 6 0 0 0 12 0"/></svg>',
    droplet: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6c-.5 2-2 4.3-4 6s-3 3.5-3 5.5a7 7 0 0 0 7 7z"/></svg>',
    dropletLg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6c-.5 2-2 4.3-4 6s-3 3.5-3 5.5a7 7 0 0 0 7 7z"/></svg>',
    zap: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
    brain: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9333ea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  };

  function presetIcon(name) {
    const map = { 'glass-sm': icons.glassSm, 'glass-md': icons.glassMd, droplet: icons.droplet, 'droplet-lg': icons.dropletLg };
    return map[name] || icons.droplet;
  }

  // ── Calculations ──────────────────────────────────────────────
  function calculateHydrationGoal(p) {
    const weight = p.weight ?? 70;
    const weightUnit = p.weightUnit ?? WeightUnit.KG;
    const gender = p.gender ?? Gender.MALE;
    const exerciseMinutesPerSession = p.exerciseMinutesPerSession ?? 0;
    const exerciseDaysPerWeek = p.exerciseDaysPerWeek ?? 0;
    const caffeineCups = p.caffeineCups ?? 0;
    const sodaCans = p.sodaCans ?? 0;

    const weightInKg = weightUnit === WeightUnit.LBS ? weight * 0.453592 : weight;
    const baseFactor = gender === Gender.MALE ? 35 : 31;
    let total = weightInKg * baseFactor;
    const dailyAverageWorkout = (exerciseMinutesPerSession * exerciseDaysPerWeek) / 7;
    total += dailyAverageWorkout * 16.6;
    total += caffeineCups * 100;
    total += sodaCans * 150;
    return Math.max(1200, Math.round(total));
  }

  function getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }

  function formatVolume(ml) {
    return ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`;
  }

  function calculateStreaks(allLogs, dailyGoal) {
    if (allLogs.length === 0) return { currentStreak: 0, bestStreak: 0 };

    const dailyTotals = new Map();
    allLogs.forEach((log) => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      dailyTotals.set(date, (dailyTotals.get(date) || 0) + log.amount);
    });

    const sortedDates = Array.from(dailyTotals.keys()).sort();
    if (sortedDates.length === 0) return { currentStreak: 0, bestStreak: 0 };

    let bestStreak = 0;
    let tempStreak = 0;
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date();
    const checkDate = new Date(startDate);

    while (checkDate <= endDate) {
      const dateKey = checkDate.toISOString().split('T')[0];
      if ((dailyTotals.get(dateKey) || 0) >= dailyGoal) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }

    const today = getTodayKey();
    let currentStreak = 0;
    const activeDate = new Date();
    if ((dailyTotals.get(today) || 0) < dailyGoal) {
      activeDate.setDate(activeDate.getDate() - 1);
    }
    while ((dailyTotals.get(activeDate.toISOString().split('T')[0]) || 0) >= dailyGoal) {
      currentStreak++;
      activeDate.setDate(activeDate.getDate() - 1);
      if (currentStreak > 1000) break;
    }

    return { currentStreak, bestStreak };
  }

  function getHistoryData() {
    if (!profile) return [];
    const map = new Map();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    last7Days.forEach((date) => map.set(date, 0));
    logs.forEach((log) => {
      const dateKey = new Date(log.timestamp).toISOString().split('T')[0];
      if (map.has(dateKey)) map.set(dateKey, map.get(dateKey) + log.amount);
    });
    return Array.from(map.entries()).map(([date, total]) => ({
      date,
      total,
      goal: profile.dailyGoal,
    }));
  }

  // ── Charts ────────────────────────────────────────────────────
  function drawRadarChart(canvas, percentage) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.38;
    const labels = ['Cellular Vol', 'Metabolism', 'Focus', 'Kidney Filter', 'ATP Energy'];
    const values = [
      percentage,
      Math.max(20, percentage * 0.9),
      Math.max(10, percentage * 0.8),
      percentage >= 50 ? 90 : percentage + 20,
      Math.max(30, percentage * 0.95),
    ];
    const n = labels.length;

    ctx.clearRect(0, 0, w, h);

    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      const r = (radius / 4) * ring;
      for (let i = 0; i <= n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();
    }

    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();
    }

    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
      const r = (values[idx] / 100) * radius;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const lx = cx + (radius + 20) * Math.cos(angle);
      const ly = cy + (radius + 20) * Math.sin(angle);
      ctx.fillText(labels[i], lx, ly + 3);
    }
  }

  function drawBarChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 10, bottom: 30, left: 10, right: 10 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const maxVal = Math.max(...data.map((d) => Math.max(d.total, d.goal)), 1000) * 1.1;
    const barWidth = Math.min(16, chartW / data.length * 0.4);
    const gap = chartW / data.length;

    ctx.clearRect(0, 0, w, h);

    data.forEach((item, i) => {
      const barH = (item.total / maxVal) * chartH;
      const x = padding.left + gap * i + (gap - barWidth) / 2;
      const y = padding.top + chartH - barH;
      const met = item.total >= item.goal;

      ctx.fillStyle = met ? '#0891b2' : '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, 4);
      ctx.fill();

      const day = new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' });
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day, x + barWidth / 2, h - 8);
    });
  }

  // ── Render helpers ────────────────────────────────────────────
  function streakBadge(count, size) {
    if (count === 0 && size === 'sm') return '';
    if (size === 'lg') {
      return `<div class="streak-lg">
        <div class="streak-lg-icon">${icons.flameLg}</div>
        <div><span class="streak-lg-count">${count}</span>
        <p class="streak-lg-label">Active Day Streak</p></div>
      </div>`;
    }
    return `<div class="streak-sm">${icons.flame}<span class="streak-count">${count}</span><span style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Days</span></div>`;
  }

  function renderSetup() {
    const p = profile || {};
    return `<div class="setup-screen">
      <div class="setup-card scrollbar-hide">
        <div class="setup-header">
          <div class="setup-icon">${icons.activity}</div>
          <h2 class="setup-title">Profile Configuration</h2>
          <p class="setup-subtitle">Enter your biological metrics for precision calculation.</p>
        </div>
        <form id="setup-form">
          <div class="form-section">
            <label class="form-section-label">${icons.user} Identity & Vitality</label>
            <div class="form-grid-2" style="margin-bottom:1rem">
              <input class="form-input" type="text" name="name" required placeholder="Full Name" value="${p.name || ''}">
              <input class="form-input" type="number" name="age" placeholder="Age" value="${p.age || 25}">
            </div>
            <div class="form-grid-2">
              <select class="form-select" name="gender">
                <option value="Male" ${(p.gender || Gender.MALE) === Gender.MALE ? 'selected' : ''}>Male</option>
                <option value="Female" ${p.gender === Gender.FEMALE ? 'selected' : ''}>Female</option>
                <option value="Other" ${p.gender === Gender.OTHER ? 'selected' : ''}>Other</option>
              </select>
              <div class="form-inline">
                <input class="form-input" type="number" name="weight" placeholder="Weight" value="${p.weight || 70}">
                <select class="form-select" name="weightUnit">
                  <option value="kg" ${(p.weightUnit || WeightUnit.KG) === WeightUnit.KG ? 'selected' : ''}>kg</option>
                  <option value="lbs" ${p.weightUnit === WeightUnit.LBS ? 'selected' : ''}>lbs</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-section">
            <label class="form-section-label">${icons.activity} Metabolism & Active Load</label>
            <div class="form-grid-2">
              <div>
                <span class="form-field-label">Daily Activity</span>
                <select class="form-select" name="activityLevel">
                  <option value="Sedentary">Sedentary</option>
                  <option value="Light" ${(p.activityLevel || ActivityLevel.LIGHT) === ActivityLevel.LIGHT ? 'selected' : ''}>Lightly Active</option>
                  <option value="Moderate">Moderately Active</option>
                  <option value="Very Active">Very Active</option>
                </select>
              </div>
              <div>
                <span class="form-field-label">Caffeine Frequency (Cups)</span>
                <div class="form-icon-row">${icons.coffee}<input type="number" name="caffeineCups" value="${p.caffeineCups ?? 1}"></div>
              </div>
              <div>
                <span class="form-field-label">Soda Consumption (Cans)</span>
                <div class="form-icon-row">${icons.activity.replace('width="32"','width="18"').replace('height="32"','height="18"')}<input type="number" name="sodaCans" value="${p.sodaCans ?? 0}"></div>
              </div>
            </div>
          </div>
          <div class="form-section">
            <label class="form-section-label">${icons.cloud} Environmental Constants</label>
            <div class="form-grid-2">
              <div>
                <span class="form-field-label">Current Climate</span>
                <select class="form-select" name="climate">
                  <option value="Moderate" selected>Moderate</option>
                  <option value="Hot/Humid">Hot/Humid</option>
                  <option value="Cold">Cold</option>
                  <option value="High Altitude">High Altitude</option>
                </select>
              </div>
              <div class="checkbox-row">
                <div class="checkbox-icon ${p.hasMedicalCondition ? 'active' : ''}" id="med-icon">${icons.heart}</div>
                <div class="checkbox-info">
                  <p>Clinical Conditions</p>
                  <p>Impact factor</p>
                </div>
                <input type="checkbox" name="hasMedicalCondition" ${p.hasMedicalCondition ? 'checked' : ''}>
              </div>
            </div>
          </div>
          <button type="submit" class="btn-primary">Initialize Plan <span style="width:24px;height:1px;background:rgba(255,255,255,0.3);display:inline-block"></span></button>
        </form>
      </div>
    </div>`;
  }

  function renderToday(todayTotal, progressPct, todayLogs, streakStats) {
    const fillLevel = 100 - Math.min(100, Math.max(0, progressPct));
    const percentage = Math.min((todayTotal / profile.dailyGoal) * 100, 100);

    const presets = INTAKE_PRESETS.map(
      (preset, idx) => `<button class="preset-btn" data-preset="${idx}">
        <div class="preset-icon">${presetIcon(preset.icon)}</div>
        <div><span class="preset-amount">${preset.amount}ml</span>
        <span class="preset-label">${preset.label}</span></div>
      </button>`
    ).join('');

    const logItems = todayLogs.length === 0
      ? '<div class="log-empty">Waiting for your first sip...</div>'
      : todayLogs.map((log) => `<div class="log-item">
          <div class="log-item-left">
            <div class="log-icon">${icons.droplets}</div>
            <div>
              <div class="log-amount">+${log.amount}ml</div>
              <div class="log-meta">${new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${log.type}</div>
            </div>
          </div>
          <button class="btn-delete" data-delete="${log.id}">${icons.trash}</button>
        </div>`).join('');

    return `<div class="tab-content">
      <div class="progress-center">
        <div class="water-wave-wrap">
          <div class="water-wave-glow"></div>
          <div class="water-wave">
            <div class="water-fill" style="transform:translateY(${fillLevel}%)">
              <div class="water-surface"></div>
              <div class="water-body"></div>
            </div>
            <div class="water-content">
              <span class="water-label">Progress</span>
              <div class="water-percent">
                <span class="water-percent-num">${Math.round(Math.min(100, Math.max(0, progressPct)))}</span>
                <span class="water-percent-sym">%</span>
              </div>
            </div>
            <div class="water-reflection"></div>
          </div>
        </div>
        <div class="intake-display">
          <div class="intake-total">${formatVolume(todayTotal)}</div>
          <div class="intake-goal-row">
            <div class="intake-goal-line"></div>
            <p class="intake-goal-text">Goal: ${formatVolume(profile.dailyGoal)}</p>
            <div class="intake-goal-line"></div>
          </div>
        </div>
      </div>

      <section class="section">
        <div class="section-header"><div class="section-bar"></div><h3 class="section-title">Quick Log</h3></div>
        <div class="preset-grid">${presets}</div>
      </section>

      <section class="section">
        <div class="section-header"><div class="section-bar"></div><h3 class="section-title">Manual Entry</h3></div>
        <form class="manual-form" id="manual-form">
          <div class="manual-icon">${icons.droplets}</div>
          <div class="manual-field">
            <label class="manual-label">Custom Amount</label>
            <div class="manual-input-row">
              <input class="manual-input" type="number" id="manual-amount" placeholder="0">
              <span class="manual-unit">ml</span>
            </div>
          </div>
          <button type="submit" class="btn-add" id="manual-btn" disabled>${icons.plus}</button>
        </form>
      </section>

      <section class="section">
        <div class="health-card">
          <div class="health-card-glow"></div>
          <div class="health-header">
            <div class="health-header-left">
              <div class="health-icon">${icons.activity.replace('width="32"','width="20"').replace('height="32"','height="20"')}</div>
              <div>
                <h3 class="health-title">Bio-Metric Analysis</h3>
                <p class="health-subtitle">Real-time Physiological Sync</p>
              </div>
            </div>
            <div class="health-badge">${percentage.toFixed(0)}% Opt</div>
          </div>
          <div class="radar-wrap"><canvas id="radar-chart"></canvas></div>
          <div class="health-metrics">
            <div class="health-metric">${icons.zap}<span class="health-metric-label">Energy</span><span class="health-metric-value">${(percentage * 0.95).toFixed(0)}%</span></div>
            <div class="health-metric">${icons.brain}<span class="health-metric-label">Cognitive</span><span class="health-metric-value">${(percentage * 0.8).toFixed(0)}%</span></div>
            <div class="health-metric">${icons.shield}<span class="health-metric-label">Immune</span><span class="health-metric-value">${(40 + percentage * 0.6).toFixed(0)}%</span></div>
          </div>
          <div class="health-footer">
            <div class="health-footer-left">
              <div class="status-dot ${todayTotal > 0 ? 'active' : ''}"></div>
              <span class="health-footer-text">Neural Analysis Active</span>
            </div>
            <span class="health-ref">REF: ISO-2026-PHY</span>
          </div>
        </div>
      </section>

      <section class="section" style="padding-bottom:5rem">
        <div class="section-header-between">
          <div class="section-header" style="margin-bottom:0"><div class="section-bar-outline"></div><h3 class="section-title">Log History</h3></div>
          <span class="badge">${todayLogs.length} Entries</span>
        </div>
        <div class="log-list">${logItems}</div>
      </section>
    </div>`;
  }

  function renderTrends(streakStats, historyData) {
    const avg = Math.round(historyData.reduce((a, c) => a + c.total, 0) / (historyData.length || 1));
    return `<div class="tab-content">
      <section class="section">
        <div class="section-header"><div class="section-bar"></div><h3 class="section-title">Performance Progress</h3></div>
        <div class="chart-card">
          <h3 class="chart-title">Performance History</h3>
          <div class="chart-wrap"><canvas id="bar-chart"></canvas></div>
        </div>
      </section>
      <div class="stats-card">
        <div class="stats-glow"></div>
        ${streakBadge(streakStats.currentStreak, 'lg')}
        <div class="stats-grid">
          <div><div class="stat-label">Active Streak</div>
            <div class="stat-value">${streakStats.currentStreak} <span class="stat-unit">Days</span></div></div>
          <div><div class="stat-label">Best Record</div>
            <div class="stat-value">${streakStats.bestStreak} <span class="stat-unit">Days</span></div></div>
        </div>
        <div class="stats-avg">
          <div class="stat-label" style="margin-bottom:0.75rem">Daily Efficiency Avg</div>
          <div style="display:flex;align-items:baseline;justify-content:center;gap:0.5rem">
            <div class="stat-value" style="font-size:2.25rem">${avg}<span style="font-size:1.125rem;color:#94a3b8;margin-left:0.25rem">ml</span></div>
            <div class="stat-value" style="font-size:1.5rem;color:#94a3b8">/ ${(avg / 1000).toFixed(2)}<span style="font-size:0.875rem;color:#64748b;margin-left:0.25rem">L</span></div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function render() {
    const app = document.getElementById('app');
    if (!profile) {
      app.innerHTML = renderSetup();
      bindSetupEvents();
      return;
    }

    const todayKey = getTodayKey();
    const todayLogs = logs.filter((log) => new Date(log.timestamp).toISOString().split('T')[0] === todayKey);
    const todayTotal = todayLogs.reduce((a, l) => a + l.amount, 0);
    const progressPct = (todayTotal / profile.dailyGoal) * 100;
    const streakStats = calculateStreaks(logs, profile.dailyGoal);
    const historyData = getHistoryData();
    const status = progressPct >= 100 ? 'Optimized' : 'Active';

    app.innerHTML = `<div class="app">
      <header class="header">
        <div class="header-left">
          <div class="header-logo">${icons.droplets}</div>
          <div>
            <h1 class="header-title">Aqua tracker</h1>
            <p class="header-status">Status: ${status}</p>
          </div>
        </div>
        <div class="header-right">
          ${streakBadge(streakStats.currentStreak, 'sm')}
          <button class="btn-icon" id="btn-settings">${icons.settings}</button>
        </div>
      </header>
      <main class="main">
        ${activeTab === 'today' ? renderToday(todayTotal, progressPct, todayLogs, streakStats) : renderTrends(streakStats, historyData)}
      </main>
      <nav class="bottom-nav">
        <div class="nav-inner">
          <button class="nav-btn ${activeTab === 'today' ? 'active' : ''}" data-tab="today">
            ${icons.droplets.replace('width="20"','width="22"').replace('height="20"','height="22"')}
            <span>Today</span>
          </button>
          <button class="nav-btn ${activeTab === 'trends' ? 'active' : ''}" data-tab="trends">
            ${icons.history}
            <span>Progress</span>
          </button>
        </div>
      </nav>
    </div>`;

    bindAppEvents();

    if (activeTab === 'today') {
      const radar = document.getElementById('radar-chart');
      if (radar) drawRadarChart(radar, Math.min((todayTotal / profile.dailyGoal) * 100, 100));
    } else {
      const bar = document.getElementById('bar-chart');
      if (bar) drawBarChart(bar, historyData);
    }
  }

  // ── Events ────────────────────────────────────────────────────
  function bindSetupEvents() {
    const form = document.getElementById('setup-form');
    const checkbox = form.querySelector('[name="hasMedicalCondition"]');
    const medIcon = document.getElementById('med-icon');

    checkbox.addEventListener('change', () => {
      medIcon.classList.toggle('active', checkbox.checked);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        name: fd.get('name'),
        age: parseInt(fd.get('age')) || 25,
        weight: parseFloat(fd.get('weight')) || 70,
        weightUnit: fd.get('weightUnit'),
        height: 170,
        gender: fd.get('gender'),
        activityLevel: fd.get('activityLevel'),
        exerciseMinutesPerSession: 45,
        exerciseDaysPerWeek: 3,
        climate: fd.get('climate'),
        caffeineCups: parseInt(fd.get('caffeineCups')) || 0,
        sodaCans: parseInt(fd.get('sodaCans')) || 0,
        hasMedicalCondition: fd.get('hasMedicalCondition') === 'on',
      };
      data.dailyGoal = calculateHydrationGoal(data);
      profile = data;
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      render();
    });
  }

  function addLog(amount, type) {
    logs.unshift({
      id: Math.random().toString(36).substr(2, 9),
      amount,
      type: type || 'Water',
      timestamp: Date.now(),
    });
    localStorage.setItem(STORAGE_KEYS.INTAKE_LOGS, JSON.stringify(logs));
    render();
  }

  function bindAppEvents() {
    document.getElementById('btn-settings').addEventListener('click', () => {
      profile = null;
      render();
    });

    document.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        render();
      });
    });

    if (activeTab === 'today') {
      document.querySelectorAll('[data-preset]').forEach((btn) => {
        btn.addEventListener('click', () => {
          addLog(INTAKE_PRESETS[parseInt(btn.dataset.preset)].amount);
        });
      });

      const manualInput = document.getElementById('manual-amount');
      const manualBtn = document.getElementById('manual-btn');
      manualInput.addEventListener('input', () => {
        const v = parseInt(manualInput.value);
        manualBtn.disabled = isNaN(v) || v <= 0;
      });
      document.getElementById('manual-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const v = parseInt(manualInput.value);
        if (!isNaN(v) && v > 0) addLog(v);
      });

      document.querySelectorAll('[data-delete]').forEach((btn) => {
        btn.addEventListener('click', () => {
          logs = logs.filter((l) => l.id !== btn.dataset.delete);
          localStorage.setItem(STORAGE_KEYS.INTAKE_LOGS, JSON.stringify(logs));
          render();
        });
      });
    }
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    const savedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const savedLogs = localStorage.getItem(STORAGE_KEYS.INTAKE_LOGS);
    if (savedProfile) profile = JSON.parse(savedProfile);
    if (savedLogs) logs = JSON.parse(savedLogs);
    render();
    window.addEventListener('resize', () => {
      if (!profile) return;
      if (activeTab === 'today') {
        const radar = document.getElementById('radar-chart');
        if (radar) {
          const todayKey = getTodayKey();
          const todayTotal = logs
            .filter((l) => new Date(l.timestamp).toISOString().split('T')[0] === todayKey)
            .reduce((a, l) => a + l.amount, 0);
          drawRadarChart(radar, Math.min((todayTotal / profile.dailyGoal) * 100, 100));
        }
      } else {
        const bar = document.getElementById('bar-chart');
        if (bar) drawBarChart(bar, getHistoryData());
      }
    });
  }

  init();
})();