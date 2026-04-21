import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';

type Tab = {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: Tab[] = [
  { name: 'index', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { name: 'explore', label: 'Explore', icon: 'compass-outline', iconActive: 'compass' },
  { name: 'saved', label: 'Saved', icon: 'bookmark-outline', iconActive: 'bookmark' },
  { name: 'profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

type Props = {
  state: { index: number; routes: { name: string; key: string }[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
};

function TabItem({
  tab,
  isActive,
  onPress,
}: {
  tab: Tab;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const indicatorOpacity = useSharedValue(isActive ? 1 : 0);
  const indicatorWidth = useSharedValue(isActive ? 20 : 0);

  useEffect(() => {
    indicatorOpacity.value = withSpring(isActive ? 1 : 0, { damping: 20 });
    indicatorWidth.value = withSpring(isActive ? 20 : 0, { damping: 18, stiffness: 200 });
  }, [indicatorOpacity, indicatorWidth, isActive]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
    width: indicatorWidth.value,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.88, { damping: 15, stiffness: 600 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    onPress();
  }

  return (
    <Pressable onPress={handlePress} style={styles.tabItem}>
      <Animated.View style={[styles.tabContent, scaleStyle]}>
        <Ionicons
          name={isActive ? tab.iconActive : tab.icon}
          size={24}
          color={isActive ? Colors.accent : Colors.textTertiary}
        />
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      </Animated.View>
    </Pressable>
  );
}

export function TabBar({ state, navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[styles.overlay, StyleSheet.absoluteFill]} />
      <View style={styles.border} />
      <View style={styles.tabs}>
        {TABS.map((tab, i) => {
          const route = state.routes[i];
          const isActive = state.index === i;
          return (
            <TabItem
              key={tab.name}
              tab={tab}
              isActive={isActive}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route?.name,
                  canPreventDefault: true,
                });
                if (!isActive && !event.defaultPrevented) {
                  navigation.navigate(tab.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(245,245,247,0.85)',
  },
  border: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(60,60,67,0.18)',
  },
  tabs: {
    flexDirection: 'row',
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textTertiary,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  indicator: {
    height: 3,
    borderRadius: Layout.radius.full,
    backgroundColor: Colors.accent,
  },
});
