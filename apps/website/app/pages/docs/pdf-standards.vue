<script setup lang="ts">
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import standardsCode from '../../../../../packages/registry/examples/StandardsDocument.vue?raw';

  definePageMeta({ layout: 'docs' });
  useSeoMeta({
    title: 'PDF standards · pdfcn-vue',
    description: 'Pass PDF/UA and PDF/A claims through Forme and validate the generated documents.',
  });
  const fontCode = [
    "import { readFile } from 'node:fs/promises'",
    "import { Font, renderDocumentWithLayout } from '@formepdf/vue'",
    "import StandardsDocument from '@/components/pdf/StandardsDocument.vue'",
    '',
    "Font.register({ family: 'Helvetica', src: new Uint8Array(await readFile('./fonts/LiberationSans-Regular.ttf')) })",
    "Font.register({ family: 'Helvetica', fontWeight: 700, src: new Uint8Array(await readFile('./fonts/LiberationSans-Bold.ttf')) })",
    '',
    'const result = await renderDocumentWithLayout(StandardsDocument, {',
    "  props: { pdfUa: true, pdfa: '2a', pdfVersion: '1.7' },",
    '})',
    'if (result.warnings.length > 0) {',
    "  throw new Error(`PDF_RENDER_WARNINGS: ${result.warnings.join('; ')}`)",
    '}',
    'const bytes = result.pdf',
  ].join('\n');
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-3">
      <h1>PDF standards</h1>
      <p class="max-w-2xl text-muted-foreground">
        Forme 0.25.0 exposes accessibility and archival claims on Document. pdfcn-vue uses Forme's
        document root directly, so these props pass through serialization to the renderer.
      </p>
    </header>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Choose a claim and PDF version</h2>
      <ul class="list-disc pl-5 text-sm leading-7 text-muted-foreground">
        <li>
          tagged enables a structure tree. Tagging alone does not establish PDF/UA conformance.
        </li>
        <li>pdfUa requests PDF/UA-1 on PDF 1.7. Set a title and document language.</li>
        <li>pdfa accepts 2a, 2b, 2u, 3a, 3b, and 3u on PDF 1.7.</li>
        <li>
          pdfUa2 requests PDF/UA-2 and implies PDF 2.0. pdfa="4" and pdfa="4f" also imply PDF 2.0
          and can be combined with pdfUa2. PDF/A-4 alone is an archival claim without an
          accessibility claim.
        </li>
        <li>
          Do not combine pdfUa with pdfUa2, or PDF 1.7 claims with pdfVersion="2.0". Forme rejects
          incompatible claims. Every font must be embedded for PDF 2.0 output.
        </li>
      </ul>
      <CodeBlock
        :code="standardsCode"
        language="vue"
        title="StandardsDocument.vue"
      />
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Embed fonts and inspect warnings</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Website CSS fonts are not PDF fonts. Supply embeddable font files for every family and
        weight used by the document. The server example below assumes you provide the named
        Liberation Sans files. Register them before serialization; register italic variants too if
        your document uses them. Choose fonts whose license permits embedding.
      </p>
      <CodeBlock
        :code="fontCode"
        language="ts"
        title="Server font registration and rendering"
      />
      <p class="text-sm leading-7 text-muted-foreground">
        Forme can emit PDF/UA-1 metadata while warning that a default font is unembedded.
        renderDocumentWithLayout returns those warnings. A PDF header, structure tree, or XMP
        conformance identifier proves that a feature was emitted, not that the whole file complies.
      </p>
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Validate the finished document</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Use semantic headings, logical reading order, meaningful link text, and appropriate table
        structure. Review image alternatives and form accessibility for your actual content.
        Decorative content must not interrupt the reading order. Inspect the generated structure and
        test it with assistive technology.
      </p>
      <p class="text-sm leading-7 text-muted-foreground">
        Run an external validator such as
        <a
          class="underline"
          href="https://verapdf.org/"
          target="_blank"
          rel="noreferrer"
          >veraPDF</a
        >
        against the exact profile required by your recipient. Automated validation and a manual
        accessibility review are separate checks. This library's render tests do not certify PDF/A
        or PDF/UA conformance. Consult the
        <a
          class="underline"
          href="https://docs.formepdf.com/"
          target="_blank"
          rel="noreferrer"
          >Forme documentation</a
        >
        for the engine's current capabilities.
      </p>
    </section>
  </div>
</template>
