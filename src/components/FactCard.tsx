import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';
import { CATEGORIES } from '../data/categories';
import { Fact } from '../data/facts';
import { useSavedFacts } from '../hooks/useSavedFacts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.50;
const PARALLAX_BUFFER = 50; // px each side beyond screen width
const PARALLAX_FACTOR = 0.12;

type Props = {
  fact: Fact;
  visible?: boolean;
  scrollX: SharedValue<number>;
  index: number;
};

export function FactCard({ fact, visible = true, scrollX, index }: Props) {
  const { colors, isDark } = useTheme();
  const { isSaved, toggle } = useSavedFacts();
  const saved = isSaved(fact.id);
  const scrollRef = useRef<ScrollView>(null);
  const category = CATEGORIES.find((c) => c.id === fact.categoryId);
  const categoryColor = category?.color ?? colors.accent;

  // Entry: scale + opacity spring on mount
  const entryScale = useSharedValue(0.94);
  const entryOpacity = useSharedValue(0);

  // Content card spring when becoming visible
  const contentY = useSharedValue(16);

  // Bookmark burst scale
  const saveScale = useSharedValue(1);

  useEffect(() => {
    entryScale.value = withSpring(1, { damping: 18, stiffness: 180 });
    entryOpacity.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.quad) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      contentY.value = 16;
    } else {
      contentY.value = withSpring(0, { damping: 20, stiffness: 220 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: entryOpacity.value,
    transform: [{ scale: entryScale.value }],
  }));

  // Parallax: image moves at PARALLAX_FACTOR speed relative to card scroll
  const imageWrapperStyle = useAnimatedStyle(() => {
    const offset = (scrollX.value - index * SCREEN_WIDTH) * PARALLAX_FACTOR;
    return {
      transform: [{ translateX: -offset }],
    };
  });

  const contentCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentY.value }],
  }));

  const saveIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  async function handleShare() {
    await Share.share({
      message: `${fact.title}\n\n${fact.body}\n\nDiscover more on Fact Explorer.`,
      title: fact.title,
    });
  }

  function handleBookmark() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggle(fact.id);
    saveScale.value = withSequence(
      withSpring(1.35, { damping: 6, stiffness: 300 }),
      withSpring(0.88, { damping: 8, stiffness: 280 }),
      withSpring(1.0, { damping: 12, stiffness: 260 }),
    );
  }

  const cardBg = isDark
    ? 'rgba(13,13,15,0.93)'
    : 'rgba(252,252,255,0.94)';

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Image with parallax */}
        <View style={styles.imageContainer}>
          <Animated.View style={[styles.imageWrapper, imageWrapperStyle]}>
            <Image
              source={{ uri: `https://picsum.photos/seed/${fact.imageId}/800/600` }}
              style={styles.image}
              resizeMode="cover"
            />
          </Animated.View>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.28)', 'rgba(0,0,0,0.68)']}
            style={styles.imageOverlay}
          />
        </View>

        {/* Content card */}
        <Animated.View style={[styles.contentCard, { backgroundColor: cardBg }, contentCardStyle]}>
          {/* Category badge */}
          <View style={[styles.badge, { backgroundColor: categoryColor + '22' }]}>
            <Text style={[styles.badgeText, { color: categoryColor }]}>
              {(category?.name ?? '').toUpperCase()}
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{fact.title}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{fact.body}</Text>

          <View style={[styles.actions, { borderTopColor: colors.separator }]}>
            {/* Save button with burst animation */}
            <Pressable
              onPress={handleBookmark}
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Remove from saved' : 'Save fact'}
              accessibilityState={{ selected: saved }}
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: categoryColor + (saved ? '24' : '18') },
                pressed && styles.actionButtonPressed,
              ]}
            >
              <Animated.View style={saveIconStyle}>
                <Ionicons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={saved ? categoryColor : colors.textSecondary}
                />
              </Animated.View>
              <Text
                style={[
                  styles.actionLabel,
                  { color: saved ? categoryColor : colors.textSecondary },
                ]}
              >
                {saved ? 'Saved' : 'Save'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel="Share fact"
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: colors.separator },
                pressed && styles.actionButtonPressed,
              ]}
            >
              <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>Share</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -PARALLAX_BUFFER,
    width: SCREEN_WIDTH + PARALLAX_BUFFER * 2,
  },
  image: {
    flex: 1,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: IMAGE_HEIGHT * 0.65,
  },
  contentCard: {
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    marginTop: -Layout.radius.xl,
    paddingTop: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Layout.radius.full,
    marginBottom: Layout.spacing.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: Layout.spacing.md,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  actions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.radius.full,
  },
  actionButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
