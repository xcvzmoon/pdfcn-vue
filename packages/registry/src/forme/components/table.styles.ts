import type { Style } from '@formepdf/vue';
import type { PdfcnTheme } from '../../types/pdf-themes.ts';
import type { TableVariant } from './table.types.ts';

export type TableStyleSet = {
  table: Style;
  tableByVariant: Record<TableVariant, Style>;
  row: Style;
  rowByVariant: Record<TableVariant, Style>;
  rowHeaderByVariant: Record<TableVariant, Style>;
  rowFooter: Style;
  rowFooterStriped: Style;
  rowStripe: Style;
  cell: Style;
  cellFixed: Style;
  cellByVariant: Partial<Record<TableVariant, Style>>;
  cellGridBorder: Style;
  cellBorderedBorder: Style;
  cellText: Style;
  cellTextCompact: Style;
  cellTextFooter: Style;
  cellTextHeaderByVariant: Record<TableVariant, Style>;
};

export function createTableStyles(t: PdfcnTheme): TableStyleSet {
  const { spacing, borderRadius, fontWeights, typography } = t.primitives;
  const borderColor = t.colors.border;
  const hairline = 0.5;
  const rule = 1;
  const thick = 1.5;
  const cellPadV = spacing[2] - 2;
  const cellPadH = spacing[2] + 2;
  const cellPadVCompact = spacing[0.5];
  const cellPadHCompact = spacing[2];
  const rowDivider: Style = {
    borderBottomColor: borderColor,
    borderBottomWidth: hairline,
  };

  const cell: Style = {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: cellPadH,
    paddingVertical: cellPadV,
  };

  const cellFixed: Style = {
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    paddingHorizontal: cellPadH,
    paddingVertical: cellPadV,
  };

  const cellText: Style = {
    color: t.colors.foreground,
    fontFamily: t.typography.body.fontFamily,
    fontSize: t.typography.body.fontSize,
    lineHeight: 1.2,
    margin: 0,
    padding: 0,
  };

  return {
    cell,
    cellFixed,
    cellBorderedBorder: {
      borderRightColor: borderColor,
      borderRightWidth: hairline,
    },
    cellByVariant: {
      bordered: {
        paddingHorizontal: cellPadH,
        paddingVertical: cellPadV,
      },
      compact: {
        paddingHorizontal: cellPadHCompact,
        paddingVertical: cellPadVCompact,
      },
      minimal: {
        paddingHorizontal: spacing[2] - 2,
        paddingVertical: spacing[1] + 1,
      },
      'primary-header': {
        paddingHorizontal: cellPadH,
        paddingVertical: cellPadV,
      },
      striped: {
        paddingHorizontal: cellPadH,
        paddingVertical: cellPadV,
      },
    },
    cellGridBorder: {
      borderRightColor: borderColor,
      borderRightWidth: hairline,
    },
    cellText,
    cellTextCompact: {
      ...cellText,
      fontSize: typography.xs,
    },
    cellTextFooter: {
      ...cellText,
      fontWeight: fontWeights.semibold,
    },
    cellTextHeaderByVariant: {
      bordered: {
        ...cellText,
        fontWeight: fontWeights.bold,
      },
      compact: {
        ...cellText,
        fontSize: typography.xs,
        fontWeight: fontWeights.semibold,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
      },
      grid: {
        ...cellText,
        fontWeight: fontWeights.semibold,
      },
      line: {
        ...cellText,
        fontWeight: fontWeights.semibold,
      },
      minimal: {
        ...cellText,
        color: t.colors.mutedForeground,
        fontWeight: fontWeights.medium,
      },
      'primary-header': {
        ...cellText,
        color: t.colors.primaryForeground,
        fontSize: typography.xs,
        fontWeight: fontWeights.semibold,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
      },
      striped: {
        ...cellText,
        fontWeight: fontWeights.semibold,
      },
    },
    row: {
      flexDirection: 'row',
    },
    rowByVariant: {
      bordered: rowDivider,
      compact: rowDivider,
      grid: rowDivider,
      line: rowDivider,
      minimal: rowDivider,
      'primary-header': rowDivider,
      striped: {},
    },
    rowFooter: {
      borderTopColor: borderColor,
      borderTopWidth: rule,
    },
    rowFooterStriped: {
      backgroundColor: t.colors.muted,
      borderTopColor: borderColor,
      borderTopWidth: rule,
    },
    rowHeaderByVariant: {
      bordered: {
        backgroundColor: t.colors.muted,
        borderBottomColor: borderColor,
        borderBottomWidth: hairline,
      },
      compact: {
        backgroundColor: t.colors.muted,
        borderBottomColor: borderColor,
        borderBottomWidth: rule,
      },
      grid: {
        backgroundColor: t.colors.muted,
        borderBottomColor: borderColor,
        borderBottomWidth: rule,
      },
      line: {
        borderBottomColor: borderColor,
        borderBottomWidth: rule,
      },
      minimal: {
        borderBottomColor: borderColor,
        borderBottomWidth: rule,
      },
      'primary-header': {
        backgroundColor: t.colors.primary,
      },
      striped: {
        backgroundColor: t.colors.muted,
        borderBottomColor: borderColor,
        borderBottomWidth: rule,
      },
    },
    rowStripe: {
      backgroundColor: t.colors.muted,
    },
    table: {
      flexDirection: 'column',
      marginBottom: t.spacing.componentGap,
      width: '100%',
    },
    tableByVariant: {
      bordered: {
        borderBottomLeftRadius: borderRadius.sm,
        borderBottomRightRadius: borderRadius.sm,
        borderColor,
        borderTopLeftRadius: borderRadius.sm,
        borderTopRightRadius: borderRadius.sm,
        borderWidth: rule,
        overflow: 'hidden',
      },
      compact: {
        borderBottomColor: borderColor,
        borderBottomWidth: hairline,
      },
      grid: {
        borderBottomLeftRadius: borderRadius.md,
        borderBottomRightRadius: borderRadius.md,
        borderColor,
        borderTopLeftRadius: borderRadius.md,
        borderTopRightRadius: borderRadius.md,
        borderWidth: thick,
        overflow: 'hidden',
      },
      line: {
        borderBottomColor: borderColor,
        borderBottomWidth: hairline,
      },
      minimal: {
        paddingVertical: spacing[2],
      },
      'primary-header': {
        borderBottomColor: borderColor,
        borderBottomWidth: hairline,
      },
      striped: {
        borderBottomColor: borderColor,
        borderBottomWidth: hairline,
        borderTopColor: borderColor,
        borderTopWidth: hairline,
      },
    },
  };
}
