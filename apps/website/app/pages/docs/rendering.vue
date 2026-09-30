<script setup lang="ts">
  import CodeBlock from '@/components/docs/CodeBlock.vue';

  definePageMeta({ layout: 'docs' });
  useSeoMeta({
    title: 'Rendering PDFs · pdfcn-vue',
    description: 'Render Vue PDF documents with Forme in the browser or on a Nuxt server.',
  });
  const browserCode = [
    "import { serialize } from '@formepdf/vue'",
    "import { init, renderSerializedDoc } from '@formepdf/core/worker'",
    "import wasmUrl from '@formepdf/core/pkg-web/forme_bg.wasm?url'",
    "import InvoiceMinimal from '@/components/pdf/blocks/invoice-minimal/InvoiceMinimal.vue'",
    '',
    'await init(wasmUrl)',
    '',
    'async function createInvoicePreview(): Promise<{ url: string; dispose: () => void }> {',
    '  const serialized = await serialize(InvoiceMinimal)',
    '  const bytes = await renderSerializedDoc(serialized)',
    "  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })",
    '  const url = URL.createObjectURL(blob)',
    '',
    '  return { url, dispose: () => URL.revokeObjectURL(url) }',
    '}',
    '',
    'const preview = await createInvoicePreview()',
    '// Bind preview.url to a preview or download link.',
    '// Call preview.dispose() when replacing it or leaving the view.',
  ].join('\n');
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-3">
      <h1>Rendering PDFs</h1>
      <p class="max-w-2xl text-muted-foreground">
        Forme serializes your Vue document and renders it into PDF bytes. Choose browser rendering
        for local previews, or server rendering for an API response.
      </p>
    </header>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">A document, not a DOM screenshot</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Use Forme's Document and Page primitives with pdfcn-vue components. Forme lays out its own
        document tree. Website CSS and HTML elements do not become PDF styles; use component props
        and theme tokens.
      </p>
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Render in the browser</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Initialize the browser WASM renderer once, serialize your document, and render the result.
        In Nuxt, call this from a client event or onMounted. Keep the blob URL alive while the PDF
        is displayed.
      </p>
      <CodeBlock
        :code="browserCode"
        language="ts"
        title="Browser rendering with Vite"
      />
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Render on the server</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Use the Node build of @formepdf/core in a server route. Send the PDF with the
        application/pdf content type. The
        <NuxtLink
          class="underline"
          to="/docs/nuxt"
          >Nuxt integration guide</NuxtLink
        >
        includes an endpoint example.
      </p>
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Handle failures and resources</h2>
      <ul class="list-disc pl-5 text-sm leading-7 text-muted-foreground">
        <li>Show a loading state while fonts, WASM, and the document render.</li>
        <li>Catch renderer failures and offer an explicit retry.</li>
        <li>Revoke object URLs on replacement and unmount.</li>
        <li>
          Keep custom fonts available to the renderer. CSS font imports only affect the website.
        </li>
        <li>For frequent edits, debounce updates and discard outdated render results.</li>
      </ul>
    </section>
  </div>
</template>
