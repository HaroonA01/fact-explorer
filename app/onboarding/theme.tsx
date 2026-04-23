import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemePreference, useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { SCHEMES } from '../../src/data/schemes';

const MODES: { value: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export default function OnboardingTheme() {
  const insets = useSafeAreaInsets();
  const {
    colors,
    heroGradient,
    isDark,
    preference,
    setPreference,
    accentSchemeId,
    setAccentSchemeId,
  } = useTheme();

  function handleMode(p: ThemePreference) {
    Haptics.selectionAsync();
    setPreference(p);
  }

  function handleScheme(id: string) {
    Haptics.selectionAsync();
    setAccentSchemeId(id);
  }

  function handleContinue() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/notifications');
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
          <Text style={[styles.step, { color: colors.textTertiary }]}>Step 2 of 3</Text>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            Make it yours
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Choose your appearance. You can switch later in Settings.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>MODE</Text>
        <View style={styles.modeRow}>
          {MODES.map((m) => {
            const active = preference === m.value;
            return (
              <Pressable
                key={m.value}
                onPress={() => handleMode(m.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={m.label}
                style={[
                  styles.modeCard,
                  {
                    backgroundColor: active ? colors.accent : colors.surface,
                    borderColor: active ? colors.accent : colors.separator,
                  },
                ]}
              >
                <Ionicons
                  name={m.icon}
                  size={22}
                  color={active ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.modeLabel,
                    { color: active ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textTertiary, marginTop: Layout.spacing.lg }]}>
          ACCENT
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.schemeRow}
        >
          {SCHEMES.map((scheme) => {
            const active = accentSchemeId === scheme.id;
            const variant = isDark ? scheme.dark : scheme.light;
            return (
              <Pressable
                key={scheme.id}
                onPress={() => handleScheme(scheme.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={scheme.name}
                style={styles.schemeItem}
              >
                <View
                  style={[
                    styles.schemeOuter,
                    { borderColor: active ? variant.accent : 'transparent' },
                  ]}
                >
                  <LinearGradient
                    colors={variant.heroGradient}
                    style={styles.schemeCircle}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={[styles.schemeAccentDot, { backgroundColor: variant.accent }]} />
                  </LinearGradient>
                </View>
                <Text
                  style={[
                    styles.schemeName,
                    {
                      color: active ? variant.accent : colors.textTertiary,
                      fontWeight: active ? '700' : '400',
                    },
                  ]}
                >
                  {scheme.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + Layout.spacing.md, borderTopColor: colors.separator },
        ]}
      >
        <Pressable
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.accent },
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  modeRow: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  modeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.xs,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.lg,
    borderWidth: 1.5,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  schemeRow: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
  },
  schemeItem: {
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  schemeOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schemeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schemeAccentDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  schemeName: {
    fontSize: 11,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
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
