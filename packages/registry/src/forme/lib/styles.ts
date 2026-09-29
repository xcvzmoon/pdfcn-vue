import type { Style } from '@formepdf/vue';

type PdfStyleInput = { [Key in keyof Style]?: Style[Key] | undefined };

export function mergePdfStyles(...styles: (PdfStyleInput | undefined)[]): Style {
  const merged: Style = {};
  for (const style of styles) {
    if (style) Object.assign(merged, style);
  }
  return merged;
}
