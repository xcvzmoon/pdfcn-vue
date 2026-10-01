import type {
  BuildResult,
  RegistryIndexPayload,
  RegistryItemPayload,
  RegistryFileType,
} from './types.ts';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  registryCatalog,
  type RegistryItemSource,
} from '../../../packages/registry/src/registry.ts';
import { filePayloadType, resolveSourceLocation } from './paths.ts';
import { rewriteImports } from './rewrite-imports.ts';

const NPM_DEPENDENCIES = {
  vue: '^3.4.0',
  'takumi-pdf': '0.15.0',
  '@vue/server-renderer': '^3.5.43',
  '@formepdf/core': '^0.25.0',
  '@formepdf/vue': '^0.25.0',
} as const satisfies Record<string, string>;

const REGISTRY_ITEM_SCHEMA_URL = 'https://shadcn-vue.com/schema/registry-item.json';
const DEFAULT_REGISTRY_BASE = '@pdfcn-vue';

function toDependencySpec(packageName: string): string {
  if (packageName === 'vue') return `vue@${NPM_DEPENDENCIES.vue}`;
  if (packageName === '@formepdf/core')
    return `@formepdf/core@${NPM_DEPENDENCIES['@formepdf/core']}`;
  if (packageName === '@formepdf/vue') return `@formepdf/vue@${NPM_DEPENDENCIES['@formepdf/vue']}`;
  if (packageName === 'takumi-pdf') return `takumi-pdf@${NPM_DEPENDENCIES['takumi-pdf']}`;
  if (packageName === '@vue/server-renderer')
    return `@vue/server-renderer@${NPM_DEPENDENCIES['@vue/server-renderer']}`;
  return packageName;
}

function toRegistryDependencyUrl(registryBase: string, itemName: string): string {
  if (registryBase === DEFAULT_REGISTRY_BASE) return `${registryBase}/${itemName}`;
  const base = registryBase.endsWith('/') ? registryBase.slice(0, -1) : registryBase;
  return `${base}/${itemName}.json`;
}

function compareStrings(a: string, b: string): number {
  return a.localeCompare(b);
}

export function findItemForSource(
  source: string,
  items: readonly RegistryItemSource[],
): RegistryItemSource | undefined {
  for (const item of items) {
    if (item.files.includes(source)) return item;
  }
  return undefined;
}

type LoadedSource = {
  source: string;
  rewritten: string;
  internalSources: string[];
  packages: string[];
};

async function loadSource(registrySrc: string, source: string): Promise<LoadedSource> {
  const filePath = path.join(registrySrc, source);
  const content = await readFile(filePath, 'utf8');
  const rewrite = rewriteImports(source, content);
  return {
    source,
    rewritten: rewrite.content,
    internalSources: rewrite.internalSources,
    packages: rewrite.packages,
  };
}

export async function buildRegistryItems(
  registrySrc: string,
  registryBase: string = DEFAULT_REGISTRY_BASE,
): Promise<RegistryItemPayload[]> {
  // Canonical owner is the first catalog item that lists the source. Shared
  // type files (page-chrome.types.ts) may appear in several items so a single
  // install stays self-contained; the graph still treats them as one module.
  const ownerBySource = new Map<string, string>();
  for (const item of registryCatalog.items) {
    for (const source of item.files) {
      if (!ownerBySource.has(source)) ownerBySource.set(source, item.name);
    }
  }

  const loadedBySource = new Map<string, LoadedSource>();
  const sourcesToLoad: string[] = [];
  for (const item of registryCatalog.items) {
    for (const source of item.files) {
      if (!loadedBySource.has(source) && !sourcesToLoad.includes(source)) {
        sourcesToLoad.push(source);
      }
    }
  }
  const loadedList = await Promise.all(
    sourcesToLoad.map((source) => loadSource(registrySrc, source)),
  );
  for (const loaded of loadedList) {
    loadedBySource.set(loaded.source, loaded);
  }

  const payloads: RegistryItemPayload[] = [];

  for (const item of registryCatalog.items) {
    const npmPackages = new Set<string>();
    const registryDependencies = new Set<string>();

    for (const source of item.files) {
      const loaded = loadedBySource.get(source);
      if (!loaded) throw new Error(`Missing loaded source for "${source}"`);

      for (const packageName of loaded.packages) {
        npmPackages.add(packageName);
      }

      for (const internal of loaded.internalSources) {
        if (item.files.includes(internal)) continue;
        const owner = ownerBySource.get(internal);
        if (!owner) {
          throw new Error(
            `Item "${item.name}" file "${source}" imports unowned source "${internal}". Add it to the registry catalog.`,
          );
        }
        if (owner !== item.name) registryDependencies.add(owner);
      }
    }

    const files = item.files.map((source) => {
      const loaded = loadedBySource.get(source);
      if (!loaded) throw new Error(`Missing loaded source for "${source}"`);
      const location = resolveSourceLocation(source);
      const fileType: RegistryFileType = filePayloadType(location.registryPath, item.name);
      return {
        path: location.registryPath,
        content: loaded.rewritten,
        type: fileType,
      };
    });

    const dependencies = [...npmPackages].toSorted(compareStrings).map(toDependencySpec);
    const resolvedRegistryDependencies = [...registryDependencies]
      .toSorted(compareStrings)
      .map((name) => toRegistryDependencyUrl(registryBase, name));

    const payload: RegistryItemPayload = {
      $schema: REGISTRY_ITEM_SCHEMA_URL,
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      author: 'pdfcn-vue',
      dependencies,
      registryDependencies: resolvedRegistryDependencies,
      files,
      categories: [...item.categories],
    };
    if (item.docs) payload.docs = item.docs;
    payloads.push(payload);
  }

  return payloads;
}

export async function buildRegistry(
  registrySrc: string,
  outputDir: string,
  registryJsonPath: string,
  registryBase: string = process.env.PDFCN_VUE_REGISTRY_BASE ?? DEFAULT_REGISTRY_BASE,
): Promise<BuildResult> {
  const items = await buildRegistryItems(registrySrc, registryBase);

  await mkdir(outputDir, { recursive: true });
  const writtenFiles: string[] = [];

  await Promise.all(
    items.map(async (item) => {
      const outFile = path.join(outputDir, `${item.name}.json`);
      await writeFile(outFile, `${JSON.stringify(item, null, 2)}\n`, 'utf8');
      writtenFiles.push(outFile);
    }),
  );
  writtenFiles.sort(compareStrings);

  const index: RegistryIndexPayload = {
    $schema: 'https://shadcn-vue.com/schema/registry.json',
    name: registryCatalog.name,
    homepage: registryCatalog.homepage,
    items: items.map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      categories: item.categories,
    })),
  };
  const indexFile = path.join(outputDir, 'index.json');
  await writeFile(indexFile, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  writtenFiles.push(indexFile);

  await mkdir(path.dirname(registryJsonPath), { recursive: true });
  await writeFile(registryJsonPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  writtenFiles.push(registryJsonPath);

  return { items, writtenFiles };
}
