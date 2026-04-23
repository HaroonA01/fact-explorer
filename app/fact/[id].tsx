import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FactCard } from '../../src/components/FactCard';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';
import { getFactById } from '../../src/data/facts';

export default function FactScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors, heroGradient } = useTheme();
  const scrollX = useSharedValue(0);

  const fact = getFactById(id ?? '');
  const category = fact ? CATEGORIES.find((c) => c.id === fact.categoryId) : undefined;

  if (!fact) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textTertiary }]}>Fact not found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={heroGradient} style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + Layout.spacing.sm }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (router.canGoBack()) router.back();
            else router.replace('/');
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

        {category && (
          <View style={[styles.categoryPill, { backgroundColor: category.color + '30' }]}>
            <Text style={[styles.categoryLabel, { color: category.color }]}>
              {category.name}
            </Text>
          </View>
        )}

        <View style={styles.backButton} />
      </View>

      <View style={{ flex: 1 }}>
        <FactCard fact={fact} visible scrollX={scrollX} index={0} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Layout.radius.full,
  },
  categoryLabel: {
    fontSize: 14,
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
