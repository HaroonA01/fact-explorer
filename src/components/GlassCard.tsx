import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Layout } from '../constants/layout';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  radius?: number;
};

export function GlassCard({ children, style, intensity = 60, radius = Layout.radius.lg }: Props) {
  return (
    <View style={[styles.wrapper, { borderRadius: radius }, style]}>
      <BlurView intensity={intensity} tint="light" style={[StyleSheet.absoluteFill, { borderRadius: radius }]} />
      <View style={[StyleSheet.absoluteFill, styles.overlay, { borderRadius: radius }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  content: {
    position: 'relative',
  },
});
