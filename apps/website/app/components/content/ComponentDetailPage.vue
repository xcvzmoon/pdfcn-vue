<script setup lang="ts">
  import type { ComponentDoc } from '@/data/components';
  import { computed } from 'vue';
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import CopyButton from '@/components/docs/CopyButton.vue';
  import PropsTable from '@/components/docs/PropsTable.vue';
  import LivePdfPreview from '@/components/pdf/LivePdfPreview.vue';
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Separator } from '@/components/ui/separator';
  import { findComponentDoc } from '@/data/components';
  import { ComponentGalleryDocument } from '@/lib/block-runtime';

  const route = useRoute();
  const doc = computed<ComponentDoc | undefined>(() => findComponentDoc(String(route.params.slug)));

  const installCommand = computed<string>(() =>
    doc.value ? `npx shadcn-vue@latest add @pdfcn-vue/${doc.value.install}` : '',
  );

  const importSnippet = computed<string>(() => {
    if (!doc.value) return '';
    return `import ${doc.value.importName} from '@/components/pdf/${doc.value.importName}.vue'`;
  });
</script>

<template>
  <div
    v-if="doc"
    class="flex flex-col gap-8"
  >
    <header class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{{ doc.category }}</Badge>
        <code class="font-mono text-xs text-muted-foreground">@pdfcn-vue/{{ doc.install }}</code>
      </div>

      <h1
        class="doc-title"
        data-toc-id="overview"
        data-toc-title="Overview"
        data-toc-level="2"
      >
        {{ doc.title }}
      </h1>

      <p class="max-w-2xl text-muted-foreground">
        {{ doc.description }}
      </p>

      <div class="flex flex-wrap gap-2">
        <CopyButton
          :code="installCommand"
          :copy-key="`install-${doc.install}`"
          label="Copy install"
        />

        <CopyButton
          :code="importSnippet"
          :copy-key="`import-${doc.install}`"
          label="Copy import"
        />
      </div>
    </header>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="installation"
        data-toc-title="Installation"
        data-toc-level="2"
      >
        Installation
      </h2>

      <CodeBlock
        :code="installCommand"
        language="bash"
        title="Terminal"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="usage"
        data-toc-title="Usage"
        data-toc-level="2"
      >
        Usage
      </h2>

      <CodeBlock
        :code="doc.usage"
        language="vue"
        title="Example"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="props"
        data-toc-title="Props"
        data-toc-level="2"
      >
        Props
      </h2>

      <PropsTable
        v-if="doc.props.length"
        :rows="doc.props"
      />

      <p
        v-else
        class="text-sm text-muted-foreground"
      >
        This primitive takes no public props.
      </p>
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="preview"
        data-toc-title="Live preview"
        data-toc-level="2"
      >
        Live preview
      </h2>

      <p class="text-sm text-muted-foreground">
        The gallery uses a shared document. Change its theme in the theme builder to compare tokens.
      </p>

      <LivePdfPreview
        :document="ComponentGalleryDocument"
        :title="`${doc.title} in a document`"
        :download-name="`pdfcn-vue-${doc.slug}.pdf`"
        description="Rendered with Forme in your browser."
      />
    </section>

    <Separator />

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="sources"
        data-toc-title="Source files"
        data-toc-level="2"
      >
        Source files
      </h2>

      <Card>
        <CardHeader>
          <CardTitle class="text-base">Registry paths</CardTitle>
          <CardDescription>
            Files installed under
            <code class="font-mono text-xs text-foreground">components/pdf</code>.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ul class="flex flex-col gap-1 font-mono text-xs text-muted-foreground">
            <li
              v-for="path in doc.sourcePaths"
              :key="path"
            >
              {{ path }}
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>

    <Alert>
      <AlertTitle>Need the full template?</AlertTitle>
      <AlertDescription>
        See
        <NuxtLink
          class="font-medium text-foreground underline-offset-4 hover:underline"
          to="/docs/blocks"
        >
          blocks
        </NuxtLink>
        for invoices and reports composed from these primitives.
      </AlertDescription>
    </Alert>
  </div>

  <div
    v-else
    class="flex flex-col gap-4"
  >
    <Alert variant="destructive">
      <AlertTitle>Component not found</AlertTitle>
      <AlertDescription>No component matches this slug.</AlertDescription>
    </Alert>

    <Button
      as-child
      class="w-fit"
    >
      <NuxtLink to="/docs/components">Back to components</NuxtLink>
    </Button>
  </div>
</template>
