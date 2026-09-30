<script setup lang="ts">
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import LivePdfPreview from '@/components/pdf/LivePdfPreview.vue';
  import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { ComponentGalleryDocument } from '@/lib/block-runtime';

  const themeTypeSnippet = `export type PdfcnTheme = {
  name: string;
  primitives: PrimitiveTokens;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  page: PageTokens;
};`;

  const providerUsage = [
    '<script setup lang="ts">',
    "import { Document } from '@formepdf/vue';",
    "import PdfcnThemeProvider from '@/components/pdf/PdfcnThemeProvider.vue';",
    "import { minimalTheme } from '@/lib/pdfcn/themes/minimal';",
    '\u003c/script>',
    '',
    '<template>',
    '  <PdfcnThemeProvider :theme="minimalTheme">',
    '    <Document>…</Document>',
    '  </PdfcnThemeProvider>',
    '</template>',
  ].join('\n');

  const tokens = [
    {
      title: 'primitives',
      description:
        'Typography scale, spacing units, font weights, line heights, radii, letter spacing.',
    },
    {
      title: 'colors',
      description: 'Semantic slots: foreground, background, primary, muted, border, status colors.',
    },
    {
      title: 'typography',
      description: 'Body and heading font families, sizes, and line heights for the document.',
    },
    {
      title: 'spacing',
      description: 'Page margins plus section, paragraph, and component gaps in points.',
    },
    {
      title: 'page',
      description: 'Page size (A4 / LETTER / LEGAL) and orientation.',
    },
  ];
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-3">
      <h1
        class="doc-title"
        data-toc-id="theming"
        data-toc-title="Theming"
        data-toc-level="2"
      >
        Theming
      </h1>
      <p class="max-w-2xl text-muted-foreground">
        Themes are plain TypeScript objects. PDF engines do not consume DOM CSS variables, so tokens
        stay in TypeScript and resolve inside each component.
      </p>
    </header>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="shape"
        data-toc-title="Theme shape"
        data-toc-level="2"
      >
        Theme shape
      </h2>
      <CodeBlock
        :code="themeTypeSnippet"
        language="ts"
        title="PdfcnTheme"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="tokens"
        data-toc-title="Token groups"
        data-toc-level="2"
      >
        Token groups
      </h2>
      <div class="grid gap-3 md:grid-cols-2">
        <Card
          v-for="token in tokens"
          :key="token.title"
        >
          <CardHeader>
            <CardTitle class="font-mono text-sm font-medium">{{ token.title }}</CardTitle>
            <CardDescription>{{ token.description }}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="provide"
        data-toc-title="Provide a theme"
        data-toc-level="2"
      >
        Provide a theme
      </h2>
      <p class="text-sm text-muted-foreground">
        Wrap the document with
        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
          >PdfcnThemeProvider</code
        >. Without a provider, components fall back to
        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
          >professionalTheme</code
        >.
      </p>
      <CodeBlock
        :code="providerUsage"
        language="vue"
        title="Theme provider"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="preview"
        data-toc-title="Theme in action"
        data-toc-level="2"
      >
        Theme in action
      </h2>
      <LivePdfPreview
        :document="ComponentGalleryDocument"
        title="Themed component gallery"
        description="Default professional theme applied through the provider."
        download-name="pdfcn-vue-theming.pdf"
      />
    </section>

    <section class="flex flex-col gap-3">
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Presets and builder</CardTitle>
          <CardDescription>
            Browse all nine presets and export a customized theme object on the
            <NuxtLink
              class="font-medium text-foreground underline-offset-4 hover:underline"
              to="/theme-builder"
            >
              theme builder</NuxtLink
            >
            page.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  </div>
</template>
