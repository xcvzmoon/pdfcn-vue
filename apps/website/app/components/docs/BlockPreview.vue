<script setup lang="ts">
  import type { Component } from 'vue';
  import type { BlockSample } from '@/lib/block-runtime';
  import { onBeforeUnmount, shallowRef, watch } from 'vue';
  import BlockPreviewDocument from '@/components/pdf/demos/BlockPreviewDocument.vue';
  import LivePdfPreview from '@/components/pdf/LivePdfPreview.vue';
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
  import { Spinner } from '@/components/ui/spinner';
  import { useBlockRuntime } from '@/lib/block-runtime';

  type BlockPreviewRuntime = {
    component: Component;
    sample: BlockSample;
  };

  const props = defineProps<{
    slug: string;
    componentName: string;
    sampleExport: string;
    downloadName: string;
  }>();

  const { loadBlock, loading, loadError } = useBlockRuntime();
  const runtime = shallowRef<BlockPreviewRuntime | null>(null);
  const renderKey = shallowRef<number>(0);

  async function hydrate(): Promise<void> {
    runtime.value = null;
    const next = await loadBlock(props.slug, props.componentName, props.sampleExport);
    if (!next) return;
    runtime.value = {
      component: next.component,
      sample: { ...next.sample },
    };
    renderKey.value += 1;
  }

  watch(
    () => [props.slug, props.componentName, props.sampleExport] as const,
    () => {
      void hydrate();
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    runtime.value = null;
  });
</script>

<template>
  <div class="flex flex-col gap-4">
    <Alert
      v-if="loadError"
      variant="destructive"
    >
      <AlertTitle>Block preview unavailable</AlertTitle>
      <AlertDescription>{{ loadError }}</AlertDescription>
    </Alert>

    <div
      v-if="loading && !runtime"
      class="flex min-h-[28rem] flex-col items-center justify-center gap-3 rounded-lg border border-border/70 text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <Spinner class="size-5" />
      <p class="text-sm">Loading block sample…</p>
    </div>

    <LivePdfPreview
      v-if="runtime"
      :key="renderKey"
      :document="BlockPreviewDocument"
      :document-props="{
        block: runtime.component,
        data: runtime.sample,
      }"
      :title="downloadName"
      description="Sample data rendered through the registry block."
      :download-name="`${downloadName}.pdf`"
    />
  </div>
</template>
