// Trends Page - Performance progress and statistics

import { icons } from '../shared/icons.js';

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

export function renderTrends(streakStats, historyData) {
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

/**
 * Draw bar chart for 7-day history
 */
export function drawBarChart(canvas, data) {
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
