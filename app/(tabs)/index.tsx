import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedCategoryCard } from '../../src/components/AnimatedCategoryCard';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { SwipeUpHint } from '../../src/components/SwipeUpHint';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const PARTICLE_COUNT = 12;
const PARTICLE_DATA = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: (i / PARTICLE_COUNT) * SCREEN_WIDTH + (((i * 37) % 60) - 30),
  y: SCREEN_HEIGHT * 0.05 + ((i * 67) % (SCREEN_HEIGHT * 0.82)),
  size: 2 + (i % 3) * 1.5,
  delay: i * 250,
  duration: 4000 + (i % 5) * 800,
}));

function Particle({
  x,
  y,
  size,
  delay,
  duration,
  color,
}: (typeof PARTICLE_DATA)[0] & { color: string }) {
  const ty = useSharedValue(0);
  const opa = useSharedValue(0);

  useEffect(() => {
    ty.value = withRepeat(
      withTiming(-90, { duration, easing: Easing.linear }),
      -1,
      false,
    );
    opa.value = withRepeat(
      withSequence(
        withTiming(0, { duration: delay }),
        withTiming(0.65, { duration: Math.round(duration * 0.4) }),
        withTiming(0.05, { duration: Math.round(duration * 0.6) }),
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
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [showLoader, setShowLoader] = useState(true);
  const scrollY = useSharedValue(0);

  const titleScale = useSharedValue(0.45);
  const titleOpacity = useSharedValue(0);
  const titleGlow = useSharedValue(4);

  const heroGradient: [string, string, string] = isDark
    ? ['#05050F', '#0A0A1A', '#1A1A2E']
    : ['#E8F0FE', '#C7D8F8', '#A8C4F0'];

  const heroTextColor = isDark ? '#FFFFFF' : '#1A1A3E';
  const heroSubColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(26,26,62,0.65)';
  const heroGreetColor = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(26,26,62,0.55)';
  const particleColor = isDark ? '#7EB8FF' : '#4A7FBF';
  const rootBg = isDark ? '#1A1A2E' : '#A8C4F0';
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  // Floating title Y: hero position → sticky top position
  // Hero center ≈ insets.top + (SCREEN_HEIGHT - insets.top) * 0.42 (approx title top)
  const TITLE_START_Y = insets.top + (SCREEN_HEIGHT - insets.top) * 0.42;
  const TITLE_END_Y = insets.top + 14;
  const SCROLL_RANGE = TITLE_START_Y - TITLE_END_Y;

  function handleFinish() {
    setShowLoader(false);
    titleScale.value = withSpring(1, { damping: 18, stiffness: 180 });
    titleOpacity.value = withTiming(1, { duration: 400 });
    titleGlow.value = withRepeat(
      withSequence(
        withTiming(14, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
        withTiming(4, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Floating title container: slides from hero Y → sticky header Y
  const floatingContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, SCROLL_RANGE], [TITLE_START_Y, TITLE_END_Y], 'clamp') },
    ],
  }));

  // Load animation (scale + opacity after loader finishes) — wraps hero-size title
  const titleLoadWrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  // Hero title scrolls out in first half of SCROLL_RANGE
  const heroTitleAlphaStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, SCROLL_RANGE * 0.5], [1, 0], 'clamp'),
  }));

  // Header title fades in during second half of SCROLL_RANGE
  const headerAlphaStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [SCROLL_RANGE * 0.5, SCROLL_RANGE], [0, 1], 'clamp'),
  }));

  // Glow pulse on hero title text
  const titleGlowStyle = useAnimatedStyle(() => ({
    textShadowRadius: titleGlow.value,
  }));

  // Greeting + subtitle fade out as title moves toward header
  const heroSupportStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, SCROLL_RANGE * 0.55], [1, 0], 'clamp'),
  }));

  const hintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 100], [1, 0], 'clamp'),
  }));

  return (
    <View style={[styles.root, { backgroundColor: rootBg }]}>
      <StatusBar barStyle={statusBarStyle} />

      {/* Single floating title — tracks from hero center to sticky header */}
      <Animated.View style={[styles.floatingTitle, floatingContainerStyle]} pointerEvents="none">
        {/* Hero-size title: load anim + fades out on scroll */}
        <Animated.View style={titleLoadWrapStyle}>
          <Animated.View style={heroTitleAlphaStyle}>
            <Animated.Text
              style={[styles.floatingHeroText, { color: heroTextColor }, titleGlowStyle]}
            >
              FACT EXPLORER
            </Animated.Text>
          </Animated.View>
        </Animated.View>
        {/* Header-size title: fades in as it reaches top */}
        <Animated.Text style={[styles.floatingHeaderText, { color: heroTextColor }, headerAlphaStyle]}>
          FACT EXPLORER
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={heroGradient}
          style={{ height: SCREEN_HEIGHT, paddingTop: insets.top, overflow: 'hidden' }}
        >
          {PARTICLE_DATA.map((p) => (
            <Particle key={p.id} {...p} color={particleColor} />
          ))}

          {/* Greeting + subtitle — title removed, replaced by floating element above */}
          <View style={styles.heroContent}>
            <Animated.View style={heroSupportStyle}>
              <Text style={[styles.greeting, { color: heroGreetColor }]}>{getGreeting()}</Text>
            </Animated.View>
            {/* Spacer preserving space where the hero title sits (two lines at lineHeight 60) */}
            <View style={styles.titleSpacer} />
            <Animated.View style={heroSupportStyle}>
              <Text style={[styles.heroSubtitle, { color: heroSubColor }]}>
                Discover something new every day
              </Text>
            </Animated.View>
          </View>

          <Animated.View style={[styles.hintContainer, hintStyle]}>
            <SwipeUpHint color={isDark ? 'rgba(255,255,255,0.9)' : 'rgba(26,26,62,0.75)'} />
          </Animated.View>
        </LinearGradient>

        {/* Categories — transparent so gradient continues behind */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.categoriesTitle, { color: heroTextColor }]}>Categories</Text>
          {CATEGORIES.map((cat, i) => (
            <AnimatedCategoryCard key={cat.id} category={cat} index={i} visible={true} />
          ))}
          <View style={{ height: insets.bottom + 90 }} />
        </View>
      </Animated.ScrollView>

      {showLoader && <LoadingScreen onFinish={handleFinish} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  // Floating title: absolutely positioned, moves from hero → sticky header
  floatingTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 20,
    alignItems: 'center',
  },
  floatingHeroText: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 60,
    textAlign: 'center',
    textShadowColor: 'rgba(100,160,255,0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  floatingHeaderText: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.xl,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.3,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  // Invisible spacer that reserves layout space where the floating hero title sits
  titleSpacer: {
    height: 120,
    marginBottom: Layout.spacing.md,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: '300',
    letterSpacing: 0.2,
    textAlign: 'center',
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
