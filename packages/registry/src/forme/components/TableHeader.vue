<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { View } from '@formepdf/vue';
import { computed } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';

const props = defineProps<{ style?: Style }>();

const pdfStyle = computed(() => mergePdfStyles(props.style));
</script>

<template>
  <View :style="pdfStyle"><slot /></View>
</template>
