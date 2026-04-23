import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompactFactCard } from '../../src/components/CompactFactCard';
import { SearchBar } from '../../src/components/SearchBar';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';
import { FACTS, searchFacts } from '../../src/data/facts';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colors, heroGradient } = useTheme();

  const [query, setQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(12);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 360 });
    headerTranslateY.value = withSpring(0, { damping: 20, stiffness: 220 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const isFiltering = query.trim().length > 0 || activeCategoryId !== null;

  const filtered = useMemo(() => {
    if (!isFiltering) return [];
    return searchFacts(query, { categoryId: activeCategoryId ?? undefined });
  }, [query, activeCategoryId, isFiltering]);

  const sections = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        category: cat,
        data: FACTS.filter((f) => f.categoryId === cat.id),
      })),
    [],
  );

  function handleChipPress(id: string | null) {
    Haptics.selectionAsync();
    setActiveCategoryId(id);
  }

  const Header = (
    <Animated.View style={[styles.header, { paddingTop: insets.top + Layout.spacing.md }, headerStyle]}>
      <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
        Explore
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {FACTS.length} facts across {CATEGORIES.length} categories
      </Text>

      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <Chip
          label="All"
          active={activeCategoryId === null}
          onPress={() => handleChipPress(null)}
          color={colors.accent}
        />
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.name}
            active={activeCategoryId === cat.id}
            onPress={() => handleChipPress(cat.id)}
            color={cat.color}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );

  return (
    <LinearGradient colors={heroGradient} style={styles.root}>
      {isFiltering ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
          ListHeaderComponent={Header}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search" size={42} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No facts match your search
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <CompactFactCard fact={item} animIndex={index} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={Header}
          renderSectionHeader={({ section: { category } }) => (
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={category.gradient}
                style={styles.sectionPill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.sectionPillText}>{category.name.toUpperCase()}</Text>
              </LinearGradient>
            </View>
          )}
          renderItem={({ item, index }) => (
            <CompactFactCard fact={item} animIndex={index} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
          SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </LinearGradient>
  );
}

function Chip({
  label,
  active,
  onPress,
  color,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  color: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? color : colors.surface,
          borderColor: active ? color : colors.separator,
        },
        pressed && { transform: [{ scale: 0.96 }] },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? '#FFFFFF' : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingBottom: Layout.spacing.md,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    paddingHorizontal: Layout.spacing.lg,
  },
  subtitle: {
    fontSize: 15,
    marginTop: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.lg,
  },
  searchWrap: {
    marginTop: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
  },
  chipRow: {
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  sectionHeader: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
  },
  sectionPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Layout.radius.full,
  },
  sectionPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xxl,
    gap: Layout.spacing.md,
  },
  emptyText: {
    fontSize: 15,
  },
});
