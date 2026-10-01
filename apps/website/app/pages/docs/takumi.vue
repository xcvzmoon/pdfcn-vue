<script setup lang="ts">
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import TakumiPreview from '@/components/pdf/TakumiPreview.client.vue';
  import exampleSource from '../../../../../packages/registry/examples/TakumiDocument.vue?raw';

  const documentCode = exampleSource
    .replace("'../src/takumi/index.ts'", "'@/lib/pdfcn/takumi/index'")
    .replace("'../src/themes/minimal.ts'", "'@/lib/pdfcn/themes/minimal'");
  const serverCode = [
    "import 'takumi-pdf'",
    "import { h } from 'vue'",
    "import { renderTakumi } from '@/lib/pdfcn/takumi/index'",
    "import TakumiDocument from './TakumiDocument.vue'",
    '',
    "const bytes = await renderTakumi(h(TakumiDocument, { recipient: 'Vue server render' }), {",
    "  size: 'letter',",
    '  margin: 48,',
    '})',
  ].join('\n');
  const browserCode = [
    "import init from 'takumi-pdf/no-init'",
    "import wasmUrl from 'takumi-pdf/takumi_pdf_wasm_bg.wasm?url'",
    "import { h } from 'vue'",
    "import { renderTakumi } from '@/lib/pdfcn/takumi/index'",
    "import TakumiDocument from './TakumiDocument.vue'",
    '',
    'await init({ module_or_path: wasmUrl })',
    "const bytes = await renderTakumi(h(TakumiDocument, { recipient: 'Vue browser render' }))",
    "const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })",
  ].join('\n');
  definePageMeta({ layout: 'docs' });
  useSeoMeta({
    title: 'Takumi rendering · pdfcn-vue',
    description: 'Render themed Vue core components through the Takumi HTML-to-PDF engine.',
  });
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-3">
      <h1>Takumi rendering</h1>
      <p class="max-w-2xl text-muted-foreground">
        Use the optional Takumi base when you want to author PDF layouts with HTML and CSS. Vue
        renders the document to escaped HTML, then Takumi produces the PDF bytes.
      </p>
    </header>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Install the base</h2>
      <CodeBlock
        code="npx shadcn-vue@latest add @pdfcn-vue/takumi-core @pdfcn-vue/theme-minimal"
        language="bash"
      />
      <p class="text-sm leading-7 text-muted-foreground">
        Configure the @pdfcn-vue namespace as shown in the
        <NuxtLink
          to="/docs/installation"
          class="underline"
          >installation guide</NuxtLink
        >. The item installs Takumi, Vue's server renderer, HTML primitives, and the shared theme
        helpers.
      </p>
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Core component API</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Text, Heading, Stack, Section, Divider, PageBreak, KeepTogether, Link, and PdfList keep the
        Forme core components' props and slots. PdfcnThemeProvider and all nine theme presets work
        with both bases. Document and View render HTML containers; Image and Svg render images.
      </p>
      <p class="text-sm leading-7 text-muted-foreground">
        Use the Takumi entrypoint throughout a document. Forme's data components, document chrome,
        fillable fields, and block templates use Forme primitives and remain on the Forme path. For
        custom Takumi layouts, native HTML tables and CSS can sit alongside the core components.
      </p>
      <CodeBlock
        :code="documentCode"
        language="vue"
        title="TakumiDocument.vue"
      />
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Render on the server</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Import takumi-pdf once to initialize its Node WASM build. renderTakumi accepts a Vue VNode
        and Takumi's render options, and returns a Uint8Array. serializeTakumi returns HTML if you
        need to inspect the layout or use your own renderer instance.
      </p>
      <CodeBlock
        :code="serverCode"
        language="ts"
      />
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Render in the browser</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Initialize the no-init entrypoint with Vite's emitted WASM URL before rendering. Create and
        revoke blob URLs as described in the
        <NuxtLink
          to="/docs/rendering"
          class="underline"
          >rendering guide</NuxtLink
        >.
      </p>
      <CodeBlock
        :code="browserCode"
        language="ts"
      />
      <ClientOnly><TakumiPreview /></ClientOnly>
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Units and engine differences</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Core component dimensions and theme tokens stay in PDF points. The HTML bridge emits pt
        lengths, expands horizontal and vertical spacing, and preserves unitless font weights and
        line heights. Styles accept scalar values: numbers use points and CSS strings keep their
        units. Use separate edge properties for padding, margins, and borders instead of Forme edge
        objects or arrays. Takumi's render options use CSS pixels at 96 dpi: 48 px is 36 pt. Page
        geometry comes from render options, rather than a Forme Page component or CSS @page rules.
      </p>
      <p class="text-sm leading-7 text-muted-foreground">
        Register fonts through Takumi's fonts option or PdfRenderer. Forme's font registry does not
        configure Takumi. Supported CSS, pagination, and PDF features differ between engines; check
        the
        <a
          href="https://takumi.kane.tw/docs/pdf"
          class="underline"
          rel="noreferrer"
          target="_blank"
          >Takumi PDF documentation</a
        >
        for its current capabilities.
      </p>
    </section>
  </div>
</template>
