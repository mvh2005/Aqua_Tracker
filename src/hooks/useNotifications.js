import { useEffect, useCallback, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const NOTIF_PREFS_KEY = 'aqua_tracker_notif_prefs';

const DEFAULT_PREFS = {
  enabled: false,
  intervalHours: 2,   // remind every 2 hours
  startHour: 8,       // 8:00 AM
  endHour: 22,        // 10:00 PM
};

/**
 * Messages cycled for variety in hydration reminder notifications.
 */
const REMINDER_MESSAGES = [
  { title: '💧 Stay Hydrated!', body: "It's time to drink some water. Your body will thank you!" },
  { title: '🚰 Water Break Time', body: 'A glass of water keeps you energized and focused.' },
  { title: '💦 Hydration Reminder', body: "Don't forget to log your water intake today!" },
  { title: '🌊 Drink Up!', body: 'Keep up the streak — drink some water now.' },
  { title: '⚗️ Science Says…', body: 'Regular hydration boosts metabolism and concentration.' },
];

function loadPrefs() {
  try {
    const saved = localStorage.getItem(NOTIF_PREFS_KEY);
    return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function savePrefs(prefs) {
  localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(prefs));
}

/**
 * Build a list of scheduled notifications for the next 7 days
 * at the given interval within start–end hours.
 */
function buildSchedule(prefs) {
  const { intervalHours, startHour, endHour } = prefs;
  const notifications = [];
  let id = 1;

  const now = new Date();

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const base = new Date(now);
    base.setDate(now.getDate() + dayOffset);
    base.setSeconds(0);
    base.setMilliseconds(0);

    for (let hour = startHour; hour < endHour; hour += intervalHours) {
      const trigger = new Date(base);
      trigger.setHours(hour, 0, 0, 0);

      // Skip times in the past
      if (trigger <= now) continue;

      const msg = REMINDER_MESSAGES[(id - 1) % REMINDER_MESSAGES.length];

      notifications.push({
        id,
        title: msg.title,
        body: msg.body,
        schedule: { at: trigger },
        sound: null,
        actionTypeId: '',
        extra: null,
      });

      id++;
      if (id > 64) break; // Android limit safety cap
    }
    if (id > 64) break;
  }

  return notifications;
}

export function useNotifications() {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [permissionStatus, setPermissionStatus] = useState('unknown'); // 'granted' | 'denied' | 'unknown'
  const isNative = Capacitor.isNativePlatform();

  // ---------- Permission check on mount ----------
  useEffect(() => {
    if (!isNative) return;
    LocalNotifications.checkPermissions()
      .then(({ display }) => setPermissionStatus(display))
      .catch(() => setPermissionStatus('denied'));
  }, [isNative]);

  // ---------- Re-schedule whenever prefs change ----------
  useEffect(() => {
    if (!isNative) return;
    if (!prefs.enabled || permissionStatus !== 'granted') return;

    scheduleAll(prefs);
  }, [prefs, permissionStatus, isNative]);

  // ---------- Helpers ----------
  const scheduleAll = async (currentPrefs) => {
    try {
      // Cancel any previously scheduled notifications
      const { notifications: pending } = await LocalNotifications.getPending();
      if (pending.length > 0) {
        await LocalNotifications.cancel({ notifications: pending });
      }

      if (!currentPrefs.enabled) return;

      const toSchedule = buildSchedule(currentPrefs);
      if (toSchedule.length === 0) return;

      await LocalNotifications.schedule({ notifications: toSchedule });
    } catch (err) {
      console.warn('[useNotifications] schedule error:', err);
    }
  };

  const requestPermission = useCallback(async () => {
    if (!isNative) {
      // Web fallback using the Notifications API
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        setPermissionStatus(result === 'granted' ? 'granted' : 'denied');
        return result === 'granted';
      }
      return false;
    }

    const { display } = await LocalNotifications.requestPermissions();
    setPermissionStatus(display);
    return display === 'granted';
  }, [isNative]);

  const enableNotifications = useCallback(async () => {
    const granted = await requestPermission();
    if (!granted) return false;

    const updated = { ...prefs, enabled: true };
    savePrefs(updated);
    setPrefs(updated);
    await scheduleAll(updated);
    return true;
  }, [prefs, requestPermission]);

  const disableNotifications = useCallback(async () => {
    const updated = { ...prefs, enabled: false };
    savePrefs(updated);
    setPrefs(updated);
    if (isNative) {
      try {
        const { notifications: pending } = await LocalNotifications.getPending();
        if (pending.length > 0) {
          await LocalNotifications.cancel({ notifications: pending });
        }
      } catch (err) {
        console.warn('[useNotifications] cancel error:', err);
      }
    }
  }, [prefs, isNative]);

  const updatePrefs = useCallback(async (newPrefs) => {
    const updated = { ...prefs, ...newPrefs };
    savePrefs(updated);
    setPrefs(updated);
    if (updated.enabled && permissionStatus === 'granted') {
      await scheduleAll(updated);
    }
  }, [prefs, permissionStatus]);

  /** Send an immediate test notification */
  const sendTestNotification = useCallback(async () => {
    if (!isNative) {
      // Web fallback
      if (permissionStatus === 'granted' && 'Notification' in window) {
        new Notification('💧 Aqua Tracker Test', { body: 'Notifications are working!' });
      }
      return;
    }
    try {
      await LocalNotifications.schedule({
        notifications: [{
          id: 999,
          title: '💧 Aqua Tracker',
          body: 'Hydration reminders are now active!',
          schedule: { at: new Date(Date.now() + 2000) },
          sound: null,
          actionTypeId: '',
          extra: null,
        }],
      });
    } catch (err) {
      console.warn('[useNotifications] test error:', err);
    }
  }, [isNative, permissionStatus]);

  return {
    prefs,
    permissionStatus,
    isSupported: isNative || ('Notification' in window),
    enableNotifications,
    disableNotifications,
    updatePrefs,
    requestPermission,
    sendTestNotification,
  };
}
