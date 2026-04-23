import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TimePickerModal } from '../../src/components/TimePickerModal';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Layout } from '../../src/constants/layout';
import { useNotificationPrefs } from '../../src/hooks/useNotifications';
import { useOnboarding } from '../../src/hooks/useOnboarding';

function formatTime(h: number, m: number) {
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export default function OnboardingNotifications() {
  const insets = useSafeAreaInsets();
  const { colors, heroGradient } = useTheme();
  const { enabled, hour, minute, setEnabled, setTime } = useNotificationPrefs();
  const { complete } = useOnboarding();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleEnable() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBusy(true);
    const ok = await setEnabled(true);
    setBusy(false);
    if (!ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }

  async function handleFinish() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await complete();
    router.replace('/');
  }

  return (
    <LinearGradient colors={heroGradient} style={styles.root}>
      <View style={{ paddingTop: insets.top + Layout.spacing.xl, flex: 1 }}>
        <View style={styles.header}>
          <Text style={[styles.step, { color: colors.textTertiary }]}>Step 3 of 3</Text>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            A fact a day
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Get a handpicked fact each morning. We&apos;ll also remind you if you&apos;re about to break a streak.
          </Text>
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.panel,
              { backgroundColor: colors.surface, borderColor: colors.separator },
            ]}
          >
            <View style={styles.panelRow}>
              <Ionicons name="notifications-outline" size={22} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.panelTitle, { color: colors.text }]}>Daily notifications</Text>
                <Text style={[styles.panelSub, { color: colors.textSecondary }]}>
                  {enabled ? 'Enabled' : 'Off — tap Enable below'}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => enabled && setPickerOpen(true)}
              disabled={!enabled}
              accessibilityRole="button"
              accessibilityLabel={`Notification time ${formatTime(hour, minute)}`}
              style={[
                styles.timeRow,
                { borderTopColor: colors.separator, opacity: enabled ? 1 : 0.45 },
              ]}
            >
              <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.timeLabel, { color: colors.text }]}>Notify me at</Text>
              <Text style={[styles.timeValue, { color: colors.accent }]}>
                {formatTime(hour, minute)}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </Pressable>
          </View>

          {!enabled && (
            <Pressable
              onPress={handleEnable}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel="Enable notifications"
              style={({ pressed }) => [
                styles.enableButton,
                { backgroundColor: colors.accent },
                pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
              ]}
            >
              <Ionicons name="notifications" size={18} color="#FFFFFF" />
              <Text style={styles.enableText}>Enable notifications</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + Layout.spacing.md, borderTopColor: colors.separator },
        ]}
      >
        <Pressable
          onPress={handleFinish}
          accessibilityRole="button"
          accessibilityLabel="Finish onboarding"
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.accent },
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.ctaText}>{enabled ? 'All set' : 'Skip for now'}</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      <TimePickerModal
        visible={pickerOpen}
        initialHour={hour}
        initialMinute={minute}
        onCancel={() => setPickerOpen(false)}
        onConfirm={(h, m) => {
          setTime(h, m);
          setPickerOpen(false);
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  step: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  panel: {
    borderRadius: Layout.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  panelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    padding: Layout.spacing.md,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  panelSub: {
    fontSize: 13,
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
    padding: Layout.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  timeLabel: {
    flex: 1,
    fontSize: 15,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: 14,
    borderRadius: Layout.radius.full,
    marginTop: Layout.spacing.xs,
  },
  enableText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: 16,
    borderRadius: Layout.radius.full,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
