import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const KEYS = {
  streakLastOpen: '@factexplorer/streak_last',
  streakCount: '@factexplorer/streak_count',
  timeSpent: '@factexplorer/time_spent',
};

export function useStats() {
  const [streak, setStreak] = useState(0);
  const [totalTimeMs, setTotalTimeMs] = useState(0);

  useEffect(() => {
    (async () => {
      const today = new Date().toDateString();
      const [lastOpen, streakRaw, timeRaw] = await Promise.all([
        AsyncStorage.getItem(KEYS.streakLastOpen),
        AsyncStorage.getItem(KEYS.streakCount),
        AsyncStorage.getItem(KEYS.timeSpent),
      ]);

      let currentStreak = streakRaw ? parseInt(streakRaw, 10) : 0;
      if (lastOpen !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        currentStreak = lastOpen === yesterday ? currentStreak + 1 : 1;
        await Promise.all([
          AsyncStorage.setItem(KEYS.streakLastOpen, today),
          AsyncStorage.setItem(KEYS.streakCount, String(currentStreak)),
        ]);
      }

      setStreak(currentStreak);
      setTotalTimeMs(timeRaw ? parseInt(timeRaw, 10) : 0);
    })();
  }, []);

  const recordTime = useCallback(async (ms: number) => {
    if (ms < 1000) return;
    const raw = await AsyncStorage.getItem(KEYS.timeSpent);
    const prev = raw ? parseInt(raw, 10) : 0;
    const next = prev + ms;
    await AsyncStorage.setItem(KEYS.timeSpent, String(next));
    setTotalTimeMs(next);
  }, []);

  return { streak, totalTimeMs, recordTime };
}
