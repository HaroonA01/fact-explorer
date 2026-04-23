import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompactFactCard } from '../../../src/components/CompactFactCard';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { Layout } from '../../../src/constants/layout';
import { CATEGORIES } from '../../../src/data/categories';
import { getFactsByCategory } from '../../../src/data/facts';

export default function CategoryLandingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors, heroGradient } = useTheme();

  const category = CATEGORIES.find((c) => c.id === id);
  const facts = getFactsByCategory(id ?? '');

  const heroOpacity = useSharedValue(0);
  const heroTranslate = useSharedValue(16);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 360 });
    heroTranslate.value = withDelay(60, withSpring(0, { damping: 22, stiffness: 220 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslate.value }],
  }));

  if (!category) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textTertiary }]}>Category not found</Text>
      </View>
    );
  }

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/category/${category!.id}/read`);
  }

  return (
    <LinearGradient colors={heroGradient} style={styles.root}>
      <View style={[styles.headerBar, { paddingTop: insets.top + Layout.spacing.sm }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.9)" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 130 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.hero, heroStyle]}>
          <LinearGradient
            colors={category.gradient}
            style={styles.heroIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name={category.iconName as keyof typeof Ionicons.glyphMap}
              size={34}
              color="#FFFFFF"
            />
          </LinearGradient>
          <Text
            style={[styles.heroName, { color: colors.text }]}
            accessibilityRole="header"
          >
            {category.name}
          </Text>
          <Text style={[styles.heroDescription, { color: colors.textSecondary }]}>
            {category.description}
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.statPill, { backgroundColor: category.color + '25' }]}>
              <Ionicons name="sparkles" size={13} color={category.color} />
              <Text style={[styles.statPillText, { color: category.color }]}>
                {facts.length} facts
              </Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: colors.surface }]}>
              <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
              <Text style={[styles.statPillText, { color: colors.textSecondary }]}>
                ~{Math.max(1, Math.round(facts.length * 0.5))} min read
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.previewHeader}>
          <Text style={[styles.previewTitle, { color: colors.text }]}>In this category</Text>
        </View>

        {facts.map((fact, i) => (
          <CompactFactCard key={fact.id} fact={fact} animIndex={i} />
        ))}
      </ScrollView>

      <View
        style={[
          styles.ctaBar,
          {
            paddingBottom: insets.bottom + Layout.spacing.md,
            backgroundColor: colors.background + 'F2',
            borderTopColor: colors.separator,
          },
        ]}
      >
        <Pressable
          onPress={handleStart}
          accessibilityRole="button"
          accessibilityLabel={`Start reading ${facts.length} ${category.name} facts`}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <LinearGradient
            colors={category.gradient}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Start reading</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  backButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.28)',
    transform: [{ scale: 0.92 }],
  },
  hero: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.lg,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  heroName: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.2,
    marginBottom: Layout.spacing.xs,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: Layout.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.xs,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Layout.radius.full,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  previewHeader: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  ctaButton: {
    borderRadius: Layout.radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: 16,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
  },
});
