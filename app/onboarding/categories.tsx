import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';
import { useFavoriteCategories } from '../../src/hooks/useFavoriteCategories';

export default function OnboardingCategories() {
  const insets = useSafeAreaInsets();
  const { colors, heroGradient } = useTheme();
  const { save } = useFavoriteCategories();
  const [selected, setSelected] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.id)),
  );

  function toggle(id: string) {
    Haptics.selectionAsync();
    const next = new Set(selected);
    if (next.has(id)) {
      if (next.size > 1) next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  }

  async function handleContinue() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await save(selected);
    router.push('/onboarding/theme');
  }

  return (
    <LinearGradient colors={heroGradient} style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Layout.spacing.xl,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.step, { color: colors.textTertiary }]}>Step 1 of 3</Text>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            What interests you?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Pick the topics you&apos;d like to explore. You can change this any time.
          </Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map((cat) => {
            const isOn = selected.has(cat.id);
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggle(cat.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isOn }}
                accessibilityLabel={cat.name}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: isOn ? cat.color : colors.surface,
                    borderColor: isOn ? cat.color : colors.separator,
                  },
                  pressed && { transform: [{ scale: 0.97 }] },
                ]}
              >
                <Ionicons
                  name={cat.iconName as keyof typeof Ionicons.glyphMap}
                  size={18}
                  color={isOn ? '#FFFFFF' : cat.color}
                />
                <Text
                  style={[
                    styles.chipLabel,
                    { color: isOn ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + Layout.spacing.md, borderTopColor: colors.separator },
        ]}
      >
        <Pressable
          onPress={handleContinue}
          disabled={selected.size === 0}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: colors.accent,
              opacity: selected.size === 0 ? 0.5 : 1,
            },
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.ctaText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  step: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: Layout.radius.full,
    borderWidth: 1.5,
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'transparent',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: 16,
    borderRadius: Layout.radius.full,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
