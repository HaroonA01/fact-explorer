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

const HEADER_SCALE = 17 / 56;
const HERO_TEXT_HALF_H = 30; // lineHeight 60 / 2

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark, heroGradient, particleColor } = useTheme();
  const [showLoader, setShowLoader] = useState(true);
  const scrollY = useSharedValue(0);

  const titleScale = useSharedValue(0.45);
  const titleOpacity = useSharedValue(0);
  const titleGlow = useSharedValue(4);

  const heroTextColor = isDark ? '#FFFFFF' : '#1A1A3E';
  const heroSubColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(26,26,62,0.65)';
  const heroGreetColor = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(26,26,62,0.55)';
  const rootBg = heroGradient[2];
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  const TITLE_START_Y = insets.top + (SCREEN_HEIGHT - insets.top) * 0.42;
  // Account for scale transform around center: visual top = TITLE_END_Y + HERO_TEXT_HALF_H*(1-HEADER_SCALE)
  const TITLE_END_Y = insets.top + 14 - HERO_TEXT_HALF_H * (1 - HEADER_SCALE);
  const SCROLL_RANGE = TITLE_START_Y - TITLE_END_Y;
  // Greeting sits directly above the floating title; 52 = line-height(20) + marginBottom xl(32)
  const greetingOffset = (SCREEN_HEIGHT - insets.top) * 0.42 - 52;

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

  // Single title: shrinks + slides from hero center to sticky header position
  const floatingContainerStyle = useAnimatedStyle(() => {
    const scrollScaleFactor = interpolate(scrollY.value, [0, SCROLL_RANGE], [1, HEADER_SCALE], 'clamp');
    const combinedScale = titleScale.value * scrollScaleFactor;
    const ty = interpolate(scrollY.value, [0, SCROLL_RANGE], [TITLE_START_Y, TITLE_END_Y], 'clamp');
    return {
      transform: [{ translateY: ty }, { scale: combinedScale }],
      opacity: titleOpacity.value,
    };
  });

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

      {/* Fixed gradient background — always fills screen regardless of scroll */}
      <LinearGradient colors={heroGradient} style={StyleSheet.absoluteFill} />

      {/* Root-level particle layer — persists behind categories as you scroll */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {PARTICLE_DATA.map((p) => (
          <Particle key={`bg-${p.id}`} {...p} color={particleColor} />
        ))}
      </View>

      {/* Single floating title — shrinks and slides from hero center to sticky header */}
      <Animated.View style={[styles.floatingTitle, floatingContainerStyle]} pointerEvents="none">
        <Animated.Text
          style={[
            styles.floatingHeroText,
            { color: heroTextColor, textShadowColor: colors.accent + 'CC' },
            titleGlowStyle,
          ]}
        >
          FACT EXPLORER
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToOffsets={[SCREEN_HEIGHT * 0.8]}
        decelerationRate="fast"
      >
        {/* Hero area — transparent (gradient is fixed behind) */}
        <View style={{ height: SCREEN_HEIGHT, paddingTop: insets.top }}>
          {/* Greeting + subtitle */}
          <View style={[styles.heroContent, { paddingTop: greetingOffset }]}>
            <Animated.View style={heroSupportStyle}>
              <Text style={[styles.greeting, { color: heroGreetColor }]}>{getGreeting()}</Text>
            </Animated.View>
            {/* Spacer reserving layout space where the hero title sits */}
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
        </View>

        {/* Categories — transparent so gradient + particles show behind */}
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
  floatingTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 20,
    alignItems: 'flex-start',
    paddingLeft: Layout.spacing.xl,
  },
  floatingHeroText: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 60,
    textAlign: 'left',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  heroContent: {
    paddingHorizontal: Layout.spacing.xl,
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.3,
    marginBottom: Layout.spacing.xl,
    textAlign: 'left',
  },
  titleSpacer: {
    height: 120,
    marginBottom: Layout.spacing.xl,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: '300',
    letterSpacing: 0.2,
    textAlign: 'left',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  categoriesSection: {
    paddingTop: 0,
  },
  categoriesTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
});
