import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemePreference, useTheme } from '../../src/contexts/ThemeContext';
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
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
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
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
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
      <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>{children}</View>
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
  const { colors, preference, setPreference } = useTheme();
  const { streak, totalTimeMs } = useStats();
  const { savedIds } = useSavedFacts();
  const [notifications, setNotifications] = useState(false);
  const [haptics, setHaptics] = useState(true);

  const animStreak = useCountUp(streak);
  const animLikes = useCountUp(savedIds.size);

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
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
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statEmoji]}>🔥</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{animStreak}</Text>
          <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Day streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statEmoji]}>⏱</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatTime(totalTimeMs)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Time spent</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statEmoji]}>❤️</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{animLikes}</Text>
          <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Likes</Text>
        </View>
      </View>

      {/* Appearance */}
      <SectionBlock title="Appearance" colors={colors}>
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
          onPress={() => {}}
          colors={colors}
        />
        <Row
          icon="shield-checkmark-outline"
          iconColor="#34C759"
          label="Privacy Policy"
          onPress={() => {}}
          last
          colors={colors}
        />
      </SectionBlock>
    </ScrollView>
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
  statCard: {
    flex: 1,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.md,
    alignItems: 'center',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
});
