<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { TableVariant } from './table.types.ts';
import { Text, View } from '@formepdf/vue';
import { computed, inject } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';
import { tableContextKey, tableRowContextKey } from './table-context.ts';
import { createTableStyles } from './table.styles.ts';

const props = withDefaults(
  defineProps<{
    header?: boolean;
    footer?: boolean;
    align?: 'left' | 'center' | 'right' | undefined;
    width?: string | number | undefined;
    variant?: TableVariant | undefined;
    text?: string | undefined;
    style?: Style | undefined;
  }>(),
  { footer: false, header: false },
);

const theme = usePdfcnTheme();
const table = inject(tableContextKey, null);
const row = inject(tableRowContextKey, null);
const styles = computed(() => createTableStyles(theme.value));

const variant = computed(
  () => props.variant ?? row?.value.variant ?? table?.value.variant ?? 'line',
);
const isHeader = computed(() => props.header || row?.value.header === true);
const isFooter = computed(() => props.footer || row?.value.footer === true);

// Cell index is claimed once at setup so grid/bordered borders stay stable.
const cellIndex = row?.value.nextCellIndex() ?? 0;
const isLastCell = computed(() => {
  const columnCount = table?.value.columnCount ?? null;
  if (columnCount === null) return false;
  return cellIndex >= columnCount - 1;
});

const cellStyle = computed<Style>(() => {
  const current = styles.value;
  const base = props.width === undefined ? current.cell : current.cellFixed;
  return mergePdfStyles(
    base,
    current.cellByVariant[variant.value],
    props.width === undefined ? undefined : { width: props.width },
    variant.value === 'grid' && !isLastCell.value ? current.cellGridBorder : undefined,
    variant.value === 'bordered' && !isLastCell.value ? current.cellBorderedBorder : undefined,
    props.align ? { textAlign: props.align } : undefined,
    props.style,
  );
});

const textStyle = computed<Style>(() => {
  const current = styles.value;
  let base = current.cellText;
  if (isHeader.value) {
    base = current.cellTextHeaderByVariant[variant.value];
  } else if (isFooter.value) {
    base = current.cellTextFooter;
  } else if (variant.value === 'compact') {
    base = current.cellTextCompact;
  }
  return mergePdfStyles(base, props.align ? { textAlign: props.align } : undefined);
});
</script>

<template>
  <View :style="cellStyle">
    <Text v-if="text !== undefined" :style="textStyle">{{ text }}</Text>
    <slot />
  </View>
</template>
