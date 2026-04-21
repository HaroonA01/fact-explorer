import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Dimensions, Image, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
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
  const { isSaved, toggle } = useSavedFacts();
  const saved = isSaved(fact.id);
  const translateY = useSharedValue(visible ? 0 : 60);
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      opacity.value = withSpring(1, { damping: 20 });
    }
  }, [visible, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
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
    <View style={styles.container}>
      <Image
        source={{ uri: `https://picsum.photos/seed/${fact.imageId}/800/600` }}
        style={styles.image}
        resizeMode="cover"
      />
      <Animated.View style={[styles.panel, animStyle]}>
        <View style={styles.handle} />
        <Text style={styles.title}>{fact.title}</Text>
        <Text style={styles.body}>{fact.body}</Text>
        <View style={styles.actions}>
          <Pressable onPress={handleBookmark} style={styles.actionButton}>
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={saved ? Colors.accent : Colors.textTertiary}
            />
            <Text style={[styles.actionLabel, saved && { color: Colors.accent }]}>
              {saved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>
          <Pressable onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-outline" size={22} color={Colors.textTertiary} />
            <Text style={styles.actionLabel}>Share</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: Colors.surfaceSecondary,
  },
  panel: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    marginTop: -Layout.radius.xl,
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.xl,
    ...Layout.shadow.md,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.separator,
    borderRadius: Layout.radius.full,
    alignSelf: 'center',
    marginBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: Layout.spacing.md,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
    letterSpacing: -0.1,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.surfaceSecondary,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textTertiary,
  },
});
