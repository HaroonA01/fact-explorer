import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedCategoryCard } from '../../src/components/AnimatedCategoryCard';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { SwipeUpHint } from '../../src/components/SwipeUpHint';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [showLoader, setShowLoader] = useState(true);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const heroContentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, SCREEN_HEIGHT],
          [0, SCREEN_HEIGHT * 0.35],
          'clamp',
        ),
      },
      {
        scale: interpolate(scrollY.value, [0, 400], [1, 0.9], 'clamp'),
      },
    ],
    opacity: interpolate(scrollY.value, [0, SCREEN_HEIGHT * 0.45], [1, 0], 'clamp'),
  }));

  const hintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 100], [1, 0], 'clamp'),
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={['#1A1A2E', '#16213E', '#0F3460']}
          style={{ height: SCREEN_HEIGHT, paddingTop: insets.top }}
        >
          <Animated.View style={[styles.heroContent, heroContentStyle]}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.heroTitle}>FACT{'\n'}EXPLORER</Text>
            <Text style={styles.heroSubtitle}>Discover something new every day</Text>
          </Animated.View>
          <Animated.View style={[styles.hintContainer, hintStyle]}>
            <SwipeUpHint />
          </Animated.View>
        </LinearGradient>

        {/* Categories */}
        <View style={[styles.categoriesSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.categoriesTitle, { color: colors.text }]}>Categories</Text>
          {CATEGORIES.map((cat, i) => (
            <AnimatedCategoryCard key={cat.id} category={cat} index={i} visible={true} />
          ))}
          <View style={{ height: insets.bottom + 90 }} />
        </View>
      </Animated.ScrollView>

      {showLoader && <LoadingScreen onFinish={() => setShowLoader(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F3460',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.xl,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '400',
    letterSpacing: 0.3,
    marginBottom: Layout.spacing.sm,
  },
  heroTitle: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 60,
    marginBottom: Layout.spacing.md,
  },
  heroSubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '300',
    letterSpacing: 0.2,
  },
  hintContainer: {
    alignItems: 'center',
    paddingBottom: 110,
  },
  categoriesSection: {
    paddingTop: Layout.spacing.xl,
  },
  categoriesTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
});
