import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Configure native plugins when running on a native platform.
 * This file is imported once at app boot (main.jsx).
 * On web, all calls are silently no-ops.
 */
if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#020617' });
}
