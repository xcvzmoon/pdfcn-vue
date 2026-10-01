<script setup lang="ts">
  import type { PDFDocumentLoadingTask } from 'pdfjs-dist';
  import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

  const props = withDefaults(defineProps<{ url: string; renderer?: 'Forme' | 'Takumi' }>(), {
    renderer: 'Forme',
  });
  const container = useTemplateRef<HTMLDivElement>('container');
  const status = ref<'loading' | 'ready' | 'error'>('loading');
  const pageCount = ref<number>(0);
  let loadingTask: PDFDocumentLoadingTask | null = null;
  let revision = 0;

  async function paint(): Promise<void> {
    const currentRevision = ++revision;
    const previous = loadingTask;
    loadingTask = null;
    if (previous) await previous.destroy();
    status.value = 'loading';
    try {
      const [{ getDocument, GlobalWorkerOptions }, { default: workerUrl }] = await Promise.all([
        import('pdfjs-dist'),
        import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
      ]);
      if (currentRevision !== revision) return;
      GlobalWorkerOptions.workerSrc = workerUrl;
      const task = getDocument({ url: props.url, useSystemFonts: true });
      loadingTask = task;
      const document = await task.promise;
      if (currentRevision !== revision || !container.value) return;
      const pages = await Promise.all(
        Array.from({ length: document.numPages }, (_entry, index) => document.getPage(index + 1)),
      );
      if (currentRevision !== revision || !container.value) return;
      container.value.replaceChildren();
      const canvases = pages.map((page, index) => {
        const canvas = window.document.createElement('canvas');
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.setAttribute('role', 'img');
        canvas.setAttribute(
          'aria-label',
          `PDF page ${index + 1} of ${document.numPages}. Download the PDF for selectable text.`,
        );
        canvas.className = 'pdf-page-canvas';
        return { canvas, viewport, page };
      });
      container.value.append(...canvases.map(({ canvas }) => canvas));
      await Promise.all(
        canvases.map(({ canvas, viewport, page }) => page.render({ canvas, viewport }).promise),
      );
      if (currentRevision !== revision) return;
      pageCount.value = document.numPages;
      status.value = 'ready';
    } catch (error) {
      if (currentRevision !== revision) return;
      console.error('PDF_PREVIEW_FAILED', error);
      status.value = 'error';
    }
  }

  watch(
    () => props.url,
    () => {
      void paint();
    },
  );
  onMounted(() => {
    void paint();
  });
  onBeforeUnmount(() => {
    revision += 1;
    if (loadingTask) void loadingTask.destroy();
  });
</script>

<template>
  <div class="pdf-canvas-preview w-full">
    <p
      v-if="status === 'loading'"
      class="pdf-canvas-status flex min-h-75 flex-col items-center justify-center gap-3 text-center text-[12px] text-muted-foreground [&_button]:underline [&_button]:underline-offset-[4px]"
      role="status"
    >
      Preparing the document preview…
    </p>
    <div
      v-if="status === 'error'"
      class="pdf-canvas-status flex min-h-75 flex-col items-center justify-center gap-3 text-center text-[12px] text-muted-foreground [&_button]:underline [&_button]:underline-offset-[4px]"
      role="alert"
    >
      <p>The page preview could not load. You can still download the PDF.</p>
      <button @click="paint">Retry preview</button>
    </div>
    <div
      ref="container"
      :class="{ 'is-loading': status === 'loading' }"
      class="pdf-canvas-pages flex flex-col items-center gap-6 [&_.pdf-page-canvas]:block [&_.pdf-page-canvas]:h-auto [&_.pdf-page-canvas]:w-[min(100%,_760px)] [&_.pdf-page-canvas]:border [&_.pdf-page-canvas]:border-border [&_.pdf-page-canvas]:bg-white [&_.pdf-page-canvas]:shadow-[3px_4px_0_rgb(0_0_0_/_0.07)] [&.is-loading]:opacity-[0.35]"
    />
    <p
      v-if="status === 'ready'"
      class="pdf-page-count eyebrow pt-4 text-center font-mono text-[8px] leading-[1.6] tracking-[0.12em] text-muted-foreground uppercase"
    >
      {{ pageCount }} {{ pageCount === 1 ? 'page' : 'pages' }} / {{ renderer }} output
    </p>
  </div>
</template>
