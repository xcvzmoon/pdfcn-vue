<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import { Watermark as FormeWatermark } from '@formepdf/vue';
  import { computed } from 'vue';
  import { resolveColor } from '../lib/resolve-color.ts';
  import { mergePdfStyles } from '../lib/styles.ts';
  import { usePdfcnTheme } from '../lib/theme.ts';

  const props = withDefaults(
    defineProps<{
      text: string;
      opacity?: number | undefined;
      fontSize?: number | undefined;
      color?: string | undefined;
      angle?: number | undefined;
      style?: Style | undefined;
    }>(),
    { angle: -45, color: 'mutedForeground', fontSize: 60, opacity: 0.15 },
  );

  const theme = usePdfcnTheme();

  function withOpacity(color: string, opacity: number): string {
    const match = color.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    if (!match) return color;
    const red = Number.parseInt(match[1] ?? '0', 16);
    const green = Number.parseInt(match[2] ?? '0', 16);
    const blue = Number.parseInt(match[3] ?? '0', 16);
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }

  const resolvedColor = computed(() =>
    withOpacity(resolveColor(props.color, theme.value.colors), props.opacity),
  );

  const pdfStyle = computed(() => mergePdfStyles(props.style));
</script>

<template>
  <FormeWatermark
    :text="text"
    :angle="angle"
    :color="resolvedColor"
    :font-size="fontSize"
    :style="pdfStyle"
  />
</template>
