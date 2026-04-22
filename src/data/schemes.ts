export type SchemeVariant = {
  accent: string;
  accentLight: string;
  heroGradient: [string, string, string];
  particleColor: string;
};

export type AccentScheme = {
  id: string;
  name: string;
  light: SchemeVariant;
  dark: SchemeVariant;
};

export const SCHEMES: AccentScheme[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    light: {
      accent: '#007AFF',
      accentLight: '#E8F0FE',
      heroGradient: ['#E8F0FE', '#C7D8F8', '#A8C4F0'],
      particleColor: '#4A7FBF',
    },
    dark: {
      accent: '#0A84FF',
      accentLight: '#1A2B3A',
      heroGradient: ['#05050F', '#0A0A1A', '#1A1A2E'],
      particleColor: '#7EB8FF',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    light: {
      accent: '#AF52DE',
      accentLight: '#F5E9FF',
      heroGradient: ['#F5E8FE', '#DEC8F8', '#C4A8F0'],
      particleColor: '#9040C0',
    },
    dark: {
      accent: '#BF5AF2',
      accentLight: '#2A1040',
      heroGradient: ['#0A0510', '#140A20', '#1E0F30'],
      particleColor: '#D08EFF',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    light: {
      accent: '#34C759',
      accentLight: '#E5F9EB',
      heroGradient: ['#E8FEF0', '#C8F8D8', '#A8F0C4'],
      particleColor: '#2D9E4A',
    },
    dark: {
      accent: '#30D158',
      accentLight: '#0A3020',
      heroGradient: ['#020E05', '#061408', '#0E2210'],
      particleColor: '#5AE07A',
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    light: {
      accent: '#FF9500',
      accentLight: '#FFF3E0',
      heroGradient: ['#FFF0E8', '#F8D8C0', '#F0C0A0'],
      particleColor: '#C87000',
    },
    dark: {
      accent: '#FF9F0A',
      accentLight: '#3A1800',
      heroGradient: ['#0F0800', '#1E1000', '#2E1800'],
      particleColor: '#FFB84A',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    light: {
      accent: '#FF2D55',
      accentLight: '#FFE5EA',
      heroGradient: ['#FEE8F0', '#F8C8D8', '#F0A8C0'],
      particleColor: '#C02040',
    },
    dark: {
      accent: '#FF375F',
      accentLight: '#3A0015',
      heroGradient: ['#0F0508', '#200A12', '#30101C'],
      particleColor: '#FF6B85',
    },
  },
  {
    id: 'arctic',
    name: 'Arctic',
    light: {
      accent: '#5AC8FA',
      accentLight: '#E0F7FF',
      heroGradient: ['#E8FAFF', '#C0EEFA', '#A0E4F8'],
      particleColor: '#2090C8',
    },
    dark: {
      accent: '#64D2FF',
      accentLight: '#001828',
      heroGradient: ['#000E18', '#001825', '#002035'],
      particleColor: '#88DEFF',
    },
  },
  {
    id: 'indigo',
    name: 'Indigo',
    light: {
      accent: '#5856D6',
      accentLight: '#ECEAFF',
      heroGradient: ['#EAEAFF', '#D0CEF8', '#B8B5F0'],
      particleColor: '#4040A8',
    },
    dark: {
      accent: '#7B79FF',
      accentLight: '#1A1850',
      heroGradient: ['#050518', '#0A0A28', '#10103A'],
      particleColor: '#A0A0FF',
    },
  },
  {
    id: 'gold',
    name: 'Gold',
    light: {
      accent: '#C9A227',
      accentLight: '#FFF8E0',
      heroGradient: ['#FFFAEC', '#FEF0C0', '#FCE8A0'],
      particleColor: '#9A7A18',
    },
    dark: {
      accent: '#FFD60A',
      accentLight: '#2A2000',
      heroGradient: ['#0E0C00', '#1A1600', '#28220A'],
      particleColor: '#FFE248',
    },
  },
  {
    id: 'mint',
    name: 'Mint',
    light: {
      accent: '#00C7BE',
      accentLight: '#E0FFFD',
      heroGradient: ['#E8FFFE', '#C0F8F5', '#A0F0EC'],
      particleColor: '#00908A',
    },
    dark: {
      accent: '#5AC8C7',
      accentLight: '#002A28',
      heroGradient: ['#000E0E', '#001818', '#002525'],
      particleColor: '#7AE8E5',
    },
  },
  {
    id: 'coral',
    name: 'Coral',
    light: {
      accent: '#FF6B6B',
      accentLight: '#FFE8E8',
      heroGradient: ['#FFE8E8', '#F8CECE', '#F0B8B8'],
      particleColor: '#D84040',
    },
    dark: {
      accent: '#FF8080',
      accentLight: '#350000',
      heroGradient: ['#0F0808', '#200E0E', '#301414'],
      particleColor: '#FFA0A0',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    light: {
      accent: '#9D7AE8',
      accentLight: '#F0EAFF',
      heroGradient: ['#F0EAFF', '#DDD0F8', '#C8B8F0'],
      particleColor: '#7050C0',
    },
    dark: {
      accent: '#B89EFF',
      accentLight: '#1E1040',
      heroGradient: ['#080510', '#10091E', '#18102E'],
      particleColor: '#D0BAFF',
    },
  },
  {
    id: 'titanium',
    name: 'Titanium',
    light: {
      accent: '#6E6E73',
      accentLight: '#F0F0F2',
      heroGradient: ['#F5F5F7', '#E8E8EA', '#D8D8DC'],
      particleColor: '#505055',
    },
    dark: {
      accent: '#98989D',
      accentLight: '#252528',
      heroGradient: ['#0A0A0A', '#141414', '#1E1E20'],
      particleColor: '#BEBEC4',
    },
  },
];

export const DEFAULT_SCHEME_ID = 'ocean';
