<script setup lang="ts">
  import type { PdfcnTheme } from '../../src/types/pdf-themes.ts';
  import PdfcnThemeProvider from '../../src/forme/components/PdfcnThemeProvider.vue';
  import ThemeContent from './ThemeContent.vue';

  defineProps<{
    theme?: PdfcnTheme;
  }>();
</script>

<template>
  <PdfcnThemeProvider :theme="theme">
    <ThemeContent />
  </PdfcnThemeProvider>
</template>
