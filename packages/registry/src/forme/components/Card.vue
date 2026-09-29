<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { CardPadding, CardVariant } from './card.types.ts';
import { Text, View } from '@formepdf/vue';
import { computed } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

const props = withDefaults(
  defineProps<{
    title?: string | undefined;
    variant?: CardVariant;
    padding?: CardPadding;
    wrap?: boolean;
    style?: Style | undefined;
  }>(),
  { padding: 'md', variant: 'default', wrap: false },
);

const theme = usePdfcnTheme();

const cardStyle = computed<Style>(() => {
  const current = theme.value;
  const { spacing, borderRadius } = current.primitives;
  const paddings = { sm: spacing[2], md: spacing[3], lg: spacing[4] };
  return mergePdfStyles(
    {
      backgroundColor: props.variant === 'muted' ? current.colors.muted : current.colors.background,
      borderColor: current.colors.border,
      borderRadius: borderRadius.sm,
      borderWidth: props.variant === 'bordered' ? 2 : 1,
      marginBottom: current.spacing.componentGap,
      padding: paddings[props.padding],
    },
    props.style,
  );
});

const titleStyle = computed<Style>(() => {
  const current = theme.value;
  const { spacing, fontWeights } = current.primitives;
  return {
    borderBottomColor: current.colors.border,
    borderBottomWidth: 1,
    color: current.colors.foreground,
    fontFamily: current.typography.heading.fontFamily,
    fontSize: current.primitives.typography.base,
    fontWeight: fontWeights.semibold,
    lineHeight: current.typography.heading.lineHeight,
    marginBottom: spacing[2],
    marginTop: 0,
    paddingBottom: spacing[1] + 2,
  };
});
</script>

<template>
  <View :wrap="wrap" :style="cardStyle">
    <Text v-if="title" :style="titleStyle">{{ title }}</Text>
    <slot />
  </View>
</template>
