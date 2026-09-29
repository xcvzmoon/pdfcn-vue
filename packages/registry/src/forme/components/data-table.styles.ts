import type { Style } from '@formepdf/vue';
import type { PdfcnTheme } from '../../types/pdf-themes.ts';
import type { DataTableCellValue } from './data-table.types.ts';

export type CompactStyleSet = {
  cell: Style;
  headerText: Style;
  footerText: Style;
  text: Style;
};

export function createCompactStyles(t: PdfcnTheme): CompactStyleSet {
  const { spacing, fontWeights, lineHeights } = t.primitives;
  const baseText: Style = {
    color: t.colors.foreground,
    fontFamily: t.typography.body.fontFamily,
    fontSize: t.primitives.typography.xs,
    lineHeight: lineHeights.normal,
    margin: 0,
    padding: 0,
  };
  return {
    cell: {
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[0.5],
    },
    footerText: {
      ...baseText,
      fontWeight: fontWeights.semibold,
    },
    headerText: {
      ...baseText,
      fontWeight: fontWeights.semibold,
    },
    text: baseText,
  };
}

export function formatValue(value: DataTableCellValue | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value);
}
