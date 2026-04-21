import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PARTICLE_DATA = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: (i / 16) * SCREEN_WIDTH + (((i * 37) % 60) - 30),
  y: SCREEN_HEIGHT * 0.05 + ((i * 67) % (SCREEN_HEIGHT * 0.82)),
  size: 2 + (i % 3) * 1.5,
  delay: i * 210,
  duration: 3200 + (i % 5) * 700,
}));

function Particle({
  x,
  y,
  size,
  delay,
  duration,
}: (typeof PARTICLE_DATA)[0]) {
  const ty = useSharedValue(0);
  const opa = useSharedValue(0);

  useEffect(() => {
    ty.value = withRepeat(
      withDelay(delay, withTiming(-85, { duration, easing: Easing.linear })),
      -1,
      false,
    );
    opa.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(0.75, { duration: Math.round(duration * 0.4) }),
          withTiming(0.1, { duration: Math.round(duration * 0.6) }),
        ),
      ),
      -1,
      false,
    );
  }, [delay, duration, opa, ty]);

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
          backgroundColor: '#7EB8FF',
        },
        style,
      ]}
    />
  );
}

type Props = {
  onFinish: () => void;
};

export function LoadingScreen({ onFinish }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const shimmerX = useSharedValue(-SCREEN_WIDTH);
  const containerOpacity = useSharedValue(1);
  const containerTranslateY = useSharedValue(0);
  const glowRadius = useSharedValue(4);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) });
    scale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) });

    shimmerX.value = withDelay(
      400,
      withSequence(
        withTiming(SCREEN_WIDTH, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(SCREEN_WIDTH * 2, { duration: 0 }),
      ),
    );

    glowRadius.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(5, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );

    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.7, { duration: 1800, easing: Easing.out(Easing.quad) }),
        withTiming(0.8, { duration: 0 }),
      ),
      -1,
      false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1800, easing: Easing.out(Easing.quad) }),
        withTiming(0.5, { duration: 0 }),
      ),
      -1,
      false,
    );

    containerOpacity.value = withDelay(
      2200,
      withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) }),
    );
    containerTranslateY.value = withDelay(
      2200,
      withTiming(-30, { duration: 500, easing: Easing.in(Easing.quad) }),
    );

    const timer = setTimeout(onFinish, 2700);
    return () => clearTimeout(timer);
  }, [
    containerOpacity,
    containerTranslateY,
    glowRadius,
    onFinish,
    opacity,
    ringOpacity,
    ringScale,
    scale,
    shimmerX,
  ]);

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

  const glowStyle = useAnimatedStyle(() => ({
    textShadowRadius: glowRadius.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={['#05050F', '#0A0A1A', '#1A1A2E']}
        style={StyleSheet.absoluteFill}
      />
      {PARTICLE_DATA.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
      <Animated.View style={[styles.ring, ringStyle]} />
      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.logoContainer}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.shimmer, shimmerStyle]} />
          <Animated.Text style={[styles.wordmark, glowStyle]}>FACT EXPLORER</Animated.Text>
        </View>
        <Text style={styles.tagline}>Discover something new</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  ring: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
    borderColor: 'rgba(100,160,255,0.45)',
  },
  content: {
    alignItems: 'center',
    gap: 12,
    zIndex: 2,
  },
  logoContainer: {
    overflow: 'hidden',
    borderRadius: 4,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: 'rgba(100,160,255,0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  shimmer: {
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.25)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 1,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(180,200,255,0.7)',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});
