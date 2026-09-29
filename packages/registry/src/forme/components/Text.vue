<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { Text as FormeText } from '@formepdf/vue';

defineProps<{
  style?: Style;
}>();
</script>

<template>
  <FormeText :style="style"><slot /></FormeText>
</template>
