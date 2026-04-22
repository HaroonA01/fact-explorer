import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemePreference, useTheme } from '../../src/contexts/ThemeContext';
import { AccentScheme, SCHEMES } from '../../src/data/schemes';
import { useStats } from '../../src/hooks/useStats';
import { useSavedFacts } from '../../src/hooks/useSavedFacts';
import { Layout } from '../../src/constants/layout';

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return value;
}

function formatTime(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  if (totalMin < 1) return '<1m';
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

const PREFS_KEYS = {
  notifications: '@factexplorer/pref_notifications',
  haptics: '@factexplorer/pref_haptics',
};

function useStatCardAnim(delayMs: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);

  useEffect(() => {
    opacity.value = withDelay(delayMs, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(delayMs, withSpring(0, { damping: 20, stiffness: 220 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  last?: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
};

function Row({
  icon,
  iconColor,
  label,
  value,
  toggle,
  toggleValue,
  onToggle,
  onPress,
  rightIcon,
  last,
  colors,
}: RowProps) {
  const handlePress = onPress
    ? () => {
        Haptics.selectionAsync();
        onPress();
      }
    : undefined;
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
      style={[
        styles.row,
        { borderBottomColor: colors.separator },
        !last && styles.rowBorder,
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.rowRight}>
        {value !== undefined && (
          <Text style={[styles.rowValue, { color: colors.textTertiary }]}>{value}</Text>
        )}
        {toggle && (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ true: colors.accent }}
            thumbColor="#FFFFFF"
          />
        )}
        {rightIcon && (
          <Ionicons name={rightIcon} size={20} color={colors.accent} />
        )}
        {onPress && !toggle && !rightIcon && (
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

function SectionBlock({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: 'rgba(255,255,255,0.55)' }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );
}

const CIRCLE_SIZE = 62;

function SchemeCircle({ scheme, selected }: { scheme: AccentScheme; selected: boolean }) {
  const outerSize = CIRCLE_SIZE + 8;
  return (
    <View
      style={{
        width: outerSize,
        height: outerSize,
        borderRadius: outerSize / 2,
        borderWidth: 2.5,
        borderColor: selected ? scheme.dark.accent : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: CIRCLE_SIZE / 2,
          overflow: 'hidden',
          transform: [{ rotate: '-45deg' }],
        }}
      >
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <LinearGradient
            colors={scheme.light.heroGradient}
            style={{ flex: 1 }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <LinearGradient
            colors={scheme.dark.heroGradient}
            style={{ flex: 1 }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>
      </View>
    </View>
  );
}

const APPEARANCE_OPTIONS: {
  label: string;
  value: ThemePreference;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { label: 'System', value: 'system', icon: 'phone-portrait-outline', color: '#8E8E93' },
  { label: 'Light', value: 'light', icon: 'sunny-outline', color: '#FF9500' },
  { label: 'Dark', value: 'dark', icon: 'moon-outline', color: '#5E5CE6' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, heroGradient, preference, setPreference, accentSchemeId, setAccentSchemeId } = useTheme();
  const { streak, totalTimeMs } = useStats();
  const { savedIds } = useSavedFacts();
  const [notifications, setNotificationsState] = useState(false);
  const [haptics, setHapticsState] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(PREFS_KEYS.notifications),
      AsyncStorage.getItem(PREFS_KEYS.haptics),
    ]).then(([n, h]) => {
      if (n !== null) setNotificationsState(n === '1');
      if (h !== null) setHapticsState(h === '1');
    });
  }, []);

  function setNotifications(v: boolean) {
    setNotificationsState(v);
    AsyncStorage.setItem(PREFS_KEYS.notifications, v ? '1' : '0');
    Haptics.selectionAsync();
  }

  function setHaptics(v: boolean) {
    setHapticsState(v);
    AsyncStorage.setItem(PREFS_KEYS.haptics, v ? '1' : '0');
    if (v) Haptics.selectionAsync();
  }

  async function openURL(url: string) {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Unable to open', 'This link cannot be opened on your device.');
    }
  }

  const animStreak = useCountUp(streak);
  const animLikes = useCountUp(savedIds.size);

  const card1Anim = useStatCardAnim(0);
  const card2Anim = useStatCardAnim(80);
  const card3Anim = useStatCardAnim(160);

  return (
    <LinearGradient colors={heroGradient} style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Layout.spacing.md,
          paddingBottom: insets.bottom + 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Animated.View style={[styles.statCardWrapper, card1Anim]}>
            <LinearGradient
              colors={[colors.accent + '40', colors.accent + '15']}
              style={[styles.statCard, { borderColor: colors.accent + '30' }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{animStreak}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Day streak</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.statCardWrapper, card2Anim]}>
            <LinearGradient
              colors={[colors.accent + '40', colors.accent + '15']}
              style={[styles.statCard, { borderColor: colors.accent + '30' }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.statEmoji}>⏱</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatTime(totalTimeMs)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Time spent</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.statCardWrapper, card3Anim]}>
            <LinearGradient
              colors={[colors.accent + '40', colors.accent + '15']}
              style={[styles.statCard, { borderColor: colors.accent + '30' }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.statEmoji}>❤️</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{animLikes}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Saved</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Mode */}
        <SectionBlock title="Mode" colors={colors}>
          {APPEARANCE_OPTIONS.map((opt, i) => (
            <Row
              key={opt.value}
              icon={opt.icon}
              iconColor={opt.color}
              label={opt.label}
              rightIcon={preference === opt.value ? 'checkmark-circle' : undefined}
              onPress={() => setPreference(opt.value)}
              last={i === APPEARANCE_OPTIONS.length - 1}
              colors={colors}
            />
          ))}
        </SectionBlock>

        {/* Theme */}
        <SectionBlock title="Theme" colors={colors}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.schemeScroll}
          >
            {SCHEMES.map((scheme) => {
              const isSelected = accentSchemeId === scheme.id;
              return (
                <Pressable
                  key={scheme.id}
                  onPress={() => setAccentSchemeId(scheme.id)}
                  style={styles.schemeItem}
                >
                  <SchemeCircle scheme={scheme} selected={isSelected} />
                  <Text
                    style={[
                      styles.schemeName,
                      {
                        color: isSelected ? colors.accent : colors.textTertiary,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}
                  >
                    {scheme.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </SectionBlock>

        {/* Preferences */}
        <SectionBlock title="Preferences" colors={colors}>
          <Row
            icon="notifications-outline"
            iconColor="#FF9500"
            label="Daily notifications"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
            colors={colors}
          />
          <Row
            icon="phone-portrait-outline"
            iconColor={colors.accent}
            label="Haptic feedback"
            toggle
            toggleValue={haptics}
            onToggle={setHaptics}
            last
            colors={colors}
          />
        </SectionBlock>

        {/* About */}
        <SectionBlock title="About" colors={colors}>
          <Row
            icon="information-circle-outline"
            iconColor={colors.accent}
            label="Version"
            value="1.0.0"
            colors={colors}
          />
          <Row
            icon="star-outline"
            iconColor="#FF9500"
            label="Rate Fact Explorer"
            onPress={() => openURL('https://apps.apple.com/app/idYOUR_APP_ID?action=write-review')}
            colors={colors}
          />
          <Row
            icon="shield-checkmark-outline"
            iconColor="#34C759"
            label="Privacy Policy"
            onPress={() => openURL('https://factexplorer.app/privacy')}
            last
            colors={colors}
          />
        </SectionBlock>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.md,
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
  statCardWrapper: {
    flex: 1,
  },
  statCard: {
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.md,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  sectionCard: {
    borderRadius: Layout.radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: 13,
    gap: Layout.spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Layout.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  rowValue: {
    fontSize: 15,
  },
  schemeScroll: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  schemeItem: {
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  schemeName: {
    fontSize: 11,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
