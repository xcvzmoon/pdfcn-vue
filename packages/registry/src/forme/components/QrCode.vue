<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { QrCode as FormeQrCode, Text, View } from '@formepdf/vue';
import { computed } from 'vue';
import { resolveColor } from '../lib/resolve-color.ts';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

const props = withDefaults(
  defineProps<{
    value: string;
    size?: number;
    color?: string | undefined;
    backgroundColor?: string | undefined;
    caption?: string | undefined;
    style?: Style | undefined;
  }>(),
  { color: '#000000', size: 100 },
);

const theme = usePdfcnTheme();

const containerStyle = computed<Style>(() => mergePdfStyles({ alignItems: 'center' }, props.style));

const qrColor = computed(() => resolveColor(props.color, theme.value.colors));

const captionStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    marginTop: current.primitives.spacing[1],
    textAlign: 'center',
  };
});
</script>

<template>
  <View :style="containerStyle">
    <FormeQrCode :data="value" :size="size" :color="qrColor" />
    <Text v-if="caption" :style="captionStyle">{{ caption }}</Text>
  </View>
</template>
