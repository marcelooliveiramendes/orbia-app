// Valores confirmados em docs/HANDOFF.md e prototipo/Sistema.dc.html.
// Qualquer token que faltar aqui deve ser extraído de Sistema.dc.html antes de usar.

export const palette = {
  light: {
    bg: '#F5F5F2',
    surface: '#FFFFFF',
    tile: '#ECECE7',
    line: '#E4E4DF',
    control: '#D4D4CE',
    ink: '#09090B',
    muted: '#52525B',
    signal: '#4D6600',
    negative: '#B42318',
    warnBg: '#FFF4D6',
    warnInk: '#7A4A00',
  },
  dark: {
    bg: '#09090B',
    surface: '#121216',
    tile: '#1C1C21',
    line: '#26262C',
    control: '#3A3A42',
    ink: '#F5F5F2',
    muted: '#B4B4BB',
    signal: '#C7FF3D',
    negative: '#F97066',
    warnBg: '#2A2210',
    warnInk: '#F5C04A',
  },
} as const;

// Lime só em CTA, seleção, foco e progresso. Nunca como fundo de bloco.
export const lime = '#C7FF3D';

export const radii = {
  field: 14,
  card: 20,
  sheet: 28,
  pill: 999,
} as const;

export const spacing = {
  unit: 4,
  screenMargin: 20,
} as const;

export const minTouchTarget = 44;

export const typography = {
  value: { fontSize: 36, lineHeight: 42 },
  title: { fontSize: 28, lineHeight: 34 },
  sheet: { fontSize: 22, lineHeight: 28 },
  section: { fontSize: 17, lineHeight: 22 },
  body: { fontSize: 16, lineHeight: 22 },
  support: { fontSize: 15, lineHeight: 22 },
  meta: { fontSize: 13, lineHeight: 18 },
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

export const motion = {
  feedbackMs: 150,
  transitionMs: 260,
  easing: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

export type ThemeMode = 'light' | 'dark';
export type ColorTokens = Record<keyof typeof palette.light, string>;
