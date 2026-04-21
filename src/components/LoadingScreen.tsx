import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  onFinish: () => void;
};

export function LoadingScreen({ onFinish }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const shimmerX = useSharedValue(-SCREEN_WIDTH);
  const containerOpacity = useSharedValue(1);
  const containerTranslateY = useSharedValue(0);

  useEffect(() => {
    // Fade + scale in
    opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) });
    scale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) });

    // Shimmer sweep
    shimmerX.value = withDelay(
      400,
      withSequence(
        withTiming(SCREEN_WIDTH, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(SCREEN_WIDTH * 2, { duration: 0 }),
      ),
    );

    // Exit
    containerOpacity.value = withDelay(
      2200,
      withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) }, (finished) => {
        if (finished) {
          // callback in JS thread after animation
        }
      }),
    );
    containerTranslateY.value = withDelay(
      2200,
      withTiming(-30, { duration: 500, easing: Easing.in(Easing.quad) }),
    );

    const timer = setTimeout(onFinish, 2700);
    return () => clearTimeout(timer);
  }, [containerOpacity, containerTranslateY, onFinish, opacity, scale, shimmerX]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ translateY: containerTranslateY.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.logoContainer}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.shimmer, shimmerStyle]} />
          <Text style={styles.wordmark}>FACT EXPLORER</Text>
        </View>
        <Text style={styles.tagline}>Discover something new</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    overflow: 'hidden',
    borderRadius: 4,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 4,
  },
  shimmer: {
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.7)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 1,
  },
  tagline: {
    fontSize: 15,
    color: Colors.textTertiary,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});
