<script setup lang="ts">
import wasmUrl from '@formepdf/core/pkg-web/forme_bg.wasm?url';
import { renderSerializedDoc, init } from '@formepdf/core/worker';
import { serialize } from '@formepdf/vue';
import { DownloadIcon, FileTextIcon, RotateCwIcon } from '@lucide/vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
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
import SmokeDocument from '@/registry/forme/SmokeDocument.vue';

const status = ref<'idle' | 'rendering' | 'ready' | 'error'>('idle');
const pdfUrl = ref<string | null>(null);
const byteCount = ref(0);

async function renderPreview(): Promise<void> {
  if (status.value === 'rendering') return;

  status.value = 'rendering';

  try {
    const document = await serialize(SmokeDocument, { props: { recipient: 'Vue' } });
    await init(wasmUrl);
    const bytes = await renderSerializedDoc({ ...document });

    if (
      !(bytes instanceof Uint8Array) ||
      new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-'
    ) {
      throw new Error('PDF_INVALID_OUTPUT');
    }

    const nextUrl = URL.createObjectURL(
      new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
    );
    const previousUrl = pdfUrl.value;

    pdfUrl.value = nextUrl;
    byteCount.value = bytes.byteLength;
    status.value = 'ready';

    if (previousUrl) URL.revokeObjectURL(previousUrl);
  } catch (error) {
    console.error('PDF_RENDER_FAILED', error);
    status.value = 'error';
  }
}

onMounted(() => {
  void renderPreview();
});

onBeforeUnmount(() => {
  if (pdfUrl.value) URL.revokeObjectURL(pdfUrl.value);
});
</script>

<template>
  <Card class="overflow-hidden">
    <CardHeader class="gap-1 border-b border-border/70 pb-5">
      <CardTitle class="flex items-center gap-2 text-base">
        <FileTextIcon class="size-4 text-muted-foreground" />
        Document preview
      </CardTitle>
      <CardDescription>Document, Page, and Text composed in Vue.</CardDescription>
      <CardAction>
        <Badge variant="secondary">Browser render</Badge>
      </CardAction>
    </CardHeader>

    <CardContent class="p-0">
      <div class="min-h-[28rem] bg-muted/40 p-4 sm:p-6">
        <iframe
          v-if="status === 'ready' && pdfUrl"
          :src="pdfUrl"
          title="Rendered PDF preview"
          class="h-[38rem] w-full rounded-md bg-white shadow-sm ring-1 ring-foreground/10"
        />

        <div
          v-else-if="status === 'rendering' || status === 'idle'"
          class="flex min-h-[28rem] flex-col items-center justify-center gap-3 text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <Spinner class="size-5" />
          <p class="text-sm">Rendering the PDF…</p>
        </div>

        <div v-else class="flex min-h-[28rem] items-center justify-center">
          <Alert variant="destructive" class="max-w-md">
            <AlertTitle>PDF render failed</AlertTitle>
            <AlertDescription
              >PDF_RENDER_FAILED: Try rendering the document again.</AlertDescription
            >
          </Alert>
        </div>
      </div>
    </CardContent>

    <CardFooter class="flex flex-wrap justify-between gap-3">
      <p class="text-xs text-muted-foreground tabular-nums" aria-live="polite">
        {{
          status === 'ready' ? `${byteCount.toLocaleString()} PDF bytes` : 'Vue SFC → Uint8Array'
        }}
      </p>
      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="status === 'rendering'" @click="renderPreview">
          <Spinner v-if="status === 'rendering'" />
          <RotateCwIcon v-else data-icon="inline-start" />
          Render again
        </Button>
        <Button v-if="status === 'ready' && pdfUrl" as-child>
          <a :href="pdfUrl" download="pdfcn-vue-foundation.pdf">
            <DownloadIcon data-icon="inline-start" />
            Download PDF
          </a>
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
