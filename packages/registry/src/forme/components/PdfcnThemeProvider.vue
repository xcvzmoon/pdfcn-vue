<script setup lang="ts">
import type { PdfcnTheme } from '../../types/pdf-themes.ts';
import { computed, provide } from 'vue';
import { professionalTheme } from '../../themes/professional.ts';
import { pdfcnThemeKey } from '../lib/theme.ts';

const props = defineProps<{
  theme?: PdfcnTheme | undefined;
}>();

provide(
  pdfcnThemeKey,
  computed(() => props.theme ?? professionalTheme),
);
</script>

<template>
  <slot />
</template>
