<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { View } from '@formepdf/vue';
import { computed } from 'vue';
import { resolveColor } from '../lib/resolve-color.ts';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg';
export type SectionVariant = 'default' | 'callout' | 'highlight' | 'card';

const props = withDefaults(
  defineProps<{
    spacing?: SectionSpacing;
    padding?: SectionPadding;
    background?: string | undefined;
    border?: boolean;
    variant?: SectionVariant;
    accentColor?: string | undefined;
    noWrap?: boolean;
    style?: Style | undefined;
  }>(),
  { spacing: 'md', variant: 'default' },
);

const theme = usePdfcnTheme();
const pdfStyle = computed<Style>(() => {
  const current = theme.value;
  const spacing = current.primitives.spacing;
  const margins = {
    none: spacing[0],
    sm: spacing[4],
    md: current.spacing.sectionGap,
    lg: spacing[8],
    xl: spacing[12],
  };
  const paddings = { none: spacing[0], sm: spacing[3], md: spacing[4], lg: spacing[6] };
  const framed = props.variant === 'card' || (props.variant === 'default' && props.border);
  const accented = props.variant === 'callout' || props.variant === 'highlight';

  return mergePdfStyles(
    {
      flexDirection: 'column',
      marginVertical: margins[props.spacing],
      padding: props.variant === 'card' || props.variant === 'highlight' ? spacing[4] : undefined,
      paddingLeft: props.variant === 'callout' ? spacing[4] : undefined,
      paddingVertical: props.variant === 'callout' ? spacing[2] : undefined,
      backgroundColor: props.variant === 'highlight' ? current.colors.muted : undefined,
      borderColor: framed ? current.colors.border : undefined,
      borderWidth: framed ? spacing[0.5] : undefined,
      borderRadius: framed ? current.primitives.borderRadius.md : undefined,
      borderLeftColor: accented
        ? resolveColor(props.accentColor ?? 'primary', current.colors)
        : undefined,
      borderLeftWidth: accented ? spacing[1] : undefined,
    },
    props.padding ? { padding: paddings[props.padding] } : undefined,
    props.background
      ? { backgroundColor: resolveColor(props.background, current.colors) }
      : undefined,
    props.style,
  );
});
</script>

<template>
  <View :wrap="!noWrap" :style="pdfStyle"><slot /></View>
</template>
