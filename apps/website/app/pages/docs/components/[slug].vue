<script setup lang="ts">
  import ComponentDetailPage from '@/components/content/ComponentDetailPage.vue';
  import { findComponentDoc } from '@/data/components';

  definePageMeta({ layout: 'docs' });
  const route = useRoute();
  const doc = computed(() => findComponentDoc(String(route.params.slug)));
  if (!doc.value) throw createError({ statusCode: 404, statusMessage: 'Component not found' });
  useSeoMeta({
    title: () => `${doc.value?.title} · pdfcn-vue`,
    description: () => doc.value?.description,
  });
</script>

<template>
  <ComponentDetailPage :key="String(route.params.slug)" />
</template>
