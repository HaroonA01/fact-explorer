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

  glassBackground: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(255,255,255,0.8)',

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
};

export const DarkColors = {
  background: '#0D0D0F',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  accent: '#0A84FF',
  accentLight: '#1A2B3A',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  separator: 'rgba(84,84,88,0.6)',
  shadowColor: '#000000',

  glassBackground: 'rgba(28,28,30,0.72)',
  glassBorder: 'rgba(255,255,255,0.12)',

  science: '#0A84FF',
  scienceLight: '#0A2540',
  scienceGradient: ['#0A84FF', '#0051D5'] as [string, string],

  history: '#BF5AF2',
  historyLight: '#2A1040',
  historyGradient: ['#BF5AF2', '#7A2FB7'] as [string, string],

  nature: '#30D158',
  natureLight: '#0A3020',
  natureGradient: ['#30D158', '#248A3D'] as [string, string],

  technology: '#FF9F0A',
  technologyLight: '#3A1800',
  technologyGradient: ['#FF9F0A', '#C93400'] as [string, string],

  math: '#FF375F',
  mathLight: '#3A0015',
  mathGradient: ['#FF375F', '#C4003F'] as [string, string],
};

export type ColorPalette = typeof Colors;
