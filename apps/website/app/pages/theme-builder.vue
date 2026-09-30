<script setup lang="ts">
  import ThemeBuilder from '@/components/theme-builder/ThemeBuilder.vue';

  useSeoMeta({
    title: 'Theme builder · pdfcn-vue',
    description:
      'Customize PDF colors, typography, page size, and spacing. Preview your theme live and export a typed TypeScript theme.',
  });
</script>

<template>
  <main
    id="main-content"
    class="site-width mx-auto w-[min(100%_-_80px,_1440px)] max-[760px]:w-[calc(100%_-_32px)]"
  >
    <header
      class="builder-page-heading flex items-end justify-between gap-8 px-0 pt-12 pb-10 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-6 max-[760px]:pt-8 [&_>_p]:pb-[5px] [&_>_p]:text-[13px] [&_>_p]:leading-[1.8] [&_>_p]:text-muted-foreground [&_h1]:text-[clamp(3rem,_5vw,_5rem)]"
    >
      <div>
        <h1
          class="section-title text-[clamp(2.5rem,_5vw,_5rem)] leading-[1.02] font-medium tracking-[-0.04em]"
        >
          Build a PDF theme.
        </h1>
      </div>
      <p>
        Pick a preset, change its tokens, and check the rendered PDF. Export the result as
        TypeScript.
      </p>
    </header>
    <ThemeBuilder />
  </main>
</template>
