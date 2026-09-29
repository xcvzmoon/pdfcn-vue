<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import { View } from '@formepdf/vue';

defineProps<{ style?: Style }>();
</script>

<template>
  <View :wrap="false" :style="style"><slot /></View>
</template>
