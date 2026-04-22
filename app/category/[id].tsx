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
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';
import { getFactsByCategory } from '../../src/data/facts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
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
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textTertiary }]}>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Layout.spacing.sm }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={[styles.backButton, { backgroundColor: colors.surfaceSecondary }]}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.categoryLabel, { color: category.color }]}>{category.name}</Text>
          <Text style={[styles.factCount, { color: colors.textTertiary }]}>
            {activeIndex + 1} of {facts.length}
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <View style={styles.dots}>
        {facts.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index: i, animated: true });
            }}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === activeIndex ? category.color : colors.separator,
              },
              i === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={facts}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        bounces={false}
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
  root: { flex: 1 },
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
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  factCount: {
    fontSize: 13,
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
  pager: { flex: 1 },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
  },
});
