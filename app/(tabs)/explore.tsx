import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
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

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: insets.top + Layout.spacing.md }]}>
            <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
            <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
              {FACTS.length} facts across {CATEGORIES.length} categories
            </Text>
          </View>
        }
        renderSectionHeader={({ section: { category } }) => (
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={category.gradient}
              style={styles.sectionDot}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {category.name}
            </Text>
          </View>
        )}
        renderItem={({ item }) => <CompactFactCard fact={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  sectionDot: {
    width: 12,
    height: 12,
    borderRadius: Layout.radius.full,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
