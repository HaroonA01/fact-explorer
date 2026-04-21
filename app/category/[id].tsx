import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FactCard } from '../../src/components/FactCard';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';
import { getFactsByCategory } from '../../src/data/facts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const category = CATEGORIES.find((c) => c.id === id);
  const facts = getFactsByCategory(id ?? '');

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  if (!category || facts.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Layout.spacing.sm }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.categoryLabel}>{category.name}</Text>
          <Text style={styles.factCount}>
            {activeIndex + 1} of {facts.length}
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {facts.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index: i, animated: true });
            }}
            style={[
              styles.dot,
              { backgroundColor: i === activeIndex ? category.color : Colors.separator },
              i === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Facts pager */}
      <FlatList
        ref={flatListRef}
        data={facts}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <FactCard fact={item} visible={index === activeIndex} />
          </View>
        )}
        style={styles.pager}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
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
    backgroundColor: Colors.surfaceSecondary,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  factCount: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
  },
  dot: {
    height: 6,
    borderRadius: Layout.radius.full,
    width: 6,
  },
  dotActive: {
    width: 20,
  },
  pager: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.textTertiary,
    fontSize: 16,
  },
});
