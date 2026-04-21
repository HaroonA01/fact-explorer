import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Category } from '../data/categories';
import { CategoryCard } from './CategoryCard';

type Props = {
  category: Category;
  index: number;
  visible: boolean;
};

export function AnimatedCategoryCard({ category, index, visible }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    const delay = index * 80;
    if (visible) {
      opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
      translateY.value = withDelay(delay, withSpring(0, { damping: 20, stiffness: 220 }));
    } else {
      opacity.value = 0;
      translateY.value = 30;
    }
  }, [visible, index, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <CategoryCard category={category} index={index} />
    </Animated.View>
  );
}
