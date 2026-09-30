<script setup lang="ts">
  import type { BlockDoc } from '@/data/blocks';
  import { computed, shallowRef, watchEffect } from 'vue';
  import BlockPreview from '@/components/docs/BlockPreview.vue';
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import CopyButton from '@/components/docs/CopyButton.vue';
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { findBlockDoc } from '@/data/blocks';
  import { useBlockRuntime } from '@/lib/block-runtime';

  const route = useRoute();
  const doc = computed<BlockDoc | undefined>(() => findBlockDoc(String(route.params.slug)));
  const sampleJson = shallowRef<string>('');

  const installCommand = computed<string>(() =>
    doc.value ? `npx shadcn-vue@latest add @pdfcn-vue/${doc.value.install}` : '',
  );

  const usageCode = computed<string>(() => {
    if (!doc.value) return '';
    const name = doc.value.componentName;
    return [
      '<script setup lang="ts">',
      `import ${name} from '@/components/pdf/blocks/${doc.value.slug}/${name}.vue'`,
      `import { ${doc.value.sampleExport} } from '@/components/pdf/blocks/${doc.value.slug}/${doc.value.slug}.sample'`,
      '\u003c/script>',
      '',
      '<template>',
      `  <${name} :data="${doc.value.sampleExport}" />`,
      '</template>',
    ].join('\n');
  });

  watchEffect(async () => {
    if (!doc.value) {
      sampleJson.value = '';
      return;
    }
    const { loadBlock } = useBlockRuntime();
    const runtime = await loadBlock(
      doc.value.slug,
      doc.value.componentName,
      doc.value.sampleExport,
    );
    sampleJson.value = runtime ? JSON.stringify(runtime.sample, null, 2) : '';
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

      <p class="max-w-2xl text-muted-foreground">{{ doc.description }}</p>

      <CopyButton
        :code="installCommand"
        :copy-key="`install-${doc.install}`"
        label="Copy install command"
      />
    </header>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="preview"
        data-toc-title="Live preview"
        data-toc-level="2"
      >
        Live preview
      </h2>

      <BlockPreview
        :slug="doc.slug"
        :component-name="doc.componentName"
        :sample-export="doc.sampleExport"
        :download-name="doc.install"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="install"
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
        :code="usageCode"
        language="vue"
        title="Example"
      />
    </section>

    <section
      v-if="sampleJson"
      class="flex flex-col gap-3"
    >
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="sample-data"
        data-toc-title="Sample data"
        data-toc-level="2"
      >
        Sample data
      </h2>

      <CodeBlock
        :code="sampleJson"
        language="json"
        title="sample data"
      />
    </section>

    <Card>
      <CardHeader>
        <CardTitle class="text-base">Source</CardTitle>
        <CardDescription class="font-mono text-xs">{{ doc.sourcePath }}</CardDescription>
      </CardHeader>

      <CardContent class="text-sm text-muted-foreground">
        Blocks accept optional
        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">data</code>
        and
        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">theme</code>
        props. Omit them to use the bundled sample and default theme.
      </CardContent>
    </Card>
  </div>

  <div
    v-else
    class="flex flex-col gap-4"
  >
    <Alert variant="destructive">
      <AlertTitle>Block not found</AlertTitle>
      <AlertDescription>No block matches this slug.</AlertDescription>
    </Alert>

    <Button
      class="w-fit"
      as-child
    >
      <NuxtLink to="/docs/blocks">Back to blocks</NuxtLink>
    </Button>
  </div>
</template>
