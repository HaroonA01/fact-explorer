import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/layout';
import { CATEGORIES } from '../data/categories';
import { Fact } from '../data/facts';

type Props = {
  fact: Fact;
};

export function CompactFactCard({ fact }: Props) {
  const category = CATEGORIES.find((c) => c.id === fact.categoryId);

  return (
    <Pressable
      onPress={() => router.push(`/category/${fact.categoryId}?factId=${fact.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.inner}>
        <View style={[styles.dot, { backgroundColor: category?.color ?? Colors.accent }]} />
        <View style={styles.textContainer}>
          <Text style={styles.category}>{category?.name}</Text>
          <Text style={styles.title} numberOfLines={2}>{fact.title}</Text>
          <Text style={styles.body} numberOfLines={2}>{fact.body}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    marginHorizontal: Layout.spacing.md,
    marginVertical: Layout.spacing.xs,
    ...Layout.shadow.sm,
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
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  body: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
