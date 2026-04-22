import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';
import { Category } from '../data/categories';
import { FACTS } from '../data/facts';
import { GlassCard } from './GlassCard';

type Props = {
  category: Category;
  index: number;
};

export function CategoryCard({ category, index: _index }: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const factCount = FACTS.filter((f) => f.categoryId === category.id).length;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    });
    router.push(`/category/${category.id}`);
  }

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${category.name}, ${factCount} facts`}
      >
        <GlassCard style={styles.card} intensity={50}>
          <View style={styles.inner}>
            <LinearGradient
              colors={category.gradient}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons
                name={category.iconName as keyof typeof Ionicons.glyphMap}
                size={22}
                color="#FFFFFF"
              />
            </LinearGradient>
            <View style={styles.textContainer}>
              <Text style={[styles.name, { color: colors.text }]}>{category.name}</Text>
              <Text style={[styles.description, { color: colors.textTertiary }]}>
                {factCount} facts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Layout.spacing.md,
    marginVertical: Layout.spacing.xs,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
});
