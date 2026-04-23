import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { useReduceMotion } from '../../src/hooks/useReduceMotion';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PARTICLE_COUNT = 10;
const PARTICLE_DATA = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: (i / PARTICLE_COUNT) * SCREEN_WIDTH + (((i * 47) % 60) - 30),
  y: SCREEN_HEIGHT * 0.1 + ((i * 71) % (SCREEN_HEIGHT * 0.7)),
  size: 2 + (i % 3) * 1.2,
  delay: i * 220,
  duration: 4200 + (i % 4) * 800,
}));

function Particle({ x, y, size, delay, duration, color, disabled }: any) {
  const ty = useSharedValue(0);
  const opa = useSharedValue(disabled ? 0.25 : 0);
  useEffect(() => {
    if (disabled) return;
    ty.value = withRepeat(withTiming(-80, { duration, easing: Easing.linear }), -1, false);
    opa.value = withRepeat(
      withSequence(
        withTiming(0, { duration: delay }),
        withTiming(0.55, { duration: duration * 0.4 }),
        withTiming(0.05, { duration: duration * 0.6 }),
      ),
      -1,
      false,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const s = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
    opacity: opa.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        s,
      ]}
    />
  );
}

export default function OnboardingWelcome() {
  const insets = useSafeAreaInsets();
  const { colors, isDark, heroGradient, particleColor } = useTheme();
  const reduceMotion = useReduceMotion();

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const subOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const ctaY = useSharedValue(30);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 500 });
    titleY.value = withSpring(0, { damping: 22, stiffness: 180 });
    subOpacity.value = withDelay(250, withTiming(1, { duration: 400 }));
    ctaOpacity.value = withDelay(450, withTiming(1, { duration: 400 }));
    ctaY.value = withDelay(450, withSpring(0, { damping: 22, stiffness: 200 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subStyle = useAnimatedStyle(() => ({ opacity: subOpacity.value }));
  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaY.value }],
  }));

  const textColor = isDark ? '#FFFFFF' : '#1A1A3E';
  const subColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(26,26,62,0.65)';

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/categories');
  }

  return (
    <LinearGradient colors={heroGradient} style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {PARTICLE_DATA.map((p) => (
          <Particle key={p.id} {...p} color={particleColor} disabled={reduceMotion} />
        ))}
      </View>

      <View style={[styles.content, { paddingTop: insets.top + 120 }]}>
        <Animated.Text
          style={[styles.title, { color: textColor, textShadowColor: colors.accent + 'AA' }, titleStyle]}
          accessibilityRole="header"
        >
          FACT{'\n'}EXPLORER
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { color: subColor }, subStyle]}>
          Discover something worth{'\n'}knowing every day.
        </Animated.Text>
      </View>

      <Animated.View style={[styles.ctaWrap, { paddingBottom: insets.bottom + Layout.spacing.xl }, ctaStyle]}>
        <Pressable
          onPress={handleStart}
          accessibilityRole="button"
          accessibilityLabel="Get started"
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.accent },
            pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
          ]}
        >
          <Text style={styles.ctaText}>Get started</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.xl,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 60,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: Layout.spacing.lg,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  ctaWrap: {
    paddingHorizontal: Layout.spacing.xl,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: 18,
    borderRadius: Layout.radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
