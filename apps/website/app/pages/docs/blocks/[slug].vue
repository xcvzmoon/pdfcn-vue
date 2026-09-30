<script setup lang="ts">
  import BlockDetailPage from '@/components/content/BlockDetailPage.vue';
  import { findBlockDoc } from '@/data/blocks';

  definePageMeta({ layout: 'docs' });
  const route = useRoute();
  const doc = computed(() => findBlockDoc(String(route.params.slug)));
  if (!doc.value) throw createError({ statusCode: 404, statusMessage: 'Block not found' });
  useSeoMeta({
    title: () => `${doc.value?.title} · pdfcn-vue`,
    description: () => doc.value?.description,
  });
</script>

<template>
  <BlockDetailPage :key="String(route.params.slug)" />
</template>
