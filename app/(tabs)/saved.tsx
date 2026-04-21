import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompactFactCard } from '../../src/components/CompactFactCard';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { FACTS } from '../../src/data/facts';
import { useSavedFacts } from '../../src/hooks/useSavedFacts';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { savedIds, loaded } = useSavedFacts();
  const savedFacts = FACTS.filter((f) => savedIds.has(f.id));

  return (
    <View style={styles.root}>
      <FlatList
        data={savedFacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + Layout.spacing.md, paddingBottom: insets.bottom + 90 },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Saved</Text>
            {loaded && savedFacts.length > 0 && (
              <Text style={styles.subtitle}>{savedFacts.length} fact{savedFacts.length !== 1 ? 's' : ''} saved</Text>
            )}
          </View>
        }
        renderItem={({ item }) => <CompactFactCard fact={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={
          loaded ? (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="bookmark-outline" size={36} color={Colors.textTertiary} />
              </View>
              <Text style={styles.emptyTitle}>Nothing saved yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the bookmark icon on any fact to save it here for later.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textTertiary,
    marginTop: Layout.spacing.xs,
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
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.sm,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
