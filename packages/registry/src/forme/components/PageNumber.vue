<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PageNumberAlign, PageNumberSize } from './page-chrome.types.ts';
  import { PAGE_NUMBER, TOTAL_PAGES, Text, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import { mergePdfStyles } from '../lib/styles.ts';
  import { usePdfcnTheme } from '../lib/theme.ts';

  const props = withDefaults(
    defineProps<{
      format?: string | undefined;
      align?: PageNumberAlign;
      size?: PageNumberSize;
      muted?: boolean;
      style?: Style | undefined;
    }>(),
    { align: 'center', format: 'Page {page} of {total}', muted: true, size: 'sm' },
  );

  const theme = usePdfcnTheme();

  const formatText = computed(() =>
    props.format.replaceAll('{page}', PAGE_NUMBER).replaceAll('{total}', TOTAL_PAGES),
  );

  const pdfStyle = computed<Style>(() => {
    const current = theme.value;
    const sizes = {
      xs: current.primitives.typography.xs,
      sm: current.primitives.typography.sm,
      md: current.primitives.typography.base,
    };
    return mergePdfStyles(
      {
        color: props.muted ? current.colors.mutedForeground : current.colors.foreground,
        fontFamily: current.typography.body.fontFamily,
        fontSize: sizes[props.size],
        textAlign: props.align,
      },
      props.style,
    );
  });

  const containerStyle = computed<Style>(() => ({ width: '100%' }));
</script>

<template>
  <View :style="containerStyle">
    <Text :style="pdfStyle">{{ formatText }}</Text>
  </View>
</template>
