import type { Component, ShallowRef } from 'vue';
import type { BlockSample } from './block-sample';
import * as v from 'valibot';
import { defineAsyncComponent, shallowRef } from 'vue';
import { blockSampleSchema } from './block-sample';

export type { BlockSample, BlockSampleField, BlockSampleObject } from './block-sample';

export type BlockRuntime = {
  component: Component;
  sample: BlockSample;
};

type GlobModule = Record<string, BlockSample | { default: Component }>;
type GlobLoader = () => Promise<GlobModule>;

const registryBlockLoaders = import.meta.glob<GlobModule>(
  '../../../../packages/registry/src/forme/blocks/*/*.vue',
);

const registrySampleLoaders = import.meta.glob<GlobModule>(
  '../../../../packages/registry/src/forme/blocks/*/*.sample.ts',
);

function pickGlobModule(
  loaders: Record<string, GlobLoader>,
  match: (path: string) => boolean,
): GlobLoader | null {
  for (const [path, loader] of Object.entries(loaders)) {
    if (match(path)) return loader;
  }
  return null;
}

function parseComponentResult(module: GlobModule): Component | null {
  const parsed = v.safeParse(v.object({ default: v.custom<Component>(() => true) }), module);
  return parsed.success ? parsed.output.default : null;
}

function parseSampleResult(module: GlobModule, sampleExport: string): BlockSample | null {
  const parsed = v.safeParse(blockSampleSchema, module);
  if (!parsed.success) return null;
  const sample = parsed.output[sampleExport];
  if (sample === undefined) return null;
  const nested = v.safeParse(blockSampleSchema, sample);
  return nested.success ? nested.output : null;
}

type BlockRuntimeState = {
  loadBlock: (
    slug: string,
    componentName: string,
    sampleExport: string,
  ) => Promise<BlockRuntime | null>;
  loading: ShallowRef<boolean>;
  loadError: ShallowRef<string | null>;
};

export function useBlockRuntime(): BlockRuntimeState {
  const cache = new Map<string, BlockRuntime>();
  const loading = shallowRef<boolean>(false);
  const loadError = shallowRef<string | null>(null);

  async function loadBlock(
    slug: string,
    componentName: string,
    sampleExport: string,
  ): Promise<BlockRuntime | null> {
    const cached = cache.get(slug);
    if (cached) return cached;

    loading.value = true;
    loadError.value = null;

    try {
      const componentLoader = pickGlobModule(registryBlockLoaders, (path) =>
        path.endsWith(`/${componentName}.vue`),
      );
      const sampleLoader = pickGlobModule(
        registrySampleLoaders,
        (path) => path.includes(`/${slug}/`) && path.endsWith('.sample.ts'),
      );

      if (!componentLoader) throw new Error(`BLOCK_COMPONENT_MISSING:${componentName}`);
      if (!sampleLoader) throw new Error(`BLOCK_SAMPLE_MISSING:${slug}`);

      const [componentResult, sampleResult] = await Promise.all([
        componentLoader(),
        sampleLoader(),
      ]);

      const component = parseComponentResult(componentResult);
      if (!component) throw new Error(`BLOCK_COMPONENT_INVALID:${componentName}`);

      const sample = parseSampleResult(sampleResult, sampleExport);
      if (!sample) throw new Error(`BLOCK_SAMPLE_EXPORT_MISSING:${sampleExport}`);

      const runtime: BlockRuntime = { component, sample };
      cache.set(slug, runtime);
      return runtime;
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : 'BLOCK_LOAD_FAILED';
      return null;
    } finally {
      loading.value = false;
    }
  }

  return { loadBlock, loading, loadError };
}

export const ComponentGalleryDocument: Component = defineAsyncComponent(
  () => import('@/components/pdf/demos/ComponentGalleryDocument.vue'),
);

export const BlockPreviewDocument: Component = defineAsyncComponent(
  () => import('@/components/pdf/demos/BlockPreviewDocument.vue'),
);

export type { PdfcnTheme } from '#registry/types/pdf-themes.ts';
