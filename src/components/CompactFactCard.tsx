import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';
import { CATEGORIES } from '../data/categories';
import { Fact } from '../data/facts';

type Props = {
  fact: Fact;
};

export function CompactFactCard({ fact }: Props) {
  const { colors } = useTheme();
  const category = CATEGORIES.find((c) => c.id === fact.categoryId);

  return (
    <Pressable
      onPress={() => router.push(`/category/${fact.categoryId}?factId=${fact.id}`)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.inner}>
        <View style={[styles.dot, { backgroundColor: category?.color ?? colors.accent }]} />
        <View style={styles.textContainer}>
          <Text style={[styles.category, { color: colors.textTertiary }]}>{category?.name}</Text>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {fact.title}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={2}>
            {fact.body}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.radius.lg,
    marginHorizontal: Layout.spacing.md,
    marginVertical: Layout.spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    gap: Layout.spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Layout.radius.full,
    marginTop: 2,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  category: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
  },
});
