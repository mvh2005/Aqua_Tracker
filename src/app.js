// Main App - Orchestrates all modules

import { userProfile } from './profile/userProfile.js';
import { renderSetup, bindSetupEvents, calculateHydrationGoal } from './pages/setup/setup.js';
import { renderToday, bindTodayEvents, drawRadarChart } from './pages/today/today.js';
import { renderTrends, drawBarChart } from './pages/trends/trends.js';
import { STORAGE_KEYS, INTAKE_PRESETS } from './shared/constants.js';
import { getTodayKey, calculateStreaks, getHistoryData } from './shared/utils.js';
import { icons } from './shared/icons.js';

class AquaTrackerApp {
  constructor() {
    this.logs = [];
    this.activeTab = 'today';
    this.loadData();
  }

  /**
   * Load data from localStorage
   */
  loadData() {
    const savedLogs = localStorage.getItem(STORAGE_KEYS.INTAKE_LOGS);
    if (savedLogs) {
      this.logs = JSON.parse(savedLogs);
    }
  }

  /**
   * Save logs to localStorage
   */
  saveLogs() {
    localStorage.setItem(STORAGE_KEYS.INTAKE_LOGS, JSON.stringify(this.logs));
  }

  /**
   * Add a water intake log
   */
  addLog(amount, type = 'Water') {
    this.logs.unshift({
      id: Math.random().toString(36).substr(2, 9),
      amount,
      type,
      timestamp: Date.now(),
    });
    this.saveLogs();
    this.render();
  }

  /**
   * Delete a log entry
   */
  deleteLog(logId) {
    this.logs = this.logs.filter((l) => l.id !== logId);
    this.saveLogs();
    this.render();
  }

  /**
   * Get today's logs
   */
  getTodayLogs() {
    const todayKey = getTodayKey();
    return this.logs.filter((log) => new Date(log.timestamp).toISOString().split('T')[0] === todayKey);
  }

  /**
   * Main render function
   */
  render() {
    const app = document.getElementById('app');
    const profile = userProfile.getProfile();

    // Render setup if no profile
    if (!profile) {
      app.innerHTML = renderSetup();
      bindSetupEvents((data) => this.handleSetupSubmit(data));
      return;
    }

    // Get data
    const todayLogs = this.getTodayLogs();
    const todayTotal = todayLogs.reduce((a, l) => a + l.amount, 0);
    const progressPct = (todayTotal / profile.dailyGoal) * 100;
    const streakStats = calculateStreaks(this.logs, profile.dailyGoal);
    const historyData = getHistoryData(profile, this.logs);
    const status = progressPct >= 100 ? 'Optimized' : 'Active';

    // Helper function for streak badge
    const streakBadge = (count, size) => {
      if (count === 0 && size === 'sm') return '';
      if (size === 'lg') {
        return `<div class="streak-lg">
          <div class="streak-lg-icon">${icons.flameLg}</div>
          <div><span class="streak-lg-count">${count}</span>
          <p class="streak-lg-label">Active Day Streak</p></div>
        </div>`;
      }
      return `<div class="streak-sm">${icons.flame}<span class="streak-count">${count}</span><span style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">Days</span></div>`;
    };

    // Render main app
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
        ${this.activeTab === 'today' ? renderToday(todayTotal, progressPct, todayLogs, streakStats, profile) : renderTrends(streakStats, historyData)}
      </main>
      <nav class="bottom-nav">
        <div class="nav-inner">
          <button class="nav-btn ${this.activeTab === 'today' ? 'active' : ''}" data-tab="today">
            ${icons.droplets.replace('width="20"','width="22"').replace('height="20"','height="22"')}
            <span>Today</span>
          </button>
          <button class="nav-btn ${this.activeTab === 'trends' ? 'active' : ''}" data-tab="trends">
            ${icons.history}
            <span>Progress</span>
          </button>
        </div>
      </nav>
    </div>`;

    // Bind events
    this.bindAppEvents();

    // Draw charts
    if (this.activeTab === 'today') {
      const radar = document.getElementById('radar-chart');
      if (radar) drawRadarChart(radar, Math.min((todayTotal / profile.dailyGoal) * 100, 100));
    } else {
      const bar = document.getElementById('bar-chart');
      if (bar) drawBarChart(bar, historyData);
    }
  }

  /**
   * Handle setup form submission
   */
  handleSetupSubmit(data) {
    data.dailyGoal = calculateHydrationGoal(data);
    userProfile.saveProfile(data);
    this.render();
  }

  /**
   * Bind app events
   */
  bindAppEvents() {
    // Settings button
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      userProfile.clearProfile();
      this.render();
    });

    // Tab navigation
    document.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.tab;
        this.render();
      });
    });

    // Today page events
    if (this.activeTab === 'today') {
      bindTodayEvents(
        (amount) => this.addLog(amount),
        (amount) => this.addLog(amount),
        (logId) => this.deleteLog(logId)
      );
    }
  }

  /**
   * Handle window resize for charts
   */
  onWindowResize() {
    if (!userProfile.hasProfile()) return;

    if (this.activeTab === 'today') {
      const radar = document.getElementById('radar-chart');
      if (radar) {
        const todayLogs = this.getTodayLogs();
        const todayTotal = todayLogs.reduce((a, l) => a + l.amount, 0);
        const profile = userProfile.getProfile();
        drawRadarChart(radar, Math.min((todayTotal / profile.dailyGoal) * 100, 100));
      }
    } else {
      const bar = document.getElementById('bar-chart');
      if (bar) {
        const profile = userProfile.getProfile();
        const historyData = getHistoryData(profile, this.logs);
        drawBarChart(bar, historyData);
      }
    }
  }

  /**
   * Initialize the app
   */
  init() {
    this.render();
    window.addEventListener('resize', () => this.onWindowResize());
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AquaTrackerApp();
  app.init();
});

// Export for testing if needed
export default AquaTrackerApp;
