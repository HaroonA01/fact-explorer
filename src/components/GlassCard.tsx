import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../constants/layout';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  radius?: number;
};

export function GlassCard({ children, style, intensity = 60, radius = Layout.radius.lg }: Props) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          borderRadius: radius,
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)',
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={isDark ? 'dark' : 'light'}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            backgroundColor: isDark ? 'rgba(28,28,30,0.55)' : 'rgba(255,255,255,0.55)',
          },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  content: {
    position: 'relative',
  },
});
