import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getFeaturedFactForDate } from '../data/facts';

export const NOTIF_KEYS = {
  enabled: '@factexplorer/pref_notifications',
  hour: '@factexplorer/notif_hour',
  minute: '@factexplorer/notif_minute',
  lastStreakRisk: '@factexplorer/streak_risk_last',
};

const STREAK_LAST_KEY = '@factexplorer/streak_last';
const STREAK_COUNT_KEY = '@factexplorer/streak_count';
const DAILY_ID = 'factexplorer-daily';
const STREAK_ID = 'factexplorer-streak-risk';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Daily facts',
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: '#5E5CE6',
  });
}

export async function requestPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === 'granted';
}

export async function scheduleDaily(hour: number, minute: number) {
  await ensureAndroidChannel();
  await Notifications.cancelScheduledNotificationAsync(DAILY_ID).catch(() => {});

  const fact = getFeaturedFactForDate();
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_ID,
    content: {
      title: 'Today\'s fact',
      body: fact.title,
      data: { factId: fact.id, kind: 'daily' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
    },
  });
}

export async function cancelDaily() {
  await Notifications.cancelScheduledNotificationAsync(DAILY_ID).catch(() => {});
}

export async function cancelStreakRisk() {
  await Notifications.cancelScheduledNotificationAsync(STREAK_ID).catch(() => {});
}

export async function cancelAll() {
  await cancelDaily();
  await cancelStreakRisk();
}

export async function scheduleStreakRisk() {
  const enabled = await AsyncStorage.getItem(NOTIF_KEYS.enabled);
  if (enabled !== '1') return;

  const [lastOpen, streakRaw, lastRiskRaw] = await Promise.all([
    AsyncStorage.getItem(STREAK_LAST_KEY),
    AsyncStorage.getItem(STREAK_COUNT_KEY),
    AsyncStorage.getItem(NOTIF_KEYS.lastStreakRisk),
  ]);

  const streak = streakRaw ? parseInt(streakRaw, 10) : 0;
  if (streak < 1) return;

  const today = new Date().toDateString();
  if (lastOpen === today) return;
  if (lastRiskRaw === today) return;

  const fireAt = new Date();
  fireAt.setHours(21, 0, 0, 0);
  if (fireAt.getTime() <= Date.now()) {
    fireAt.setTime(Date.now() + 60 * 1000);
  }

  await ensureAndroidChannel();
  await cancelStreakRisk();
  await Notifications.scheduleNotificationAsync({
    identifier: STREAK_ID,
    content: {
      title: `Don\'t lose your ${streak}-day streak`,
      body: 'Open Fact Explorer today to keep it going.',
      data: { kind: 'streak-risk' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fireAt,
    },
  });

  await AsyncStorage.setItem(NOTIF_KEYS.lastStreakRisk, today);
}

export function useNotificationPrefs() {
  const [enabled, setEnabledState] = useState(false);
  const [hour, setHourState] = useState(9);
  const [minute, setMinuteState] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(NOTIF_KEYS.enabled),
      AsyncStorage.getItem(NOTIF_KEYS.hour),
      AsyncStorage.getItem(NOTIF_KEYS.minute),
    ]).then(([e, h, m]) => {
      if (e === '1') setEnabledState(true);
      if (h !== null) setHourState(parseInt(h, 10));
      if (m !== null) setMinuteState(parseInt(m, 10));
      setLoaded(true);
    });
  }, []);

  const setEnabled = useCallback(
    async (v: boolean): Promise<boolean> => {
      if (v) {
        const granted = await requestPermission();
        if (!granted) return false;
      }
      setEnabledState(v);
      await AsyncStorage.setItem(NOTIF_KEYS.enabled, v ? '1' : '0');
      if (v) await scheduleDaily(hour, minute);
      else await cancelAll();
      return true;
    },
    [hour, minute],
  );

  const setTime = useCallback(
    async (h: number, m: number) => {
      setHourState(h);
      setMinuteState(m);
      await AsyncStorage.setItem(NOTIF_KEYS.hour, String(h));
      await AsyncStorage.setItem(NOTIF_KEYS.minute, String(m));
      const e = await AsyncStorage.getItem(NOTIF_KEYS.enabled);
      if (e === '1') await scheduleDaily(h, m);
    },
    [],
  );

  return { enabled, hour, minute, loaded, setEnabled, setTime };
}
