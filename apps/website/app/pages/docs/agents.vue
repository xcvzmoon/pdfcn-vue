<script setup lang="ts">
  import AgentsPage from '@/components/content/AgentsPage.vue';

  definePageMeta({ layout: 'docs' });
  useSeoMeta({
    title: 'Agent discovery · pdfcn-vue',
    description: 'Find PDF components, inspect registry source, and install items with shadcn-vue.',
  });
</script>

<template>
  <AgentsPage />
</template>
