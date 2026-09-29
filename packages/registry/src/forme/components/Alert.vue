<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { AlertVariant } from './alert.types.ts';
import { Svg, Text, View } from '@formepdf/vue';
import { computed } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

const props = withDefaults(
  defineProps<{
    variant?: AlertVariant;
    title?: string | undefined;
    showIcon?: boolean;
    showBorder?: boolean;
    style?: Style | undefined;
  }>(),
  { showBorder: true, showIcon: true, variant: 'info' },
);

const theme = usePdfcnTheme();

function iconContent(variant: AlertVariant, color: string): string {
  const stroke = `stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  if (variant === 'error') {
    return `<circle cx="8" cy="8" r="7" ${stroke} /><line x1="5.5" y1="5.5" x2="10.5" y2="10.5" ${stroke} /><line x1="10.5" y1="5.5" x2="5.5" y2="10.5" ${stroke} />`;
  }
  if (variant === 'success') {
    return `<circle cx="8" cy="8" r="7" ${stroke} /><path d="M5 8 L7 10 L11 6" ${stroke} />`;
  }
  if (variant === 'warning') {
    return `<path d="M8 1.5 L15 14.5 L1 14.5 Z" ${stroke} /><line x1="8" y1="6" x2="8" y2="10" ${stroke} /><circle cx="8" cy="12.5" r="0.75" fill="${color}" />`;
  }
  return `<circle cx="8" cy="8" r="7" ${stroke} /><circle cx="8" cy="4.5" r="1" fill="${color}" /><line x1="8" y1="7" x2="8" y2="11.5" ${stroke} />`;
}

const variantColor = computed(() => {
  const c = theme.value.colors;
  return {
    error: c.destructive,
    info: c.info,
    success: c.success,
    warning: c.warning,
  }[props.variant];
});

const containerStyle = computed<Style>(() => {
  const current = theme.value;
  return mergePdfStyles(
    {
      backgroundColor: current.colors.muted,
      borderRadius: 4,
      borderLeftColor: props.showBorder ? variantColor.value : undefined,
      borderLeftWidth: props.showBorder ? 4 : 0,
      flexDirection: 'row',
      marginBottom: current.spacing.componentGap,
      padding: 12,
    },
    props.style,
  );
});

const iconContainerStyle = computed<Style>(() => ({
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginRight: 10,
  paddingTop: 2,
  width: 20,
}));

const contentStyle = computed<Style>(() => ({ flex: 1 }));

const titleStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.foreground,
    fontFamily: current.typography.heading.fontFamily,
    fontSize: current.primitives.typography.sm,
    fontWeight: current.primitives.fontWeights.semibold,
    marginBottom: 4,
    marginTop: 0,
  };
});
</script>

<template>
  <View :wrap="false" :style="containerStyle">
    <View v-if="showIcon" :style="iconContainerStyle">
      <Svg
        :width="16"
        :height="16"
        viewBox="0 0 16 16"
        :content="iconContent(variant, variantColor)"
      />
    </View>
    <View :style="contentStyle">
      <Text v-if="title" :style="titleStyle">{{ title }}</Text>
      <slot />
    </View>
  </View>
</template>
