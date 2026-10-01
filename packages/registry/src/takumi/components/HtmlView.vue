<script setup lang="ts">
  import type { Style } from '../lib/styles.ts';
  import { computed } from 'vue';
  import { toCssStyle } from '../lib/styles.ts';

  const props = withDefaults(defineProps<{ style?: Style | undefined; wrap?: boolean }>(), {
    wrap: true,
  });
  const cssStyle = computed<string>(
    () =>
      toCssStyle({
        display: 'flex',
        flexDirection: 'column',
        ...props.style,
      }) + (props.wrap ? '' : ';break-inside:avoid'),
  );
</script>

<template>
  <div :style="cssStyle"><slot /></div>
</template>
