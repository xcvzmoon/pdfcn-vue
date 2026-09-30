<script setup lang="ts">
  useSeoMeta({
    title: 'pdfcn-vue · Vue components for PDFs',
    description:
      'Install Vue components and document templates from the registry. Render PDFs in Vue or Nuxt with Forme.',
  });
</script>

<template>
  <main
    id="main-content"
    class="site-width mx-auto w-[min(100%_-_80px,_1440px)] max-[760px]:w-[calc(100%_-_32px)]"
  >
    <LandingHero />
    <LandingPlayground />
    <LandingLibrary />
    <LandingWorkflow />
    <LandingAcknowledgement />
  </main>
</template>
