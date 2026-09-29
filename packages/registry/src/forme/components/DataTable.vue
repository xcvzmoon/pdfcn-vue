<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type {
  DataTableCellValue,
  DataTableColumn,
  DataTableFooter,
  DataTableRow,
  DataTableSize,
} from './data-table.types.ts';
import type { TableVariant } from './table.types.ts';
import { Text } from '@formepdf/vue';
import { computed, useSlots } from 'vue';
import { usePdfcnTheme } from '../lib/theme.ts';
import { createCompactStyles, formatValue } from './data-table.styles.ts';
import Table from './Table.vue';
import TableBody from './TableBody.vue';
import TableCell from './TableCell.vue';
import TableFooter from './TableFooter.vue';
import TableHeader from './TableHeader.vue';
import TableRow from './TableRow.vue';

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[];
    data: DataTableRow[];
    variant?: TableVariant | undefined;
    footer?: DataTableFooter | undefined;
    stripe?: boolean;
    size?: DataTableSize;
    noWrap?: boolean;
    style?: Style | undefined;
  }>(),
  { noWrap: false, size: 'default', stripe: false, variant: 'grid' },
);

const slots = useSlots();
const theme = usePdfcnTheme();
const compact = computed(() => createCompactStyles(theme.value));
const isCompact = computed(() => props.size === 'compact');
const columnCount = computed(() => props.columns.length);

function cellSlotName(key: string): string {
  return `cell-${key}`;
}

function footerSlotName(key: string): string {
  return `footer-${key}`;
}

function rowValue(row: DataTableRow, key: string): DataTableCellValue | undefined {
  return row[key];
}

function footerValue(key: string): string | number {
  return props.footer?.[key] ?? '';
}

function alignStyle(align: 'left' | 'center' | 'right' | undefined): Style | undefined {
  return align ? { textAlign: align } : undefined;
}
</script>

<template>
  <Table
    :variant="variant"
    :zebra-stripe="stripe"
    :no-wrap="noWrap"
    :column-count="columnCount"
    :style="style"
  >
    <TableHeader>
      <TableRow header>
        <TableCell
          v-for="col in columns"
          :key="col.key"
          header
          :align="col.align ?? 'left'"
          :width="col.width"
          :style="isCompact ? compact.cell : undefined"
          :text="isCompact ? undefined : col.header"
        >
          <Text v-if="isCompact" :style="[compact.headerText, alignStyle(col.align)]">
            {{ col.header }}
          </Text>
        </TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(row, rowIndex) in data" :key="rowIndex">
        <TableCell
          v-for="col in columns"
          :key="col.key"
          :align="col.align ?? 'left'"
          :width="col.width"
          :style="isCompact ? compact.cell : undefined"
          :text="
            isCompact || slots[cellSlotName(col.key)]
              ? undefined
              : formatValue(rowValue(row, col.key))
          "
        >
          <slot
            v-if="slots[cellSlotName(col.key)]"
            :name="cellSlotName(col.key)"
            :value="rowValue(row, col.key)"
            :row="row"
          />
          <Text v-else-if="isCompact" :style="[compact.text, alignStyle(col.align)]">
            {{ formatValue(rowValue(row, col.key)) }}
          </Text>
        </TableCell>
      </TableRow>
    </TableBody>
    <TableFooter v-if="footer">
      <TableRow footer>
        <TableCell
          v-for="col in columns"
          :key="col.key"
          :footer="footerValue(col.key) !== ''"
          :align="col.align ?? 'left'"
          :width="col.width"
          :style="isCompact ? compact.cell : undefined"
          :text="
            isCompact || slots[footerSlotName(col.key)]
              ? undefined
              : formatValue(footerValue(col.key))
          "
        >
          <slot
            v-if="slots[footerSlotName(col.key)]"
            :name="footerSlotName(col.key)"
            :value="footerValue(col.key)"
          />
          <Text
            v-else-if="isCompact"
            :style="[
              footerValue(col.key) !== '' ? compact.footerText : compact.text,
              alignStyle(col.align),
            ]"
          >
            {{ formatValue(footerValue(col.key)) }}
          </Text>
        </TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</template>
