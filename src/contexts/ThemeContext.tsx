import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ColorPalette, Colors, DarkColors } from '../constants/colors';

export type ThemePreference = 'system' | 'dark' | 'light';

type ThemeContextValue = {
  colors: ColorPalette;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: Colors,
  isDark: false,
  preference: 'system',
  setPreference: () => {},
});

const STORAGE_KEY = '@factexplorer/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'dark' || val === 'light' || val === 'system') {
        setPreferenceState(val);
      }
    });
  }, []);

  function setPreference(pref: ThemePreference) {
    setPreferenceState(pref);
    AsyncStorage.setItem(STORAGE_KEY, pref);
  }

  const isDark =
    preference === 'dark' || (preference === 'system' && systemScheme === 'dark');

  return (
    <ThemeContext.Provider
      value={{ colors: isDark ? DarkColors : Colors, isDark, preference, setPreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
