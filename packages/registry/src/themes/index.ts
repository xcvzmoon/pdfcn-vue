import { blueprintTheme } from './blueprint.ts';
import { corporateTheme } from './corporate.ts';
import { elegantTheme } from './elegant.ts';
import { executiveTheme } from './executive.ts';
import { forestTheme } from './forest.ts';
import { minimalTheme } from './minimal.ts';
import { modernTheme } from './modern.ts';
import { professionalTheme } from './professional.ts';
import { vividTheme } from './vivid.ts';

export type {
  BorderRadiusScale,
  ColorTokens,
  FontWeights,
  LetterSpacingScale,
  LineHeights,
  PageTokens,
  PdfcnTheme,
  PrimitiveTokens,
  SpacingScale,
  SpacingTokens,
  TypographyScale,
  TypographyTokens,
} from '../types/pdf-themes.ts';
export { defaultPrimitives } from './primitives.ts';
export { professionalTheme } from './professional.ts';
export { modernTheme } from './modern.ts';
export { minimalTheme } from './minimal.ts';
export { executiveTheme } from './executive.ts';
export { corporateTheme } from './corporate.ts';
export { elegantTheme } from './elegant.ts';
export { vividTheme } from './vivid.ts';
export { forestTheme } from './forest.ts';
export { blueprintTheme } from './blueprint.ts';

export const themePresets = {
  professional: professionalTheme,
  modern: modernTheme,
  minimal: minimalTheme,
  executive: executiveTheme,
  corporate: corporateTheme,
  elegant: elegantTheme,
  vivid: vividTheme,
  forest: forestTheme,
  blueprint: blueprintTheme,
} as const;

export type ThemePresetName = keyof typeof themePresets;
