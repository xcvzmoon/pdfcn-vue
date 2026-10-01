<script setup lang="ts">
  import type { Style } from '../lib/styles.ts';
  import { toCssStyle } from '../lib/styles.ts';

  defineProps<{ src: string; alt?: string; style?: Style }>();
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :style="toCssStyle(style)"
  />
</template>
