import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';
import { CATEGORIES } from '../data/categories';
import { Fact } from '../data/facts';

type Props = {
  fact: Fact;
  delay?: number;
};

export function DailyFactCard({ fact, delay = 0 }: Props) {
  const { colors, isDark } = useTheme();
  const category = CATEGORIES.find((c) => c.id === fact.categoryId);
  const accent = category?.color ?? colors.accent;
  const gradient: [string, string] = category?.gradient ?? [accent, accent];

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 200 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: pressScale.value }],
  }));

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/fact/${fact.id}`);
  }

  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  return (
    <Animated.View style={[styles.wrapper, wrapperStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => {
          pressScale.value = withSpring(0.98, { damping: 16, stiffness: 400 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 14, stiffness: 320 });
        }}
        accessibilityRole="button"
        accessibilityLabel={`Today's fact: ${fact.title}`}
        style={[styles.card, { backgroundColor: cardBg, borderColor }]}
      >
        <View style={styles.topRow}>
          <LinearGradient
            colors={gradient}
            style={styles.kicker}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="sparkles" size={11} color="#FFFFFF" />
            <Text style={styles.kickerText}>FACT OF THE DAY</Text>
          </LinearGradient>
          {category && (
            <Text style={[styles.categoryLabel, { color: accent }]}>
              {category.name}
            </Text>
          )}
        </View>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={3}>
          {fact.title}
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={2}>
          {fact.body}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.readCta, { color: accent }]}>Read fact</Text>
          <Ionicons name="arrow-forward" size={14} color={accent} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  card: {
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  kicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Layout.radius.full,
  },
  kickerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: Layout.spacing.xs,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Layout.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readCta: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
