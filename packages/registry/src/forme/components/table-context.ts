import type { ComputedRef, InjectionKey } from 'vue';
import type { TableVariant } from './table.types.ts';

export type TableContextValue = {
  variant: TableVariant;
  zebraStripe: boolean;
  columnCount: number | null;
};

export type TableRowContextValue = {
  header: boolean;
  footer: boolean;
  stripe: boolean;
  variant: TableVariant;
  nextCellIndex: () => number;
};

export type TableBodyContextValue = {
  nextRowIndex: () => number;
};

export const tableContextKey: InjectionKey<ComputedRef<TableContextValue>> = Symbol('pdfcn-table');
export const tableRowContextKey: InjectionKey<ComputedRef<TableRowContextValue>> =
  Symbol('pdfcn-table-row');
export const tableBodyContextKey: InjectionKey<TableBodyContextValue> = Symbol('pdfcn-table-body');
