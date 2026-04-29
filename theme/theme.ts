import type { TextStyle } from 'react-native';

const palette = {
  ink900: '#06060C',
  ink850: '#0A0A14',
  ink800: '#0F0F1C',
  ink700: '#161628',
  ink600: '#1E1E32',
  ink500: '#2A2A40',
  ink400: '#3A3A52',
  smoke300: '#5C5C77',
  smoke200: '#8A8AA8',
  smoke100: '#B8B8D0',
  white: '#F5F5FB',
  whiteDim: 'rgba(245, 245, 251, 0.72)',
  whiteFaint: 'rgba(245, 245, 251, 0.38)',

  violet600: '#6D4CFF',
  violet500: '#8B6CFF',
  violet400: '#A78BFA',
  violet300: '#C4B0FF',
  violet100: 'rgba(167, 139, 250, 0.14)',

  pink400: '#F0A8C8',
  pink500: '#E879A8',

  mint500: '#5EEAD4',
  mint400: '#83F3DE',
  mint100: 'rgba(94, 234, 212, 0.16)',

  amber500: '#F5B544',
  amber100: 'rgba(245, 181, 68, 0.16)',

  coral500: '#F472A8',
  coral100: 'rgba(244, 114, 168, 0.16)',

  glassTint: 'rgba(255, 255, 255, 0.06)',
  glassTintStrong: 'rgba(255, 255, 255, 0.10)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.14)',
  hairline: 'rgba(255, 255, 255, 0.05)',
} as const;

export const theme = {
  colors: {
    bg: palette.ink900,
    bgElevated: palette.ink850,
    surface: palette.ink800,
    surfaceElevated: palette.ink700,
    border: palette.glassBorder,
    borderStrong: palette.glassBorderStrong,
    hairline: palette.hairline,

    text: palette.white,
    textMuted: palette.whiteDim,
    textFaint: palette.whiteFaint,

    accent: palette.violet400,
    accentStrong: palette.violet500,
    accentDeep: palette.violet600,
    accentSoft: palette.violet100,

    growing: palette.mint500,
    growingSoft: palette.mint100,
    stable: palette.amber500,
    stableSoft: palette.amber100,
    declining: palette.coral500,
    decliningSoft: palette.coral100,

    glassTint: palette.glassTint,
    glassTintStrong: palette.glassTintStrong,
    glassBorder: palette.glassBorder,
    glassBorderStrong: palette.glassBorderStrong,

    heroGradientStart: palette.white,
    heroGradientMid: palette.violet300,
    heroGradientEnd: palette.pink400,

    backdropGradientTop: 'rgba(109, 76, 255, 0.22)',
    backdropGradientMid: 'rgba(109, 76, 255, 0.05)',
    backdropGradientBottom: palette.ink900,
    backdropGlowFrom: 'rgba(232, 121, 168, 0.10)',
    backdropGlowTo: 'rgba(232, 121, 168, 0)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 18,
    xl: 24,
    xxl: 32,
    pill: 999,
  },
  typography: {
    hero: { fontSize: 56, fontWeight: '700', letterSpacing: -1.5 } satisfies TextStyle,
    display: { fontSize: 40, fontWeight: '700', letterSpacing: -1 } satisfies TextStyle,
    h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 } satisfies TextStyle,
    h2: { fontSize: 22, fontWeight: '600', letterSpacing: -0.3 } satisfies TextStyle,
    h3: { fontSize: 18, fontWeight: '600' } satisfies TextStyle,
    body: { fontSize: 15, fontWeight: '500' } satisfies TextStyle,
    bodySmall: { fontSize: 13, fontWeight: '500' } satisfies TextStyle,
    caption: { fontSize: 11, fontWeight: '500', letterSpacing: 0.4 } satisfies TextStyle,
    mono: { fontSize: 13, fontWeight: '500', fontFamily: 'Menlo' } satisfies TextStyle,
  },
  glass: {
    intensity: 38,
    intensityStrong: 60,
    tint: 'dark' as const,
  },
  shadow: {
    card: {
      shadowColor: palette.ink900,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
      elevation: 6,
    },
    hero: {
      shadowColor: palette.violet600,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.32,
      shadowRadius: 32,
      elevation: 12,
    },
  },
  motion: {
    fast: 180,
    base: 280,
    slow: 480,
    pageEnter: 520,
  },
} as const;

export type Theme = typeof theme;
export type ThemeColors = Theme['colors'];
export type ThemeSpacing = keyof Theme['spacing'];
export type ThemeRadii = keyof Theme['radii'];
