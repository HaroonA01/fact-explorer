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
import { Layout } from '../constants/layout';

type Props = {
  color?: string;
};

export function SwipeUpHint({ color = 'rgba(255,255,255,0.9)' }: Props) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 700, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 700, easing: Easing.in(Easing.quad) }),
        withDelay(400, withTiming(0, { duration: 0 })),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.6, { duration: 700 }),
        withDelay(400, withTiming(0.6, { duration: 0 })),
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
    <Animated.View style={[styles.pill, animStyle]}>
      <View style={styles.chevrons}>
        <Ionicons name="chevron-up" size={18} color={color} />
        <Ionicons name="chevron-up" size={18} color={color} style={styles.second} />
      </View>
      <Text style={[styles.label, { color }]}>Explore categories</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.full,
    gap: Layout.spacing.xs,
  },
  chevrons: {
    alignItems: 'center',
    gap: 0,
  },
  second: {
    marginTop: -8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
