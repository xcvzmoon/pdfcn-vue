import type { ColorTokens } from '../../types/pdf-themes.ts';

export const THEME_COLOR_KEYS = [
  'foreground',
  'background',
  'muted',
  'mutedForeground',
  'primary',
  'primaryForeground',
  'border',
  'accent',
  'destructive',
  'success',
  'warning',
  'info',
] as const satisfies readonly (keyof ColorTokens)[];

export function resolveColor(value: string, colors: ColorTokens): string {
  for (const key of THEME_COLOR_KEYS) {
    if (value === key) return colors[key];
  }

  return value;
}
