import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_COUNT = 4;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;
const PILL_WIDTH = 52;
const PILL_HEIGHT = 34;

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
  { name: 'profile', label: 'Settings', icon: 'settings-outline', iconActive: 'settings' },
];

function pillX(index: number) {
  return TAB_WIDTH * index + TAB_WIDTH / 2 - PILL_WIDTH / 2;
}

type Props = {
  state: { index: number; routes: { name: string; key: string }[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
};

function TabItemInner({
  tab,
  isActive,
  accent,
  textTertiary,
  onPress,
}: {
  tab: Tab;
  isActive: boolean;
  accent: string;
  textTertiary: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    scale.value = withSpring(0.84, { damping: 15, stiffness: 600 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      style={styles.tabItem}
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={[styles.tabContent, scaleStyle]}>
        <Ionicons
          name={isActive ? tab.iconActive : tab.icon}
          size={23}
          color={isActive ? accent : textTertiary}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: isActive ? accent : textTertiary },
            isActive && styles.tabLabelActive,
          ]}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function TabBar({ state, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const animatedPillX = useSharedValue(pillX(state.index));

  useEffect(() => {
    animatedPillX.value = withSpring(pillX(state.index), {
      damping: 22,
      stiffness: 280,
    });
  }, [state.index, animatedPillX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedPillX.value }],
  }));

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <BlurView
        intensity={90}
        tint={isDark ? 'dark' : 'extraLight'}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? 'rgba(13,13,15,0.55)'
              : 'rgba(245,245,247,0.55)',
          },
        ]}
      />
      <View style={styles.tabs}>
        <Animated.View
          style={[
            styles.pill,
            { backgroundColor: colors.accent + '28' },
            pillStyle,
          ]}
        />
        {TABS.map((tab, i) => {
          const route = state.routes[i];
          const isActive = state.index === i;
          return (
            <TabItemInner
              key={tab.name}
              tab={tab}
              isActive={isActive}
              accent={colors.accent}
              textTertiary={colors.textTertiary}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
  tabs: {
    flexDirection: 'row',
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.sm,
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    top: 4,
    left: 0,
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: Layout.radius.lg,
    zIndex: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontWeight: '600',
  },
});
