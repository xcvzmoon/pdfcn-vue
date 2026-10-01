<script setup lang="ts">
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import formCode from '../../../../../packages/registry/examples/FillableFormDocument.vue?raw';

  definePageMeta({ layout: 'docs' });
  useSeoMeta({
    title: 'Fillable forms · pdfcn-vue',
    description: 'Create interactive PDF fields and flatten their values with Forme in Vue.',
  });
  const renderCode = [
    "import { renderDocument } from '@formepdf/vue'",
    "import FillableFormDocument from '@/components/pdf/FillableFormDocument.vue'",
    '',
    "const props = { fullName: 'Grace Hopper' }",
    'const editablePdf = await renderDocument(FillableFormDocument, { props })',
    'const staticPdf = await renderDocument(FillableFormDocument, {',
    '  props,',
    '  flattenForms: true,',
    '})',
  ].join('\n');
  const browserCode = [
    "import { serialize } from '@formepdf/vue'",
    "import { init, renderSerializedDoc } from '@formepdf/core/worker'",
    "import wasmUrl from '@formepdf/core/pkg-web/forme_bg.wasm?url'",
    "import FillableFormDocument from '@/components/pdf/FillableFormDocument.vue'",
    '',
    'await init(wasmUrl)',
    "const document = await serialize(FillableFormDocument, { props: { fullName: 'Grace Hopper' } })",
    'const staticPdf = await renderSerializedDoc(document, { flattenForms: true })',
  ].join('\n');
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-3">
      <h1>Fillable forms</h1>
      <p class="max-w-2xl text-muted-foreground">
        Forme's TextField, Checkbox, Dropdown, and RadioButton create interactive AcroForm fields.
        Use them when the recipient needs to edit the PDF in a compatible viewer.
      </p>
    </header>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Create a document with fields</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        Give each field a stable name. Radio buttons share a name for their group and use distinct
        values. Values supplied by Vue are initial PDF values; these components do not bind edits
        made later in a PDF viewer back to Vue. Keep visible labels beside fields.
      </p>
      <CodeBlock
        :code="formCode"
        language="vue"
        title="FillableFormDocument.vue"
      />
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Render editable or flattened output</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        On the server, renderDocument forwards flattenForms to the core renderer. The default output
        keeps fields interactive. With flattenForms: true, Forme paints the supplied field values
        into page content and removes interactive widgets. This renders your source values; it does
        not load or flatten a PDF that a recipient has already edited.
      </p>
      <CodeBlock
        :code="renderCode"
        language="ts"
        title="Server rendering"
      />
      <CodeBlock
        :code="browserCode"
        language="ts"
        title="Browser rendering"
      />
    </section>
    <section class="flex flex-col gap-3">
      <h2 class="text-xl font-semibold">Choose the right kind of form</h2>
      <p class="text-sm leading-7 text-muted-foreground">
        pdfcn-vue's PdfForm and the medical intake block lay out static labels and values. They do
        not create interactive fields. Use the Forme primitives above for editable output. A
        readOnly field still exists as a widget; flattenForms removes widgets from the generated
        PDF.
      </p>
      <p class="text-sm leading-7 text-muted-foreground">
        Test editing and saving in the viewers your recipients use. Browser PDF previews differ in
        field support. For archival or accessible output, also follow the
        <NuxtLink
          class="underline"
          to="/docs/pdf-standards"
          >PDF standards guide</NuxtLink
        >.
      </p>
    </section>
  </div>
</template>
