import type { Component, ComputedRef, Ref } from 'vue';
import type { PdfcnTheme } from '#registry/types/pdf-themes';
import type { BlockSample } from '@/lib/block-runtime';
import { computed, onBeforeUnmount, ref, shallowRef } from 'vue';

export type PdfPreviewStatus = 'idle' | 'rendering' | 'ready' | 'error';
export type PdfDocumentProps = {
  theme?: PdfcnTheme;
  data?: BlockSample;
  title?: string;
  block?: Component;
  recipient?: string;
  componentName?: string;
  sampleExport?: string;
};

let wasmReady: Promise<void> | null = null;

async function ensureWasm(): Promise<void> {
  wasmReady ??= (async () => {
    const [{ init }, { default: wasmUrl }] = await Promise.all([
      import('@formepdf/core/worker'),
      import('@formepdf/core/pkg-web/forme_bg.wasm?url'),
    ]);
    await init(wasmUrl);
  })();
  try {
    await wasmReady;
  } catch (error) {
    wasmReady = null;
    throw error;
  }
}

type PdfPreviewState = {
  status: Ref<PdfPreviewStatus>;
  pdfUrl: Ref<string | null>;
  byteCount: Ref<number>;
  error: Ref<string | null>;
  statusLabel: ComputedRef<string>;
  render: (documentComponent: Component, props?: PdfDocumentProps) => Promise<void>;
  renderAgain: () => Promise<void>;
};

export function usePdfPreview(): PdfPreviewState {
  const status = ref<PdfPreviewStatus>('idle');
  const pdfUrl = ref<string | null>(null);
  const byteCount = ref<number>(0);
  const loadError = ref<string | null>(null);
  const activeComponent = shallowRef<Component | null>(null);
  const activeProps = shallowRef<PdfDocumentProps>({});
  let revision = 0;
  let unmounted = false;
  let running = false;

  const statusLabel = computed<string>(() => {
    if (status.value === 'rendering') return 'Rendering…';
    if (status.value === 'ready') return `${byteCount.value.toLocaleString()} PDF bytes`;
    if (status.value === 'error') return loadError.value ?? 'PDF_RENDER_FAILED';
    return 'Vue SFC → Uint8Array';
  });

  function revokeCurrent(): void {
    if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = null;
  }

  async function render(documentComponent: Component, props: PdfDocumentProps = {}): Promise<void> {
    activeComponent.value = documentComponent;
    activeProps.value = props;
    revision += 1;
    if (running || unmounted) return;
    running = true;
    status.value = 'rendering';
    loadError.value = null;
    const renderRevision = revision;
    try {
      const [{ serialize }, { renderSerializedDoc }] = await Promise.all([
        import('@formepdf/vue'),
        import('@formepdf/core/worker'),
      ]);
      await ensureWasm();
      const document = await serialize(documentComponent, { props });
      const bytes = await renderSerializedDoc({ ...document });
      if (unmounted || renderRevision !== revision) return;
      if (bytes.byteLength < 8 || new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') {
        throw new Error('PDF_INVALID_OUTPUT');
      }
      const nextUrl = URL.createObjectURL(
        new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
      );
      revokeCurrent();
      pdfUrl.value = nextUrl;
      byteCount.value = bytes.byteLength;
      status.value = 'ready';
    } catch (error) {
      if (unmounted) return;
      console.error('PDF_RENDER_FAILED', error);
      loadError.value = error instanceof Error ? error.message : 'PDF_RENDER_FAILED';
      status.value = 'error';
    } finally {
      running = false;
      if (!unmounted && renderRevision !== revision && activeComponent.value) {
        await render(activeComponent.value, activeProps.value);
      }
    }
  }

  async function renderAgain(): Promise<void> {
    if (activeComponent.value) await render(activeComponent.value, activeProps.value);
  }

  onBeforeUnmount(() => {
    unmounted = true;
    revokeCurrent();
  });

  return { status, pdfUrl, byteCount, error: loadError, statusLabel, render, renderAgain };
}
