<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { TableVariant } from './table.types.ts';
import { View } from '@formepdf/vue';
import { computed, inject, provide } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';
import { tableBodyContextKey, tableContextKey, tableRowContextKey } from './table-context.ts';
import { createTableStyles } from './table.styles.ts';

const props = withDefaults(
  defineProps<{
    header?: boolean;
    footer?: boolean;
    stripe?: boolean;
    variant?: TableVariant | undefined;
    style?: Style | undefined;
  }>(),
  { footer: false, header: false, stripe: false },
);

const theme = usePdfcnTheme();
const table = inject(tableContextKey, null);
const body = inject(tableBodyContextKey, null);
const styles = computed(() => createTableStyles(theme.value));

const variant = computed(() => props.variant ?? table?.value.variant ?? 'line');

// Stripe is resolved once at setup so the body row counter advances exactly once per row.
const resolvedStripe = (() => {
  if (props.header || props.footer) return false;
  if (props.stripe) return true;
  if (!table?.value.zebraStripe || !body) return false;
  return body.nextRowIndex() % 2 === 1;
})();

let cellIndex = 0;
provide(
  tableRowContextKey,
  computed(() => ({
    footer: props.footer,
    header: props.header,
    nextCellIndex: () => {
      const index = cellIndex;
      cellIndex += 1;
      return index;
    },
    stripe: resolvedStripe,
    variant: variant.value,
  })),
);

const pdfStyle = computed<Style>(() => {
  const current = styles.value;
  return mergePdfStyles(
    current.row,
    current.rowByVariant[variant.value],
    props.header ? current.rowHeaderByVariant[variant.value] : undefined,
    props.footer
      ? variant.value === 'striped'
        ? current.rowFooterStriped
        : current.rowFooter
      : undefined,
    resolvedStripe ? current.rowStripe : undefined,
    props.style,
  );
});
</script>

<template>
  <View :wrap="false" :style="pdfStyle"><slot /></View>
</template>
