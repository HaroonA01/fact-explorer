import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  color?: string;
};

export function SwipeUpHint({ color = 'rgba(255,255,255,0.9)' }: Props) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 700, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 700, easing: Easing.in(Easing.quad) }),
        withDelay(300, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.5, { duration: 700 }),
        withDelay(300, withTiming(0.5, { duration: 0 })),
      ),
      -1,
      false,
    );
  }, [opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Ionicons name="chevron-up" size={20} color={color} />
      <Ionicons name="chevron-up" size={20} color={color} style={styles.second} />
      <Text style={[styles.label, { color }]}>Explore categories</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 2,
  },
  second: {
    marginTop: -12,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 6,
  },
});
