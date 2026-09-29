<script setup lang="ts">
import PdfSmokePreview from '@/components/pdf/PdfSmokePreview.vue';
</script>

<template>
  <div class="min-h-screen bg-background text-foreground antialiased">
    <header class="border-b border-border/70">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span class="text-sm font-semibold tracking-tight">pdfcn-vue</span>
        <span class="text-xs font-medium text-muted-foreground">Foundation / 01</span>
      </div>
    </header>

    <main class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:py-16">
      <div class="max-w-2xl space-y-4">
        <p class="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          PDF render proof
        </p>
        <h1 class="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Vue to PDF, end to end.
        </h1>
        <p class="max-w-xl text-base leading-7 text-muted-foreground text-pretty">
          A single Vue document rendered by Forme in the browser. The same source is checked in
          Node.
        </p>
      </div>

      <PdfSmokePreview />
    </main>
  </div>
</template>
