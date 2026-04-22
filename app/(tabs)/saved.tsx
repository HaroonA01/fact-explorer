import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompactFactCard } from '../../src/components/CompactFactCard';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';
import { FACTS } from '../../src/data/facts';
import { useSavedFacts } from '../../src/hooks/useSavedFacts';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { savedIds, loaded } = useSavedFacts();
  const { colors, heroGradient } = useTheme();

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(12);
  const emptyIconScale = useSharedValue(1);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 360 });
    headerTranslateY.value = withSpring(0, { damping: 20, stiffness: 220 });
    emptyIconScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const emptyIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emptyIconScale.value }],
  }));

  const savedFacts = FACTS.filter((f) => savedIds.has(f.id));

  const sections = CATEGORIES.map((cat) => ({
    category: cat,
    data: savedFacts.filter((f) => f.categoryId === cat.id),
  })).filter((s) => s.data.length > 0);

  // Pre-compute flat index for stagger (recomputed per render as savedFacts changes)
  const flatIndexMap = new Map<string, number>();
  let idx = 0;
  sections.forEach((s) => s.data.forEach((f) => { flatIndexMap.set(f.id, idx++); }));

  const totalCount = savedFacts.length;

  return (
    <LinearGradient colors={heroGradient} style={styles.root}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + Layout.spacing.md, paddingBottom: insets.bottom + 90 },
        ]}
        ListHeaderComponent={
          <Animated.View style={[styles.header, headerStyle]}>
            <Text style={[styles.title, { color: colors.text }]}>Saved</Text>
            {loaded && totalCount > 0 && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {totalCount} fact{totalCount !== 1 ? 's' : ''} saved
              </Text>
            )}
          </Animated.View>
        }
        renderSectionHeader={({ section: { category, data } }) => (
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={category.gradient}
              style={styles.sectionPill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionPillText}>{category.name.toUpperCase()}</Text>
            </LinearGradient>
            <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.badgeText}>{data.length}</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <CompactFactCard fact={item} animIndex={flatIndexMap.get(item.id) ?? 0} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        SectionSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={
          loaded ? (
            <View style={styles.empty}>
              <Animated.View style={[styles.emptyIcon, { backgroundColor: 'rgba(255,255,255,0.12)' }, emptyIconStyle]}>
                <Ionicons name="bookmark-outline" size={36} color="rgba(255,255,255,0.7)" />
              </Animated.View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing saved yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Tap the bookmark icon on any fact to save it here for later.
              </Text>
            </View>
          ) : null
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { flexGrow: 1 },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    marginTop: Layout.spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  sectionPill: {
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Layout.radius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Layout.spacing.xxl,
    gap: Layout.spacing.md,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: Layout.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.sm,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
