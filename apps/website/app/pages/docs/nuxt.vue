<script setup lang="ts">
  import CodeBlock from '@/components/docs/CodeBlock.vue';

  definePageMeta({ layout: 'docs' });
  useSeoMeta({
    title: 'Nuxt integration · pdfcn-vue',
    description:
      'Configure Nuxt for Forme and render PDF documents in client previews or server endpoints.',
  });
  const configCode = `export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('forme-'),
    },
  },
})`;
  const clientCode = [
    '<script setup lang="ts">',
    "import InvoiceMinimal from '@/components/pdf/blocks/invoice-minimal/InvoiceMinimal.vue'",
    "import { onBeforeUnmount, onMounted, ref } from 'vue'",
    '',
    'const pdfUrl = ref<string | null>(null)',
    'const error = ref<string | null>(null)',
    'let disposed = false',
    '',
    'onMounted(async () => {',
    '  try {',
    '    const [{ serialize }, { init, renderSerializedDoc }, { default: wasmUrl }]',
    '      = await Promise.all([',
    "        import('@formepdf/vue'),",
    "        import('@formepdf/core/worker'),",
    "        import('@formepdf/core/pkg-web/forme_bg.wasm?url'),",
    '      ])',
    '    await init(wasmUrl)',
    '    const document = await serialize(InvoiceMinimal)',
    '    const bytes = await renderSerializedDoc(document)',
    '    if (disposed) return',
    "    pdfUrl.value = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }))",
    '  } catch {',
    "    if (!disposed) error.value = 'The PDF could not be rendered.'",
    '  }',
    '})',
    '',
    'onBeforeUnmount(() => {',
    '  disposed = true',
    '  if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value)',
    '})',
    '\u003c/script>',
    '',
    '<template>',
    '  <p v-if="error" role="alert">{{ error }}</p>',
    '  <a v-else-if="pdfUrl" :href="pdfUrl" download="invoice.pdf">Download invoice</a>',
    '  <p v-else role="status">Rendering PDF…</p>',
    '</template>',
  ].join('\n');
  const serverCode = `import { renderSerializedDoc } from '@formepdf/core'
import { serialize } from '@formepdf/vue'
import InvoiceMinimal from '../../app/components/pdf/blocks/invoice-minimal/InvoiceMinimal.vue'

export default defineEventHandler(async (event) => {
  const document = await serialize(InvoiceMinimal)
  const bytes = await renderSerializedDoc(document)

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', 'attachment; filename="invoice.pdf"')
  return bytes
})`;
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-3">
      <h1>Nuxt integration</h1>
      <p class="max-w-2xl text-muted-foreground">
        Use the same document components in a client preview or a server endpoint. Keep browser-only
        rendering behind a client boundary.
      </p>
    </header>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Configure the Vue compiler</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Forme components emit custom document elements. Tell the compiler that forme-* tags are
        custom elements.
      </p>
      <CodeBlock
        :code="configCode"
        language="ts"
        title="nuxt.config.ts"
      />
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Create a client preview</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Wrap the preview in ClientOnly or put it in a .client.vue component. Import the browser
        renderer inside a client lifecycle hook so WASM initialization never runs during SSR. The
        <NuxtLink
          class="underline"
          to="/docs/rendering"
          >rendering guide</NuxtLink
        >
        shows how to create the PDF bytes.
      </p>
      <CodeBlock
        :code="clientCode"
        language="vue"
        title="components/PdfPreview.client.vue"
      />
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Return a PDF from an API route</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        This example targets a Node deployment with the Forme renderer installed. Edge runtimes need
        their own WASM setup. Validate incoming invoice data at the request boundary before passing
        it to your document.
      </p>
      <CodeBlock
        :code="serverCode"
        language="ts"
        title="server/api/invoice.get.ts"
      />
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Keep themes separate from site styles</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Nuxt color mode controls your website. A PdfcnTheme controls your PDF. Export a theme from
        the
        <NuxtLink
          class="underline"
          to="/theme-builder"
          >theme builder</NuxtLink
        >
        and pass it to a block or PdfcnThemeProvider.
      </p>
    </section>
  </div>
</template>
