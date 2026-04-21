import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  PanResponder,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedCategoryCard } from '../../src/components/AnimatedCategoryCard';
import { LoadingScreen } from '../../src/components/LoadingScreen';
import { SwipeUpHint } from '../../src/components/SwipeUpHint';
import { Colors } from '../../src/constants/colors';
import { Layout } from '../../src/constants/layout';
import { CATEGORIES } from '../../src/data/categories';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;
const DISMISS_THRESHOLD = 60;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [showLoader, setShowLoader] = useState(true);
  const [sheetVisible, setSheetVisible] = useState(false);
  const sheetY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const isOpen = useRef(false);

  function openSheet() {
    if (isOpen.current) return;
    isOpen.current = true;
    setSheetVisible(true);
    sheetY.value = withSpring(0, { damping: 26, stiffness: 280 });
    backdropOpacity.value = withTiming(1, { duration: 300 });
  }

  function closeSheet() {
    if (!isOpen.current) return;
    isOpen.current = false;
    sheetY.value = withSpring(SHEET_HEIGHT, { damping: 24, stiffness: 260 });
    backdropOpacity.value = withTiming(0, { duration: 250 });
    setTimeout(() => setSheetVisible(false), 400);
  }

  const homePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy < -20 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dy < -DISMISS_THRESHOLD) openSheet();
      },
    }),
  ).current;

  const sheetPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.value = g.dy;
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > DISMISS_THRESHOLD) {
          closeSheet();
        } else {
          sheetY.value = withSpring(0, { damping: 24, stiffness: 280 });
        }
      },
    }),
  ).current;

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={[styles.hero, { paddingTop: insets.top }]}
        {...homePanResponder.panHandlers}
      >
        <View style={styles.heroContent}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.heroTitle}>FACT{'\n'}EXPLORER</Text>
          <Text style={styles.heroSubtitle}>Discover something new every day</Text>
        </View>
        <View style={styles.hintContainer}>
          <SwipeUpHint />
        </View>
      </LinearGradient>

      {/* Backdrop (tap to close) */}
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={sheetVisible ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
      </Animated.View>

      {/* Categories sheet */}
      <Animated.View style={[styles.sheet, { height: SHEET_HEIGHT }, sheetStyle]}>
        <View style={styles.sheetHandle} {...sheetPanResponder.panHandlers}>
          <View style={styles.handleBar} />
          <Text style={styles.sheetTitle}>Categories</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        >
          {CATEGORIES.map((cat, i) => (
            <AnimatedCategoryCard
              key={cat.id}
              category={cat}
              index={i}
              visible={sheetVisible}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Loading screen */}
      {showLoader && <LoadingScreen onFinish={() => setShowLoader(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    flex: 1,
    justifyContent: 'space-between',
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
    paddingBottom: 120,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    zIndex: 20,
    ...Layout.shadow.lg,
  },
  sheetHandle: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.md,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: Colors.separator,
    borderRadius: Layout.radius.full,
    alignSelf: 'center',
    marginBottom: Layout.spacing.md,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.4,
  },
});
