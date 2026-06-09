// Today Page - Water intake tracking

import { icons, presetIcon } from '../shared/icons.js';
import { INTAKE_PRESETS } from '../shared/constants.js';
import { formatVolume } from '../shared/utils.js';

export function renderToday(todayTotal, progressPct, todayLogs, streakStats, profile) {
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

/**
 * Bind today page events
 */
export function bindTodayEvents(onPresetClick, onManualSubmit, onDelete) {
  document.querySelectorAll('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const amount = INTAKE_PRESETS[parseInt(btn.dataset.preset)].amount;
      if (onPresetClick) onPresetClick(amount);
    });
  });

  const manualInput = document.getElementById('manual-amount');
  const manualBtn = document.getElementById('manual-btn');
  
  if (manualInput) {
    manualInput.addEventListener('input', () => {
      const v = parseInt(manualInput.value);
      manualBtn.disabled = isNaN(v) || v <= 0;
    });
  }

  const manualForm = document.getElementById('manual-form');
  if (manualForm) {
    manualForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = parseInt(manualInput.value);
      if (!isNaN(v) && v > 0 && onManualSubmit) {
        onManualSubmit(v);
        manualInput.value = '';
        manualBtn.disabled = true;
      }
    });
  }

  document.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (onDelete) onDelete(btn.dataset.delete);
    });
  });
}

/**
 * Draw radar chart for bio-metric analysis
 */
export function drawRadarChart(canvas, percentage) {
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

  // Draw grid
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

  // Draw radial lines
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();
  }

  // Draw data polygon
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

  // Draw labels
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
