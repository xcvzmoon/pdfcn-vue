<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { View } from '@formepdf/vue';
import { computed, provide } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { tableBodyContextKey } from './table-context.ts';

const props = defineProps<{ style?: Style }>();

let bodyRowIndex = 0;
provide(tableBodyContextKey, {
  nextRowIndex: () => {
    const index = bodyRowIndex;
    bodyRowIndex += 1;
    return index;
  },
});

const pdfStyle = computed(() => mergePdfStyles(props.style));
</script>

<template>
  <View :style="pdfStyle"><slot /></View>
</template>
