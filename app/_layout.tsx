import * as Notifications from 'expo-notifications';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { scheduleStreakRisk } from '../src/hooks/useNotifications';
import { useOnboarding } from '../src/hooks/useOnboarding';
import { useStats } from '../src/hooks/useStats';

SplashScreen.preventAutoHideAsync();

function handleNotificationData(data: unknown) {
  if (!data || typeof data !== 'object') return;
  const factId = (data as Record<string, unknown>).factId;
  if (typeof factId === 'string' && factId.length > 0) {
    router.push(`/fact/${factId}`);
  }
}

function AppContent() {
  const { recordTime } = useStats();
  const { state: onboardingState } = useOnboarding();
  const segments = useSegments();
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    if (onboardingState !== 'unknown') {
      SplashScreen.hideAsync();
    }
  }, [onboardingState]);

  useEffect(() => {
    if (onboardingState === 'unknown') return;
    const inOnboarding = segments[0] === 'onboarding';
    if (onboardingState === 'pending' && !inOnboarding) {
      router.replace('/onboarding');
    } else if (onboardingState === 'completed' && inOnboarding) {
      router.replace('/');
    }
  }, [onboardingState, segments]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') {
        recordTime(Date.now() - sessionStart.current);
        sessionStart.current = Date.now();
      } else if (state === 'active') {
        sessionStart.current = Date.now();
        scheduleStreakRisk().catch(() => {});
      }
    });
    scheduleStreakRisk().catch(() => {});
    return () => {
      recordTime(Date.now() - sessionStart.current);
      sub.remove();
    };
  }, [recordTime]);

  useEffect(() => {
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationData(response.notification.request.content.data);
    });
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) handleNotificationData(response.notification.request.content.data);
    });
    return () => responseSub.remove();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="onboarding"
        options={{ presentation: 'card', animation: 'fade' }}
      />
      <Stack.Screen
        name="category/[id]/index"
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="category/[id]/read"
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="fact/[id]"
        options={{ presentation: 'card', animation: 'slide_from_right' }}
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
