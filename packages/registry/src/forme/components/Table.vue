<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { TableVariant } from './table.types.ts';
  import { View } from '@formepdf/vue';
  import { computed, provide } from 'vue';
  import { mergePdfStyles } from '../lib/styles.ts';
  import { usePdfcnTheme } from '../lib/theme.ts';
  import { tableContextKey } from './table-context.ts';
  import { createTableStyles } from './table.styles.ts';

  const props = withDefaults(
    defineProps<{
      variant?: TableVariant | undefined;
      zebraStripe?: boolean;
      noWrap?: boolean;
      columnCount?: number | undefined;
      style?: Style | undefined;
    }>(),
    { variant: 'line', zebraStripe: false, noWrap: false },
  );

  const theme = usePdfcnTheme();
  const styles = computed(() => createTableStyles(theme.value));
  const effectiveZebra = computed(() => props.variant === 'striped' || props.zebraStripe);

  provide(
    tableContextKey,
    computed(() => ({
      variant: props.variant ?? 'line',
      zebraStripe: effectiveZebra.value,
      columnCount: props.columnCount ?? null,
    })),
  );

  const pdfStyle = computed<Style>(() =>
    mergePdfStyles(
      styles.value.table,
      styles.value.tableByVariant[props.variant ?? 'line'],
      props.style,
    ),
  );
</script>

<template>
  <View
    v-if="noWrap"
    :wrap="false"
    :style="pdfStyle"
    ><slot
  /></View>
  <View
    v-else
    :style="pdfStyle"
    ><slot
  /></View>
</template>
