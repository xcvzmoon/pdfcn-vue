<script setup lang="ts">
  import type { Style } from '../lib/styles.ts';
  import { toCssStyle } from '../lib/styles.ts';

  defineProps<{ style?: Style }>();
</script>

<template>
  <p :style="toCssStyle(style)"><slot /></p>
</template>
