<script setup lang="ts">
  import { ArrowRightIcon, BoxesIcon, PaletteIcon, PuzzleIcon, TerminalIcon } from '@lucide/vue';
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import LivePdfPreview from '@/components/pdf/LivePdfPreview.vue';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { ComponentGalleryDocument } from '@/lib/block-runtime';

  const installCommand = 'npx shadcn-vue@latest add @pdfcn-vue/invoice-minimal';

  const features = [
    {
      title: 'shadcn-vue distribution',
      description: 'The CLI copies Vue source files into your app, where you can edit them.',
      icon: TerminalIcon,
    },
    {
      title: 'Forme PDF engine',
      description: 'Render Vue documents in the browser or from a Nuxt server route.',
      icon: BoxesIcon,
    },
    {
      title: 'Theme tokens',
      description: 'Nine presets cover colors, type, spacing, and page settings.',
      icon: PaletteIcon,
    },
    {
      title: '24 components · 20 blocks',
      description: 'Browse small PDF components or start with a complete document template.',
      icon: PuzzleIcon,
    },
  ];
</script>

<template>
  <div class="flex flex-col gap-10">
    <section class="flex flex-col gap-4">
      <Badge
        variant="secondary"
        class="w-fit"
      >
        Vue 3 · shadcn-vue · Forme
      </Badge>
      <h1 class="doc-title">Build PDFs with Vue components.</h1>
      <p class="max-w-2xl text-base leading-7 text-pretty text-muted-foreground">
        Install source files through the shadcn-vue registry. Use them in a Vue document and render
        the result with Forme.
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <Button
          size="lg"
          as-child
        >
          <NuxtLink to="/docs/installation">
            Get started
            <ArrowRightIcon data-icon="inline-end" />
          </NuxtLink>
        </Button>
        <Button
          variant="outline"
          size="lg"
          as-child
        >
          <NuxtLink to="/docs/blocks">Browse blocks</NuxtLink>
        </Button>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <p class="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Install</p>
      <CodeBlock
        :code="installCommand"
        language="bash"
        title="Terminal / after registry setup"
      />
      <NuxtLink
        class="text-sm underline underline-offset-4"
        to="/docs/registry"
      >
        Configure the registry
      </NuxtLink>
    </section>

    <section class="grid gap-4 md:grid-cols-2">
      <Card
        v-for="feature in features"
        :key="feature.title"
      >
        <CardHeader>
          <div class="mb-2 flex size-9 items-center justify-center rounded-md bg-muted">
            <component
              :is="feature.icon"
              class="size-4 text-foreground"
            />
          </div>
          <CardTitle class="text-base">{{ feature.title }}</CardTitle>
          <CardDescription>{{ feature.description }}</CardDescription>
        </CardHeader>
      </Card>
    </section>

    <section class="flex flex-col gap-4">
      <div>
        <h2
          class="text-xl font-semibold tracking-tight"
          data-toc-id="live-render"
          data-toc-title="Live render"
          data-toc-level="2"
        >
          Live render
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          This preview renders the gallery document in your browser with Forme.
        </p>
      </div>
      <LivePdfPreview
        :document="ComponentGalleryDocument"
        title="Component gallery"
        description="A rendered sample of text, data, and layout components."
        download-name="pdfcn-vue-gallery.pdf"
      />
    </section>
  </div>
</template>
