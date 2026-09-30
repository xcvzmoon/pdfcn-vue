<script setup lang="ts">
  import type { Component } from 'vue';
  import type { PdfDocumentProps } from '@/composables/usePdfPreview';
  import { DownloadIcon, FileTextIcon, RotateCwIcon } from '@lucide/vue';
  import { useDebounceFn } from '@vueuse/core';
  import { onMounted, watch } from 'vue';
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { Spinner } from '@/components/ui/spinner';
  import { usePdfPreview } from '@/composables/usePdfPreview';
  import PdfCanvasPreview from './PdfCanvasPreview.client.vue';

  const props = withDefaults(
    defineProps<{
      document: Component;
      documentProps?: PdfDocumentProps;
      title?: string;
      description?: string;
      downloadName?: string;
      autoRender?: boolean;
    }>(),
    {
      documentProps: () => ({}),
      title: 'Live PDF preview',
      description: 'Rendered in the browser with Forme.',
      downloadName: 'pdfcn-vue-preview.pdf',
      autoRender: true,
    },
  );

  const { status, pdfUrl, statusLabel, render, renderAgain } = usePdfPreview();

  async function startRender(): Promise<void> {
    await render(props.document, props.documentProps);
  }

  const renderDebounced = useDebounceFn(startRender, 180);

  watch(
    () => [props.document, props.documentProps, props.autoRender] as const,
    () => {
      if (props.autoRender) void renderDebounced();
    },
    { deep: true },
  );
  onMounted(() => {
    if (props.autoRender) void startRender();
  });
</script>

<template>
  <Card class="overflow-hidden">
    <CardHeader class="gap-1 border-b border-border/70 pb-5">
      <CardTitle class="flex items-center gap-2 text-base">
        <FileTextIcon class="size-4 text-muted-foreground" />
        {{ title }}
      </CardTitle>
      <CardDescription>{{ description }}</CardDescription>
      <CardAction>
        <Badge variant="secondary">Browser render</Badge>
      </CardAction>
    </CardHeader>

    <CardContent class="p-0">
      <div class="min-h-[28rem] bg-muted/40 p-4 sm:p-6">
        <ClientOnly v-if="status === 'ready' && pdfUrl">
          <PdfCanvasPreview :url="pdfUrl" />
        </ClientOnly>

        <div
          v-else-if="status === 'rendering' || status === 'idle'"
          class="flex min-h-[28rem] flex-col items-center justify-center gap-3 text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <Spinner class="size-5" />
          <p class="text-sm">Rendering the PDF…</p>
        </div>

        <div
          v-else
          class="flex min-h-[28rem] items-center justify-center"
        >
          <Alert
            variant="destructive"
            class="max-w-md"
          >
            <AlertTitle>PDF render failed</AlertTitle>
            <AlertDescription>Try rendering the document again.</AlertDescription>
          </Alert>
        </div>
      </div>
    </CardContent>

    <CardFooter class="flex flex-wrap justify-between gap-3">
      <p
        class="text-xs text-muted-foreground tabular-nums"
        aria-live="polite"
      >
        {{ statusLabel }}
      </p>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          :disabled="status === 'rendering'"
          @click="renderAgain"
        >
          <Spinner v-if="status === 'rendering'" />
          <RotateCwIcon
            v-else
            data-icon="inline-start"
          />
          Render again
        </Button>
        <Button
          v-if="status === 'ready' && pdfUrl"
          as-child
        >
          <a
            :href="pdfUrl"
            :download="downloadName"
          >
            <DownloadIcon data-icon="inline-start" />
            Download PDF
          </a>
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
