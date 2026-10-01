import type { Style as FormeStyle } from '@formepdf/vue';

export type Style = {
  [Key in keyof FormeStyle]?: Extract<FormeStyle[Key], string | number> | undefined;
};

export function mergePdfStyles(...styles: (Style | undefined)[]): Style {
  const merged: Style = {};
  for (const style of styles) {
    if (style) Object.assign(merged, style);
  }
  return merged;
}

const unitless = new Set([
  'fontWeight',
  'lineHeight',
  'opacity',
  'flex',
  'gridColumnStart',
  'gridColumnEnd',
  'gridRowStart',
  'gridRowEnd',
  'gridColumnSpan',
  'gridRowSpan',
  'flexGrow',
  'flexShrink',
  'zIndex',
]);
const expandedProperties = new Map<string, readonly string[]>([
  ['marginHorizontal', ['marginLeft', 'marginRight']],
  ['marginVertical', ['marginTop', 'marginBottom']],
  ['paddingHorizontal', ['paddingLeft', 'paddingRight']],
  ['paddingVertical', ['paddingTop', 'paddingBottom']],
]);

export function toCssStyle(style: Style = {}): string {
  const declarations: string[] = [];
  for (const [property, value] of Object.entries(style)) {
    if (value === undefined || value === null) continue;
    const properties = expandedProperties.get(property) ?? [property];
    for (const name of properties) {
      if (name === 'gridColumnSpan' || name === 'gridRowSpan') {
        declarations.push(
          `${name === 'gridColumnSpan' ? 'grid-column' : 'grid-row'}:span ${value}`,
        );
        continue;
      }
      const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      const cssValue = Number.isFinite(value) && !unitless.has(name) ? `${value}pt` : String(value);
      declarations.push(`${cssName}:${cssValue}`);
    }
  }
  if (
    style.borderWidth ||
    style.borderTopWidth ||
    style.borderRightWidth ||
    style.borderBottomWidth ||
    style.borderLeftWidth
  )
    declarations.push('border-style:solid');
  return declarations.join(';');
}
