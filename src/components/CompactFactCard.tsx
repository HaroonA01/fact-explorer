import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';
import { CATEGORIES } from '../data/categories';
import { Fact } from '../data/facts';

type Props = {
  fact: Fact;
  animIndex?: number;
};

export function CompactFactCard({ fact, animIndex = 0 }: Props) {
  const { colors } = useTheme();
  const category = CATEGORIES.find((c) => c.id === fact.categoryId);

  const translateY = useSharedValue(22);
  const opacity = useSharedValue(0);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    const delay = Math.min(animIndex, 8) * 55;
    translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 220 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 280 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: pressScale.value }],
  }));

  function handlePress() {
    Haptics.selectionAsync();
    router.push(`/category/${fact.categoryId}?factId=${fact.id}`);
  }

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => {
          pressScale.value = withSpring(0.97, { damping: 18, stiffness: 400 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 14, stiffness: 320 });
        }}
        accessibilityRole="button"
        accessibilityLabel={`${category?.name ?? ''} fact: ${fact.title}`}
        style={[styles.card, { backgroundColor: colors.surface }]}
      >
        {/* Category colour strip */}
        <View style={[styles.colorStrip, { backgroundColor: category?.color ?? colors.accent }]} />

        <View style={styles.inner}>
          <View style={styles.textContainer}>
            <Text style={[styles.category, { color: category?.color ?? colors.accent }]}>
              {category?.name}
            </Text>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
              {fact.title}
            </Text>
            <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={2}>
              {fact.body}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.radius.lg,
    marginHorizontal: Layout.spacing.md,
    marginVertical: Layout.spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorStrip: {
    width: 3,
    alignSelf: 'stretch',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
    flex: 1,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
  },
});
