export type DataTableSize = 'default' | 'compact';

export type DataTableAlign = 'left' | 'center' | 'right';

export type DataTableColumn = {
  key: string;
  header: string;
  align?: DataTableAlign | undefined;
  width?: string | number | undefined;
};

export type DataTableCellValue = string | number | boolean | null;

export type DataTableRow = Record<string, DataTableCellValue>;

export type DataTableFooter = Record<string, string | number>;
