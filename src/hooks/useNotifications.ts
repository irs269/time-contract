import { useState, useEffect, useCallback } from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface NotificationSettings {
  enabled: boolean;
  reminderInterval: number; // in hours
  lastReminder: string | null;
}

const STORAGE_KEY = 'notification-settings';

const defaultSettings: NotificationSettings = {
  enabled: false,
  reminderInterval: 4, // every 4 hours
  lastReminder: null,
};

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Check current permission status
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Request permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      setSettings(prev => ({ ...prev, enabled: true }));
      return true;
    }
    return false;
  }, []);

  // Send a notification
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return;

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      tag: 'reminder',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setSettings(prev => ({ ...prev, lastReminder: new Date().toISOString() }));
  }, [permission]);

  // Schedule reminder check
  useEffect(() => {
    if (!settings.enabled || permission !== 'granted') return;

    const checkReminder = () => {
      const now = Date.now();
      const lastReminder = settings.lastReminder ? new Date(settings.lastReminder).getTime() : 0;
      const intervalMs = settings.reminderInterval * 60 * 60 * 1000;

      if (now - lastReminder >= intervalMs) {
        sendNotification('Je vends mon temps ⏰', {
          body: 'C\'est le moment de vendre ton temps à ta discipline !',
        });
      }
    };

    // Check every minute
    const interval = setInterval(checkReminder, 60 * 1000);
    
    // Also check on visibility change (when user comes back to browser)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkReminder();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [settings.enabled, settings.reminderInterval, settings.lastReminder, permission, sendNotification]);

  const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleNotifications = useCallback(async () => {
    if (!settings.enabled) {
      const granted = await requestPermission();
      if (granted) {
        // Send a test notification
        sendNotification('Notifications activées ✓', {
          body: 'Tu recevras des rappels pour vendre ton temps.',
        });
      }
    } else {
      setSettings(prev => ({ ...prev, enabled: false }));
    }
  }, [settings.enabled, requestPermission, sendNotification]);

  return {
    permission,
    settings,
    isSupported: 'Notification' in window,
    requestPermission,
    sendNotification,
    updateSettings,
    toggleNotifications,
  };
}
