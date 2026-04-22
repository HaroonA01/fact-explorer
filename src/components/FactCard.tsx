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
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';
import { Fact } from '../data/facts';
import { useSavedFacts } from '../hooks/useSavedFacts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.42;

type Props = {
  fact: Fact;
  visible?: boolean;
};

export function FactCard({ fact, visible = true }: Props) {
  const { colors } = useTheme();
  const { isSaved, toggle } = useSavedFacts();
  const saved = isSaved(fact.id);
  const scrollRef = useRef<ScrollView>(null);

  const opacity = useSharedValue(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      opacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  async function handleShare() {
    await Share.share({
      message: `${fact.title}\n\n${fact.body}\n\nDiscover more on Fact Explorer.`,
      title: fact.title,
    });
  }

  function handleBookmark() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggle(fact.id);
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background }, containerStyle]}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Image header with dark gradient overlay */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `https://picsum.photos/seed/${fact.imageId}/800/600` }}
            style={[styles.image, { backgroundColor: colors.surfaceSecondary }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.55)']}
            style={styles.imageOverlay}
          />
        </View>

        {/* Content card */}
        <View style={[styles.contentCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>{fact.title}</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{fact.body}</Text>

          <View style={[styles.actions, { borderTopColor: colors.separator }]}>
            <Pressable
              onPress={handleBookmark}
              style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}
            >
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={saved ? colors.accent : colors.textTertiary}
              />
              <Text
                style={[
                  styles.actionLabel,
                  { color: colors.textTertiary },
                  saved && { color: colors.accent },
                ]}
              >
                {saved ? 'Saved' : 'Save'}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}
            >
              <Ionicons name="share-outline" size={20} color={colors.textTertiary} />
              <Text style={[styles.actionLabel, { color: colors.textTertiary }]}>Share</Text>
            </Pressable>
          </View>
        </View>
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
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: IMAGE_HEIGHT * 0.5,
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
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
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
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
