import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ColorPalette, Colors, DarkColors } from '../constants/colors';
import { AccentScheme, DEFAULT_SCHEME_ID, SCHEMES } from '../data/schemes';

export type ThemePreference = 'system' | 'dark' | 'light';

type ThemeContextValue = {
  colors: ColorPalette;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  accentSchemeId: string;
  setAccentSchemeId: (id: string) => void;
  heroGradient: [string, string, string];
  particleColor: string;
  activeScheme: AccentScheme;
};

const defaultScheme = SCHEMES.find((s) => s.id === DEFAULT_SCHEME_ID) ?? SCHEMES[0];

const ThemeContext = createContext<ThemeContextValue>({
  colors: Colors,
  isDark: false,
  preference: 'system',
  setPreference: () => {},
  accentSchemeId: DEFAULT_SCHEME_ID,
  setAccentSchemeId: () => {},
  heroGradient: defaultScheme.light.heroGradient,
  particleColor: defaultScheme.light.particleColor,
  activeScheme: defaultScheme,
});

const THEME_KEY = '@factexplorer/theme';
const ACCENT_KEY = '@factexplorer/accent';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [accentSchemeId, setAccentSchemeIdState] = useState<string>(DEFAULT_SCHEME_ID);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(THEME_KEY),
      AsyncStorage.getItem(ACCENT_KEY),
    ]).then(([themeVal, accentVal]) => {
      if (themeVal === 'dark' || themeVal === 'light' || themeVal === 'system') {
        setPreferenceState(themeVal);
      }
      if (accentVal && SCHEMES.some((s) => s.id === accentVal)) {
        setAccentSchemeIdState(accentVal);
      }
    });
  }, []);

  function setPreference(pref: ThemePreference) {
    setPreferenceState(pref);
    AsyncStorage.setItem(THEME_KEY, pref);
  }

  function setAccentSchemeId(id: string) {
    setAccentSchemeIdState(id);
    AsyncStorage.setItem(ACCENT_KEY, id);
  }

  const isDark =
    preference === 'dark' || (preference === 'system' && systemScheme === 'dark');

  const activeScheme = SCHEMES.find((s) => s.id === accentSchemeId) ?? SCHEMES[0];
  const variant = isDark ? activeScheme.dark : activeScheme.light;

  const baseColors = isDark ? DarkColors : Colors;
  const mergedColors: ColorPalette = {
    ...baseColors,
    accent: variant.accent,
    accentLight: variant.accentLight,
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: mergedColors,
        isDark,
        preference,
        setPreference,
        accentSchemeId,
        setAccentSchemeId,
        heroGradient: variant.heroGradient,
        particleColor: variant.particleColor,
        activeScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
