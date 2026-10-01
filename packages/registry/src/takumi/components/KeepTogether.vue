<script setup lang="ts">
  import type { Style } from '../lib/styles.ts';
  import { View } from '../lib/primitives.ts';

  defineProps<{ style?: Style }>();
</script>

<template>
  <View
    :wrap="false"
    :style="style"
    ><slot
  /></View>
</template>
