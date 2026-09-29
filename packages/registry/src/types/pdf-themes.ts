export type TypographyScale = {
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
};

export type SpacingScale = {
  0: number;
  0.5: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  8: number;
  10: number;
  12: number;
  16: number;
};

export type FontWeights = {
  regular: number;
  medium: number;
  semibold: number;
  bold: number;
};

export type LineHeights = {
  tight: number;
  normal: number;
  relaxed: number;
};

export type BorderRadiusScale = {
  none: number;
  sm: number;
  md: number;
  lg: number;
  full: number;
};

export type LetterSpacingScale = {
  tight: number;
  normal: number;
  wide: number;
  wider: number;
};

export type PrimitiveTokens = {
  typography: TypographyScale;
  spacing: SpacingScale;
  fontWeights: FontWeights;
  lineHeights: LineHeights;
  borderRadius: BorderRadiusScale;
  letterSpacing: LetterSpacingScale;
};

export type ColorTokens = {
  foreground: string;
  background: string;
  muted: string;
  mutedForeground: string;
  primary: string;
  primaryForeground: string;
  border: string;
  accent: string;
  destructive: string;
  success: string;
  warning: string;
  info: string;
};

export type TypographyTokens = {
  body: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
  heading: {
    fontFamily: string;
    fontWeight: number;
    lineHeight: number;
    fontSize: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      h5: number;
      h6: number;
    };
  };
};

export type SpacingTokens = {
  page: {
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
  sectionGap: number;
  paragraphGap: number;
  componentGap: number;
};

export type PageTokens = {
  size: 'A4' | 'LETTER' | 'LEGAL';
  orientation: 'portrait' | 'landscape';
};

export type PdfcnTheme = {
  name: string;
  primitives: PrimitiveTokens;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  page: PageTokens;
};
