import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompactFactCard } from '../../src/components/CompactFactCard';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';
import { FACTS } from '../../src/data/facts';

const sections = CATEGORIES.map((cat) => ({
  category: cat,
  data: FACTS.filter((f) => f.categoryId === cat.id),
}));

// Pre-compute flat global index for stagger animations
const flatIndexMap = new Map<string, number>();
let _idx = 0;
sections.forEach((s) => s.data.forEach((f) => { flatIndexMap.set(f.id, _idx++); }));

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colors, heroGradient } = useTheme();

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

  return (
    <LinearGradient colors={heroGradient} style={styles.root}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <Animated.View style={[styles.header, { paddingTop: insets.top + Layout.spacing.md }, headerStyle]}>
            <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {FACTS.length} facts across {CATEGORIES.length} categories
            </Text>
          </Animated.View>
        }
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
        renderItem={({ item }) => (
          <CompactFactCard fact={item} animIndex={flatIndexMap.get(item.id) ?? 0} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
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
});
