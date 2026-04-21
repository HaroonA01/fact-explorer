import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
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
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';
import { Fact } from '../data/facts';
import { useSavedFacts } from '../hooks/useSavedFacts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.42;
const COLLAPSED_TOP = IMAGE_HEIGHT - Layout.radius.xl;
const EXPANDED_TOP = 60;
const EXPAND_RANGE = COLLAPSED_TOP - EXPANDED_TOP;

type Props = {
  fact: Fact;
  visible?: boolean;
};

export function FactCard({ fact, visible = true }: Props) {
  const { colors } = useTheme();
  const { isSaved, toggle } = useSavedFacts();
  const saved = isSaved(fact.id);

  // Fade in once on first mount — no animation on subsequent swipes
  const opacity = useSharedValue(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      opacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Collapse panel when card is no longer active
  const panelOffset = useSharedValue(0); // 0 = collapsed, 1 = expanded
  const startOffset = useSharedValue(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    if (!visible) {
      panelOffset.value = withSpring(0, { damping: 22, stiffness: 220 });
      setScrollEnabled(false);
    }
  }, [visible, panelOffset]);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .failOffsetX([-10, 10])
    .onBegin(() => {
      startOffset.value = panelOffset.value;
    })
    .onUpdate((e) => {
      const next = startOffset.value - e.translationY / EXPAND_RANGE;
      panelOffset.value = Math.min(1, Math.max(0, next));
    })
    .onEnd((e) => {
      const snap =
        panelOffset.value > 0.4 ||
        (startOffset.value < 0.5 && e.velocityY < -500);
      panelOffset.value = withSpring(snap ? 1 : 0, { damping: 22, stiffness: 220 });
      runOnJS(setScrollEnabled)(snap);
    });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    top: interpolate(panelOffset.value, [0, 1], [COLLAPSED_TOP, EXPANDED_TOP], 'clamp'),
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
      <Image
        source={{ uri: `https://picsum.photos/seed/${fact.imageId}/800/600` }}
        style={[styles.image, { backgroundColor: colors.surfaceSecondary }]}
        resizeMode="cover"
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.panel, { backgroundColor: colors.surface }, panelStyle]}>
          {/* Drag handle */}
          <View style={styles.handleArea}>
            <View style={[styles.handleBar, { backgroundColor: colors.separator }]} />
          </View>

          {/* Scrollable body — only enabled when expanded */}
          <ScrollView
            style={styles.bodyScroll}
            contentContainerStyle={styles.bodyContent}
            scrollEnabled={scrollEnabled}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.title, { color: colors.text }]}>{fact.title}</Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>{fact.body}</Text>
            <View style={[styles.actions, { borderTopColor: colors.separator }]}>
              <Pressable
                onPress={handleBookmark}
                style={[styles.actionButton, { backgroundColor: colors.surfaceSecondary }]}
              >
                <Ionicons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={22}
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
                <Ionicons name="share-outline" size={22} color={colors.textTertiary} />
                <Text style={[styles.actionLabel, { color: colors.textTertiary }]}>Share</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT,
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: Layout.radius.full,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: Layout.spacing.md,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  actions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
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
