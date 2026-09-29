<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { Link as FormeLink, Text as FormeText } from '@formepdf/vue';
import { computed } from 'vue';
import { resolveColor } from '../lib/resolve-color.ts';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

const props = withDefaults(
  defineProps<{
    href: string;
    align?: 'left' | 'center' | 'right';
    color?: string | undefined;
    variant?: 'default' | 'muted' | 'primary';
    underline?: 'always' | 'none';
    style?: Style | undefined;
  }>(),
  { variant: 'default', underline: 'always' },
);

const theme = usePdfcnTheme();
const pdfStyle = computed<Style>(() => {
  const current = theme.value;
  const colors = {
    default: current.colors.accent,
    muted: current.colors.mutedForeground,
    primary: current.colors.primary,
  };
  const weights = {
    default: current.primitives.fontWeights.medium,
    muted: current.primitives.fontWeights.regular,
    primary: current.primitives.fontWeights.semibold,
  };
  return mergePdfStyles(
    {
      color: props.color ? resolveColor(props.color, current.colors) : colors[props.variant],
      fontFamily: current.typography.body.fontFamily,
      fontSize: current.typography.body.fontSize,
      fontWeight: weights[props.variant],
      lineHeight: current.typography.body.lineHeight,
      marginBottom: current.spacing.paragraphGap,
      textAlign: props.align,
      textDecoration: props.underline === 'none' ? 'none' : 'underline',
    },
    props.style,
  );
});
</script>

<template>
  <FormeText :style="pdfStyle">
    <FormeLink :href="href" :style="pdfStyle"><slot /></FormeLink>
  </FormeText>
</template>
