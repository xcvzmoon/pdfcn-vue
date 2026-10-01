<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{ content: string; width: number; height: number; viewBox?: string }>();
  const source = computed<string>(
    () =>
      'data:image/svg+xml,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${props.width}" height="${props.height}" viewBox="${props.viewBox ?? `0 0 ${props.width} ${props.height}`}">${props.content}</svg>`,
      ),
  );
</script>

<template>
  <img
    :src="source"
    :style="{ width: `${width}pt`, height: `${height}pt` }"
    alt=""
  />
</template>
