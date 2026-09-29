<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { Text as FormeText } from '@formepdf/vue';
import { computed } from 'vue';
import { resolveColor } from '../lib/resolve-color.ts';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

export type TextVariant = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

const props = withDefaults(
  defineProps<{
    variant?: TextVariant;
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    weight?: TextWeight;
    italic?: boolean;
    decoration?: 'underline' | 'line-through' | 'none';
    transform?: 'uppercase' | 'lowercase' | 'capitalize';
    noMargin?: boolean;
    style?: Style;
  }>(),
  { weight: 'normal', decoration: 'none' },
);

const theme = usePdfcnTheme();
const pdfStyle = computed<Style>(() => {
  const current = theme.value;
  return mergePdfStyles(
    {
      color: resolveColor(props.color ?? 'foreground', current.colors),
      fontFamily: current.typography.body.fontFamily,
      fontSize: props.variant
        ? current.primitives.typography[props.variant]
        : current.typography.body.fontSize,
      fontWeight:
        current.primitives.fontWeights[props.weight === 'normal' ? 'regular' : props.weight],
      lineHeight: current.typography.body.lineHeight,
      marginBottom: props.noMargin ? 0 : current.spacing.paragraphGap,
      marginTop: 0,
    },
    {
      textAlign: props.align,
      fontStyle: props.italic ? 'italic' : undefined,
      textDecoration: props.decoration,
      textTransform: props.transform,
      letterSpacing:
        props.transform === 'uppercase' ? current.primitives.letterSpacing.wider * 10 : undefined,
    },
    props.style,
  );
});
</script>

<template>
  <FormeText :style="pdfStyle"><slot /></FormeText>
</template>
