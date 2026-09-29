import type { Style } from '@formepdf/vue';

export type TableVariant =
  | 'line'
  | 'grid'
  | 'minimal'
  | 'striped'
  | 'compact'
  | 'bordered'
  | 'primary-header';

export type TableSection = 'header' | 'body' | 'footer';

export type TableProps = {
  variant?: TableVariant;
  zebraStripe?: boolean;
  noWrap?: boolean;
  columnCount?: number | undefined;
  style?: Style | undefined;
};

export type TableRowProps = {
  header?: boolean;
  footer?: boolean;
  stripe?: boolean;
  variant?: TableVariant;
  style?: Style | undefined;
};

export type TableCellProps = {
  header?: boolean;
  footer?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number | undefined;
  variant?: TableVariant;
  text?: string | undefined;
  style?: Style | undefined;
};
