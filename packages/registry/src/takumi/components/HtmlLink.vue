<script setup lang="ts">
  import type { Style } from '../lib/styles.ts';
  import { toCssStyle } from '../lib/styles.ts';

  defineProps<{ href: string; style?: Style }>();
</script>

<template>
  <a
    :href="href"
    :style="toCssStyle(style)"
    ><slot
  /></a>
</template>
