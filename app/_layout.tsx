import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { useStats } from '../src/hooks/useStats';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { recordTime } = useStats();
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') {
        recordTime(Date.now() - sessionStart.current);
        sessionStart.current = Date.now();
      } else if (state === 'active') {
        sessionStart.current = Date.now();
      }
    });
    return () => {
      recordTime(Date.now() - sessionStart.current);
      sub.remove();
    };
  }, [recordTime]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="category/[id]"
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
