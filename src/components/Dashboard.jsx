import React, { useState, useCallback } from 'react';
import styles from './Dashboard.module.css';
import WaterOrb from './WaterOrb';
import MethodologyPanel from './MethodologyPanel';
import { formatVol } from '../utils/waterCalc';

const PRESETS = [
  { label: 'Espresso', amount: 200, emoji: '☕' },
  { label: 'Glass',    amount: 350, emoji: '🥛' },
  { label: 'Bottle',   amount: 500, emoji: '💧' },
  { label: 'Sport',    amount: 750, emoji: '🍶' },
];

function Toast({ msg }) {
  return msg ? <div className={styles.toast}>{msg}</div> : null;
}

export default function Dashboard({ profile, logs, todayLogs, todayTotal, addLog, removeLog, calculateStreak, onResetProfile }) {
  const [customAmt, setCustomAmt]     = useState('');
  const [toast, setToast]             = useState('');
  const [showMethod, setShowMethod]   = useState(false);
  const [customError, setCustomError] = useState(false);

  const { dailyGoal, calcBreakdown } = profile;
  const progressPct = Math.min((todayTotal / dailyGoal) * 100, 100);
  const remaining   = Math.max(dailyGoal - todayTotal, 0);
  const streak      = calculateStreak(dailyGoal);
  const goalReached = todayTotal >= dailyGoal;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  const handleAdd = useCallback((amount) => {
    const ok = addLog(amount);
    if (ok) showToast(`+${formatVol(amount)} added 💧`);
  }, [addLog, showToast]);

  const handleCustomAdd = () => {
    const val = parseInt(customAmt);
    if (!val || val <= 0 || val > 5000) {
      setCustomError(true);
      setTimeout(() => setCustomError(false), 800);
      return;
    }
    handleAdd(val);
    setCustomAmt('');
  };

  const handleDelete = useCallback((id, el) => {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      el.style.transition = 'all 0.25s ease';
    }
    setTimeout(() => {
      removeLog(id);
      showToast('Entry removed');
    }, 220);
  }, [removeLog, showToast]);

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <>
      <div className={styles.app}>
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerLogo}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
                <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
              </svg>
            </div>
            <div>
              <h1 className={styles.headerTitle}>Aqua Tracker</h1>
              <p className={styles.headerStatus}>👤 {profile.name}</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.btnIcon} title="How it's calculated" onClick={() => setShowMethod(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
            </button>
            <button className={styles.btnIcon} title="Reset Profile" onClick={() => {
              if (confirm('Reset your profile? Your log history will be kept.')) onResetProfile();
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
        </header>

        <main className={styles.main}>
          {/* STATS BAR */}
          <div className={styles.statsBar}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{formatVol(todayTotal)}</div>
              <div className={styles.statLabel}>Today</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{formatVol(remaining)}</div>
              <div className={styles.statLabel}>Remaining</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{streak > 0 ? '🔥' : ''}{streak}</div>
              <div className={styles.statLabel}>Day Streak</div>
            </div>
          </div>

          {/* GOAL REACHED BANNER */}
          {goalReached && (
            <div className={styles.goalBanner}>
              <span className={styles.goalBannerEmoji}>🎉</span>
              <div>
                <div className={styles.goalBannerTitle}>Goal Reached!</div>
                <div className={styles.goalBannerSub}>You've hit {formatVol(dailyGoal)} today</div>
              </div>
            </div>
          )}

          {/* WATER ORB */}
          <div className={styles.section}>
            <div className={styles.orbCenter}>
              <WaterOrb pct={progressPct} totalMl={todayTotal} goalMl={dailyGoal} formatVol={formatVol} />

              {/* Info row under orb */}
              <div className={styles.calcBadge} onClick={() => setShowMethod(true)}>
                <span className={styles.calcBadgeIcon}>⚗️</span>
                <span>Scientifically calculated · {formatVol(dailyGoal)}/day</span>
                <span className={styles.calcBadgeArrow}>→</span>
              </div>

              {/* Progress bar */}
              <div className={styles.progressBarWrap}>
                <div className={styles.progressBarTrack}>
                  <div className={styles.progressBarFill} style={{ width: `${progressPct}%` }} />
                </div>
              </div>
              <div className={styles.progressBarLabels}>
                <span>0ml</span>
                <span style={{ color: '#22d3ee', fontWeight: 600 }}>{Math.round(progressPct)}% complete</span>
                <span>{formatVol(dailyGoal)}</span>
              </div>
            </div>
          </div>

          {/* QUICK ADD */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Quick Add</h3>
            </div>
            <div className={styles.presetGrid}>
              {PRESETS.map(p => (
                <button key={p.amount} className={styles.presetBtn}
                  onClick={() => handleAdd(p.amount)}>
                  <div className={styles.presetIcon}>{p.emoji}</div>
                  <span className={styles.presetLabel}>{p.label}</span>
                  <span className={styles.presetAmt}>+{p.amount}ml</span>
                </button>
              ))}
            </div>
          </div>

          {/* CUSTOM INTAKE */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Custom Amount</h3>
            </div>
            <div className={styles.customWrap}>
              <input
                className={`${styles.customInput} ${customError ? styles.customInputErr : ''}`}
                type="number"
                placeholder="Enter ml (e.g. 420)"
                min="1" max="5000"
                value={customAmt}
                onChange={e => setCustomAmt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCustomAdd()}
              />
              <button className={styles.btnAddCustom} onClick={handleCustomAdd}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add
              </button>
            </div>
          </div>

          <div className={styles.divider} />

          {/* LOG LIST */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Today's Log</h3>
              <span className={styles.logCount}>{todayLogs.length} entr{todayLogs.length === 1 ? 'y' : 'ies'}</span>
            </div>
            <div className={styles.logList}>
              {todayLogs.length === 0 ? (
                <div className={styles.logEmpty}>
                  <div className={styles.logEmptyIcon}>💧</div>
                  <div>No intake recorded yet</div>
                  <div className={styles.logEmptyHint}>Tap a preset above to get started</div>
                </div>
              ) : (
                todayLogs.map((log, i) => (
                  <div key={log.id} className={styles.logItem} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className={styles.logLeft}>
                      <div className={styles.logDot} />
                      <div>
                        <div className={styles.logAmount}>{formatVol(log.amount)}</div>
                        <div className={styles.logTime}>{formatTime(log.timestamp)}</div>
                      </div>
                    </div>
                    <button className={styles.logDelete}
                      onClick={e => handleDelete(log.id, e.currentTarget.closest(`.${styles.logItem}`))}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Methodology Panel */}
      {showMethod && calcBreakdown && (
        <MethodologyPanel calc={calcBreakdown} onClose={() => setShowMethod(false)} />
      )}

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
