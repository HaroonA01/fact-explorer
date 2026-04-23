import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;

type Props = {
  visible: boolean;
  initialHour: number;
  initialMinute: number;
  onCancel: () => void;
  onConfirm: (hour: number, minute: number) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 5-minute increments

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function Wheel({
  data,
  initialIndex,
  onIndexChange,
  formatter,
}: {
  data: number[];
  initialIndex: number;
  onIndexChange: (index: number) => void;
  formatter: (v: number) => string;
}) {
  const { colors } = useTheme();
  const ref = useRef<FlatList<number>>(null);
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    const t = setTimeout(() => {
      ref.current?.scrollToOffset({ offset: initialIndex * ITEM_HEIGHT, animated: false });
    }, 30);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.wheel}>
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => String(item)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: index * ITEM_HEIGHT,
          index,
        })}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
        onMomentumScrollEnd={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          const idx = Math.round(y / ITEM_HEIGHT);
          const clamped = Math.max(0, Math.min(data.length - 1, idx));
          if (clamped !== current) {
            Haptics.selectionAsync();
            setCurrent(clamped);
            onIndexChange(clamped);
          }
        }}
        renderItem={({ item, index }) => {
          const active = index === current;
          return (
            <View style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  {
                    color: active ? colors.text : colors.textTertiary,
                    fontWeight: active ? '700' : '400',
                  },
                ]}
              >
                {formatter(item)}
              </Text>
            </View>
          );
        }}
      />
      <View pointerEvents="none" style={[styles.selectionBand, { borderColor: colors.separator }]} />
    </View>
  );
}

export function TimePickerModal({
  visible,
  initialHour,
  initialMinute,
  onCancel,
  onConfirm,
}: Props) {
  const { colors } = useTheme();
  const initialMinuteIdx = Math.max(
    0,
    MINUTES.findIndex((m) => m >= initialMinute),
  );
  const [hourIdx, setHourIdx] = useState(initialHour);
  const [minuteIdx, setMinuteIdx] = useState(initialMinuteIdx);

  useEffect(() => {
    if (visible) {
      setHourIdx(initialHour);
      setMinuteIdx(Math.max(0, MINUTES.findIndex((m) => m >= initialMinute)));
    }
  }, [visible, initialHour, initialMinute]);

  function handleConfirm() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onConfirm(HOURS[hourIdx], MINUTES[minuteIdx]);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handleBar, { backgroundColor: colors.separator }]} />
          <View style={styles.headerRow}>
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              hitSlop={8}
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
            <Text style={[styles.title, { color: colors.text }]}>Notify me at</Text>
            <Pressable
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel="Confirm time"
              hitSlop={8}
            >
              <Text style={[styles.confirm, { color: colors.accent }]}>Done</Text>
            </Pressable>
          </View>

          <View style={styles.wheels}>
            <Wheel
              data={HOURS}
              initialIndex={hourIdx}
              onIndexChange={setHourIdx}
              formatter={pad}
            />
            <Text style={[styles.colon, { color: colors.text }]}>:</Text>
            <Wheel
              data={MINUTES}
              initialIndex={minuteIdx}
              onIndexChange={setMinuteIdx}
              formatter={pad}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Layout.radius.xl,
    borderTopRightRadius: Layout.radius.xl,
    paddingBottom: Layout.spacing.xl,
    paddingTop: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Layout.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  confirm: {
    fontSize: 16,
    fontWeight: '700',
  },
  wheels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    height: PICKER_HEIGHT,
  },
  wheel: {
    width: 80,
    height: PICKER_HEIGHT,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 22,
    letterSpacing: -0.4,
  },
  selectionBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ITEM_HEIGHT * 2,
    height: ITEM_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  colon: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: -4,
  },
});
