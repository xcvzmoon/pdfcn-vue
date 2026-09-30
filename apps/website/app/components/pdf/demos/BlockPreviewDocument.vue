<script setup lang="ts">
  import type { Component } from 'vue';
  import type { PdfcnTheme } from '#registry/types/pdf-themes.ts';
  import type { BlockSample } from '@/lib/block-runtime';
  import { computed } from 'vue';

  type BlockDocProps = {
    data?: BlockSample;
    theme?: PdfcnTheme;
  };

  const props = withDefaults(
    defineProps<{
      block: Component;
      data?: BlockSample;
      theme?: PdfcnTheme;
    }>(),
    {
      data: undefined,
      theme: undefined,
    },
  );

  const blockProps = computed<BlockDocProps>(() => {
    const next: BlockDocProps = {};
    if (props.data) next.data = props.data;
    if (props.theme) next.theme = props.theme;
    return next;
  });
</script>

<template>
  <!-- Blocks ship a full Forme Document root; render them directly. -->
  <component
    :is="block"
    v-bind="blockProps"
  />
</template>
