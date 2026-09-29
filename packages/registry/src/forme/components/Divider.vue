<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { Text, View } from '@formepdf/vue';
import { computed } from 'vue';
import { resolveColor } from '../lib/resolve-color.ts';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';
import DividerLine from './DividerLine.vue';

const props = withDefaults(
  defineProps<{
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'dashed' | 'dotted';
    color?: string | undefined;
    thickness?: 'thin' | 'medium' | 'thick';
    label?: string | undefined;
    width?: string | number | undefined;
    style?: Style | undefined;
  }>(),
  { spacing: 'md', variant: 'solid', thickness: 'thin' },
);

const theme = usePdfcnTheme();
const lineColor = computed(() => resolveColor(props.color ?? 'border', theme.value.colors));
const lineThickness = computed(() => {
  const spacing = theme.value.primitives.spacing;
  return { thin: spacing[0.5], medium: spacing[1], thick: spacing[2] }[props.thickness];
});
const containerStyle = computed<Style>(() => {
  const current = theme.value;
  const margins = {
    none: current.primitives.spacing[0],
    sm: current.spacing.paragraphGap,
    md: current.spacing.componentGap,
    lg: current.spacing.sectionGap,
  };
  return mergePdfStyles(
    {
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: margins[props.spacing],
      width: props.width,
    },
    props.style,
  );
});
const labelStyle = computed<Style>(() => ({
  color: props.color ? lineColor.value : theme.value.colors.mutedForeground,
  fontFamily: theme.value.typography.body.fontFamily,
  fontSize: theme.value.primitives.typography.xs,
  fontWeight: theme.value.primitives.fontWeights.medium,
  letterSpacing: theme.value.primitives.letterSpacing.wider * 10,
  paddingHorizontal: theme.value.primitives.spacing[3],
  textTransform: 'uppercase',
}));
</script>

<template>
  <View :style="containerStyle">
    <DividerLine :variant="variant" :color="lineColor" :thickness="lineThickness" />
    <template v-if="label">
      <Text :style="labelStyle">{{ label }}</Text>
      <DividerLine :variant="variant" :color="lineColor" :thickness="lineThickness" />
    </template>
  </View>
</template>
