<script setup lang="ts">
  import { ArrowDownIcon, ArrowUpRightIcon } from '@lucide/vue';
  import { motion, useReducedMotion } from 'motion-v';
  import DocumentSpecimen from '@/components/landing/DocumentSpecimen.vue';
  import { blockDocs } from '@/data/blocks';
  import { componentDocs } from '@/data/components';

  const reducedMotion = useReducedMotion();
</script>

<template>
  <section class="hero pt-6">
    <div
      class="hero-grid grid grid-cols-[minmax(0,_1.12fr)_minmax(0,_1fr)] items-stretch gap-12 px-0 pt-12 pb-16 max-[1100px]:gap-6 max-[760px]:grid-cols-1 max-[760px]:gap-10 max-[760px]:px-0 max-[760px]:pt-8 max-[760px]:pb-10 min-[1450px]:gap-16"
    >
      <div class="hero-copy self-center [&_h1]:mb-7">
        <motion.h1
          :initial="{ opacity: 0, transform: reducedMotion ? 'none' : 'translateY(12px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ duration: 0.3 }"
          class="editorial-title text-[clamp(3.6rem,_7.5vw,_7.5rem)] leading-[0.94] font-semibold tracking-[-0.04em] max-[760px]:text-[clamp(3.1rem,_16vw,_6rem)]"
          >PDFs,<br />built<br />
          <span
            class="highlight-word relative isolate [&::before]:absolute [&::before]:-right-2 [&::before]:bottom-[3px] [&::before]:left-[-5px] [&::before]:z-[-1] [&::before]:h-[20%] [&::before]:opacity-[0.36] [&::before]:content-[''] [&::before]:[background:var(--muted-foreground)]"
            >with Vue<span class="highlight-dot text-foreground">.</span></span
          ></motion.h1
        >

        <p
          class="hero-description text-[22px] leading-[1.35] tracking-[-0.035em] max-[760px]:text-[21px]"
        >
          Write a Vue component.<br class="desktop-break" />
          Get a PDF from it.
        </p>
        <p class="hero-detail mt-4 max-w-[355px] text-[14px] leading-[1.7] text-muted-foreground">
          Install document components as source files. Fill them with your data, render with Forme,
          and edit the result in your own project.
        </p>

        <div class="hero-actions mt-7 flex gap-3 max-[400px]:flex-col">
          <NuxtLink
            class="action-link action-link-primary inline-flex min-h-12 items-center justify-between gap-6 border border-foreground bg-foreground px-5 py-3 text-[13px] font-medium text-background transition-colors duration-160 [&:hover]:bg-accent [&:hover]:text-accent-foreground"
            to="/docs/installation"
            >Read the installation guide<ArrowUpRightIcon :size="17"
          /></NuxtLink>
          <a
            class="action-link inline-flex min-h-12 items-center justify-between gap-6 border border-foreground px-5 py-3 text-[13px] font-medium transition-colors duration-160 [&:hover]:bg-accent [&:hover]:text-accent-foreground"
            href="#playground"
            >See a PDF example<ArrowDownIcon :size="16"
          /></a>
        </div>

        <div
          class="hero-footnote eyebrow mt-7 flex gap-5 font-mono text-[8px] leading-[1.6] tracking-[0.12em] text-muted-foreground uppercase max-[1100px]:flex-wrap max-[1100px]:gap-2.5"
        >
          <span>Vue 3 + Nuxt</span><span>Powered by Forme</span
          ><span>Distributed via shadcn-vue</span>
        </div>
      </div>

      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 0.35, delay: 0.12 }"
        class="hero-specimen border border-border bg-muted max-[760px]:w-full max-[760px]:max-w-135"
      >
        <div
          class="specimen-top eyebrow flex items-center justify-between border-b border-border px-4 py-3 font-mono text-[8px] leading-[1.6] tracking-[0.12em] uppercase"
        >
          <span>FIG. 01 / SAMPLE DOCUMENT</span><ArrowUpRightIcon :size="16" />
        </div>
        <div
          class="hero-paper-wrap [background-image:linear-gradient(var(--border)_1px,_transparent_1px),_linear-gradient(90deg,_var(--border)_1px,_transparent_1px)] bg-size-[24px_24px] px-12 py-8.5 max-[1100px]:p-6 max-[760px]:px-10 max-[760px]:py-6 max-[400px]:p-6"
        >
          <DocumentSpecimen />
        </div>
        <div
          class="specimen-bottom eyebrow flex items-center justify-between border-t border-border px-4 py-3 font-mono text-[8px] leading-[1.6] tracking-[0.12em] uppercase"
        >
          <span>Synthetic invoice / illustrative values</span><span>A4 / 210 × 297</span>
        </div>
      </motion.div>
    </div>

    <div
      class="hero-index grid grid-cols-[1fr_1fr_1fr_1fr_0.8fr] border-t border-b border-border max-[760px]:grid-cols-3 [&_>_*]:border-r [&_>_*]:border-border [&_>_*]:px-6 [&_>_*]:py-5.5 max-[760px]:[&_>_*]:px-3 max-[760px]:[&_>_*]:py-4.5 [&_>_:first-child]:self-center [&_>_:first-child]:pl-0 [&_>_:last-child]:self-center [&_>_:last-child]:border-r-0 [&_>_:last-child]:pr-0 [&_>_:last-child]:text-right max-[760px]:[&_>_p]:hidden [&_a]:flex [&_a]:items-baseline [&_a]:gap-3.5 max-[1100px]:[&_a]:flex-col max-[1100px]:[&_a]:gap-1.5 [&_a_span]:flex [&_a_span]:items-center [&_a_span]:gap-2 [&_a_span]:text-[10px] max-[760px]:[&_a_span]:text-[9px] [&_a:hover]:bg-accent [&_a:hover]:text-accent-foreground [&_strong]:text-[30px] [&_strong]:font-medium [&_strong]:tracking-[-0.04em]"
    >
      <p class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase">
        In this registry
      </p>
      <NuxtLink to="/docs/components"
        ><strong>{{ componentDocs.length.toString().padStart(2, '0') }}</strong
        ><span>PDF components<ArrowUpRightIcon :size="14" /></span
      ></NuxtLink>
      <NuxtLink to="/docs/blocks"
        ><strong>{{ blockDocs.length.toString().padStart(2, '0') }}</strong
        ><span>Document blocks<ArrowUpRightIcon :size="14" /></span
      ></NuxtLink>
      <NuxtLink to="/theme-builder"
        ><strong>09</strong><span>Theme presets<ArrowUpRightIcon :size="14" /></span
      ></NuxtLink>
      <span
        class="index-end eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase max-[760px]:hidden"
        >Vue source files<br />in your repo</span
      >
    </div>
  </section>
</template>
