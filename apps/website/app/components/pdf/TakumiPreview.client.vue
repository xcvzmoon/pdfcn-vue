<script setup lang="ts">
  import { h, onUnmounted, ref } from 'vue';
  import { Button } from '@/components/ui/button';
  import TakumiDocument from '../../../../../packages/registry/examples/TakumiDocument.vue';
  import PdfCanvasPreview from './PdfCanvasPreview.client.vue';

  const status = ref<'idle' | 'rendering' | 'ready' | 'error'>('idle');
  const pdfUrl = ref<string>('');
  let disposed = false;

  async function renderPreview(): Promise<void> {
    status.value = 'rendering';
    try {
      const [{ default: init }, { default: wasmUrl }, { renderTakumi }] = await Promise.all([
        import('takumi-pdf/no-init'),
        import('takumi-pdf/takumi_pdf_wasm_bg.wasm?url'),
        import('#registry/takumi/index'),
      ]);
      await init({ module_or_path: wasmUrl });
      const bytes = await renderTakumi(h(TakumiDocument, { recipient: 'Vue browser preview' }), {
        size: 'letter',
        margin: 48,
      });
      if (disposed) return;
      if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value);
      pdfUrl.value = URL.createObjectURL(
        new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
      );
      status.value = 'ready';
    } catch (error) {
      if (disposed) return;
      console.error('TAKUMI_PREVIEW_FAILED', error);
      status.value = 'error';
    }
  }

  onUnmounted(() => {
    disposed = true;
    if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value);
  });
</script>

<template>
  <div class="flex flex-col gap-4 rounded-lg border p-4">
    <div class="flex items-center gap-4">
      <Button
        :disabled="status === 'rendering'"
        @click="renderPreview"
      >
        {{ status === 'rendering' ? 'Rendering…' : 'Render with Takumi' }}
      </Button>
      <a
        v-if="pdfUrl"
        :href="pdfUrl"
        class="text-sm underline"
        download="takumi-example.pdf"
        >Download PDF</a
      >
    </div>
    <p
      v-if="status === 'error'"
      class="text-sm text-destructive"
      role="alert"
    >
      The PDF could not be rendered. Try again.
    </p>
    <p
      v-else-if="status === 'rendering'"
      class="text-sm text-muted-foreground"
      role="status"
    >
      Loading the renderer and creating the document.
    </p>
    <PdfCanvasPreview
      v-if="status === 'ready' && pdfUrl"
      :url="pdfUrl"
      renderer="Takumi"
    />
  </div>
</template>
