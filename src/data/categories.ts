export type Category = {
  id: string;
  name: string;
  description: string;
  gradient: [string, string];
  color: string;
  lightColor: string;
  iconName: string;
};

export const CATEGORIES: Category[] = [
  {
    id: 'science',
    name: 'Science',
    description: 'Physics, chemistry, biology and beyond',
    gradient: ['#007AFF', '#0051D5'],
    color: '#007AFF',
    lightColor: '#E8F4FF',
    iconName: 'flask',
  },
  {
    id: 'history',
    name: 'History',
    description: 'Civilisations, events and discoveries',
    gradient: ['#AF52DE', '#7A2FB7'],
    color: '#AF52DE',
    lightColor: '#F5E9FF',
    iconName: 'time',
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Animals, plants and ecosystems',
    gradient: ['#34C759', '#248A3D'],
    color: '#34C759',
    lightColor: '#E5F9EB',
    iconName: 'leaf',
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Computing, AI and engineering',
    gradient: ['#FF9500', '#C93400'],
    color: '#FF9500',
    lightColor: '#FFF3E0',
    iconName: 'hardware-chip',
  },
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Patterns, proofs and paradoxes',
    gradient: ['#FF2D55', '#C4003F'],
    color: '#FF2D55',
    lightColor: '#FFE5EA',
    iconName: 'calculator',
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Planets, stars and cosmic oddities',
    gradient: ['#5E5CE6', '#3634A3'],
    color: '#5E5CE6',
    lightColor: '#ECECFF',
    iconName: 'planet',
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Creatures great, small and strange',
    gradient: ['#00C7BE', '#008577'],
    color: '#00C7BE',
    lightColor: '#DFFBF9',
    iconName: 'paw',
  },
  {
    id: 'countries',
    name: 'Countries',
    description: 'Nations, cultures and curiosities',
    gradient: ['#FFCC00', '#C79400'],
    color: '#FFCC00',
    lightColor: '#FFF9E0',
    iconName: 'earth',
  },
];
