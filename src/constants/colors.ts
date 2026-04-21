export const Colors = {
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F2F2F7',
  accent: '#007AFF',
  accentLight: '#E8F0FE',
  text: '#1C1C1E',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  separator: 'rgba(60,60,67,0.12)',
  shadowColor: '#000000',

  // Glassmorphism
  glassBackground: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(255,255,255,0.8)',

  // Category colours
  science: '#007AFF',
  scienceLight: '#E8F4FF',
  scienceGradient: ['#007AFF', '#0051D5'] as [string, string],

  history: '#AF52DE',
  historyLight: '#F5E9FF',
  historyGradient: ['#AF52DE', '#7A2FB7'] as [string, string],

  nature: '#34C759',
  natureLight: '#E5F9EB',
  natureGradient: ['#34C759', '#248A3D'] as [string, string],

  technology: '#FF9500',
  technologyLight: '#FFF3E0',
  technologyGradient: ['#FF9500', '#C93400'] as [string, string],

  math: '#FF2D55',
  mathLight: '#FFE5EA',
  mathGradient: ['#FF2D55', '#C4003F'] as [string, string],
} as const;
