import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
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
import { FactCard } from '../../src/components/FactCard';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';
import { getFactsByCategory } from '../../src/data/facts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


// Ambient particles — smaller and subtler than home screen
const PARTICLE_COUNT = 7;
const PARTICLE_DATA = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: (i / PARTICLE_COUNT) * SCREEN_WIDTH + (((i * 41) % 50) - 25),
  y: SCREEN_HEIGHT * 0.08 + ((i * 71) % (SCREEN_HEIGHT * 0.8)),
  size: 2 + (i % 2) * 1.5,
  delay: i * 320,
  duration: 4500 + (i % 4) * 950,
}));

function Particle({
  x, y, size, delay, duration, color,
}: (typeof PARTICLE_DATA)[0] & { color: string }) {
  const ty = useSharedValue(0);
  const opa = useSharedValue(0);

  useEffect(() => {
    ty.value = withRepeat(
      withTiming(-80, { duration, easing: Easing.linear }),
      -1,
      false,
    );
    opa.value = withRepeat(
      withSequence(
        withTiming(0, { duration: delay }),
        withTiming(0.16, { duration: duration * 0.35 }),
        withTiming(0.16, { duration: duration * 0.3 }),
        withTiming(0, { duration: duration * 0.35 }),
      ),
      -1,
      false,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
    opacity: opa.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        { left: x, top: y, width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        style,
      ]}
    />
  );
}

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors, heroGradient, particleColor } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<any>(null);
  const mountedRef = useRef(false);

  const scrollX = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const counterOpacity = useSharedValue(1);
  const counterTranslateY = useSharedValue(0);

  const category = CATEGORIES.find((c) => c.id === id);
  const facts = getFactsByCategory(id ?? '');

  const onScrollFlatList = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = e.nativeEvent.contentOffset.x;
  };

  useEffect(() => {
    if (!category || facts.length === 0) return;

    const targetWidth = ((activeIndex + 1) / facts.length) * SCREEN_WIDTH;
    progressWidth.value = withSpring(targetWidth, { damping: 20, stiffness: 200 });

    // Skip counter animation on initial mount
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    counterOpacity.value = withSequence(
      withTiming(0, { duration: 90 }),
      withTiming(1, { duration: 150 }),
    );
    counterTranslateY.value = withSequence(
      withTiming(6, { duration: 90 }),
      withTiming(0, { duration: 150 }),
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const progressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  const counterStyle = useAnimatedStyle(() => ({
    opacity: counterOpacity.value,
    transform: [{ translateY: counterTranslateY.value }],
  }));

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
    <LinearGradient colors={heroGradient} style={styles.root}>
      {/* Ambient particles behind everything */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {PARTICLE_DATA.map((p) => (
          <Particle key={p.id} {...p} color={particleColor} />
        ))}
      </View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Layout.spacing.sm }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.9)" />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={[styles.categoryPill, { backgroundColor: category.color + '30' }]}>
            <Text style={[styles.categoryLabel, { color: category.color }]}>
              {category.name}
            </Text>
          </View>
          <Animated.View style={counterStyle}>
            <Text style={styles.factCount}>
              {activeIndex + 1} of {facts.length}
            </Text>
          </Animated.View>
        </View>

        <View style={styles.backButton} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, { backgroundColor: category.color }, progressStyle]} />
      </View>

      {/* Dot navigator */}
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
                  i === activeIndex ? category.color : 'rgba(255,255,255,0.3)',
              },
              i === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Fact pager */}
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
        onScroll={onScrollFlatList}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <FactCard
              fact={item}
              visible={index === activeIndex}
              scrollX={scrollX}
              index={index}
            />
          </View>
        )}
        style={styles.pager}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  particle: { position: 'absolute' },
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
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
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
  factCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  progressTrack: {
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: Layout.spacing.md,
    borderRadius: Layout.radius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: 2.5,
    borderRadius: Layout.radius.full,
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
    backgroundColor: 'transparent',
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
