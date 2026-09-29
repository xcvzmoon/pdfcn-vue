<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { View } from '@formepdf/vue';
import { computed } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

export type StackGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';

const props = withDefaults(
  defineProps<{
    gap?: StackGap;
    direction?: 'vertical' | 'horizontal';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    wrap?: boolean;
    noWrap?: boolean;
    style?: Style | undefined;
  }>(),
  { gap: 'md', direction: 'vertical' },
);

const theme = usePdfcnTheme();
const pdfStyle = computed<Style>(() => {
  const spacing = theme.value.primitives.spacing;
  const gaps = { none: spacing[0], sm: spacing[2], md: spacing[4], lg: spacing[6], xl: spacing[8] };
  const alignment = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  } as const;
  const justification = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  } as const;

  return mergePdfStyles(
    {
      flexDirection: props.direction === 'horizontal' ? 'row' : 'column',
      gap: gaps[props.gap],
      alignItems: props.align ? alignment[props.align] : undefined,
      justifyContent: props.justify ? justification[props.justify] : undefined,
      flexWrap: props.wrap ? 'wrap' : undefined,
    },
    props.style,
  );
});
</script>

<template>
  <View :wrap="!noWrap" :style="pdfStyle"><slot /></View>
</template>
