import React, { useState } from 'react';
import styles from './NotificationSettings.module.css';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationSettings({ onClose }) {
  const {
    prefs,
    permissionStatus,
    isSupported,
    enableNotifications,
    disableNotifications,
    updatePrefs,
    sendTestNotification,
  } = useNotifications();

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  function showFeedback(msg) {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 2500);
  }

  async function handleToggle() {
    setLoading(true);
    if (prefs.enabled) {
      await disableNotifications();
      showFeedback('Reminders turned off.');
    } else {
      const ok = await enableNotifications();
      if (ok) {
        showFeedback('Reminders enabled! 🎉');
      } else {
        showFeedback('Permission denied. Enable notifications in Settings.');
      }
    }
    setLoading(false);
  }

  async function handleTest() {
    await sendTestNotification();
    showFeedback('Test notification sent in 2 sec!');
  }

  const INTERVAL_OPTIONS = [1, 2, 3, 4, 6];
  const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);

  function fmtHour(h) {
    const ampm = h < 12 ? 'AM' : 'PM';
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}:00 ${ampm}`;
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>
            <span className={styles.bellIcon}>🔔</span>
            Hydration Reminders
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isSupported && (
          <div className={styles.unsupported}>
            Notifications are not supported on this platform.
          </div>
        )}

        {isSupported && (
          <>
            {/* Toggle Row */}
            <div className={styles.toggleRow}>
              <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>Enable Reminders</div>
                <div className={styles.toggleSub}>
                  {prefs.enabled
                    ? `Every ${prefs.intervalHours}h · ${fmtHour(prefs.startHour)} – ${fmtHour(prefs.endHour)}`
                    : 'Tap to schedule hydration alerts'}
                </div>
              </div>
              <button
                className={`${styles.toggle} ${prefs.enabled ? styles.toggleOn : ''}`}
                onClick={handleToggle}
                disabled={loading}
                aria-label="Toggle notifications"
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>

            {/* Permission Banner */}
            {permissionStatus === 'denied' && (
              <div className={styles.permBanner}>
                ⚠️ Notification permission denied. Please enable it in your device Settings.
              </div>
            )}

            {/* Settings (shown when enabled) */}
            {prefs.enabled && (
              <div className={styles.settingsSection}>
                <div className={styles.settingRow}>
                  <label className={styles.settingLabel}>Remind every</label>
                  <div className={styles.chipGroup}>
                    {INTERVAL_OPTIONS.map(h => (
                      <button
                        key={h}
                        className={`${styles.chip} ${prefs.intervalHours === h ? styles.chipActive : ''}`}
                        onClick={() => updatePrefs({ intervalHours: h })}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.settingRow}>
                  <label className={styles.settingLabel}>Active from</label>
                  <select
                    className={styles.select}
                    value={prefs.startHour}
                    onChange={e => updatePrefs({ startHour: Number(e.target.value) })}
                  >
                    {HOUR_OPTIONS.filter(h => h < prefs.endHour).map(h => (
                      <option key={h} value={h}>{fmtHour(h)}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.settingRow}>
                  <label className={styles.settingLabel}>Until</label>
                  <select
                    className={styles.select}
                    value={prefs.endHour}
                    onChange={e => updatePrefs({ endHour: Number(e.target.value) })}
                  >
                    {HOUR_OPTIONS.filter(h => h > prefs.startHour).map(h => (
                      <option key={h} value={h}>{fmtHour(h)}</option>
                    ))}
                  </select>
                </div>

                <button className={styles.testBtn} onClick={handleTest}>
                  🔔 Send Test Notification
                </button>
              </div>
            )}

            {/* Feedback */}
            {feedback && <div className={styles.feedback}>{feedback}</div>}
          </>
        )}

        <p className={styles.footerNote}>
          Notifications are scheduled locally on your device and never leave it.
        </p>
      </div>
    </div>
  );
}
