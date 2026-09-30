import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vite-plus/test';
import { buildRegistryItems } from '../src/build.ts';
import { resolveSourceLocation } from '../src/paths.ts';
import { rewriteImports } from '../src/rewrite-imports.ts';
import { validateRegistryGraph } from '../src/validate.ts';

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const registrySrc = path.resolve(toolDir, '../../../packages/registry/src');

test('maps core lib sources to @/lib/pdfcn aliases', () => {
  const location = resolveSourceLocation('forme/lib/theme.ts');
  expect(location.registryPath).toBe('registry/lib/pdfcn/theme.ts');
  expect(location.alias).toBe('@/lib/pdfcn/theme');
});

test('maps component sources to @/components/pdf aliases', () => {
  const location = resolveSourceLocation('forme/components/Text.vue');
  expect(location.registryPath).toBe('registry/components/pdf/Text.vue');
  expect(location.alias).toBe('@/components/pdf/Text.vue');
});

test('maps block sources under components/pdf/blocks', () => {
  const location = resolveSourceLocation('forme/blocks/invoice-minimal/InvoiceMinimal.vue');
  expect(location.registryPath).toBe(
    'registry/components/pdf/blocks/invoice-minimal/InvoiceMinimal.vue',
  );
  expect(location.alias).toBe('@/components/pdf/blocks/invoice-minimal/InvoiceMinimal.vue');
});

test('rewrites relative imports to aliases and collects packages', () => {
  const source = 'forme/components/Text.vue';
  const content = [
    "import { computed } from 'vue'",
    "import { resolveColor } from '../lib/resolve-color.ts'",
    "import { usePdfcnTheme } from '../lib/theme.ts'",
    '',
  ].join('\n');

  const result = rewriteImports(source, content);
  expect(result.content).toContain("from '@/lib/pdfcn/resolve-color'");
  expect(result.content).toContain("from '@/lib/pdfcn/theme'");
  expect(result.content).toContain("from 'vue'");
  expect(result.packages).toEqual(['vue']);
  expect(result.internalSources).toEqual(['forme/lib/resolve-color.ts', 'forme/lib/theme.ts']);
});

test('builds every catalog item with resolvable dependencies', async () => {
  const registryBase = 'https://registry.test/r';
  const items = await buildRegistryItems(registrySrc, registryBase);
  expect(items.length).toBeGreaterThan(50);

  const names = new Set(items.map((item) => item.name));
  expect(names.has('pdfcn-core')).toBe(true);
  expect(names.has('text')).toBe(true);
  expect(names.has('invoice-minimal')).toBe(true);
  expect(names.has('theme-minimal')).toBe(true);

  for (const item of items) {
    expect(item.files.length).toBeGreaterThan(0);
    for (const file of item.files) {
      expect(file.content.length).toBeGreaterThan(0);
      expect(file.path.startsWith('registry/')).toBe(true);
    }
    for (const dependency of item.registryDependencies) {
      expect(dependency.startsWith(`${registryBase}/`)).toBe(true);
      const leaf = dependency.slice(registryBase.length + 1).replace(/\.json$/, '');
      expect(names.has(leaf)).toBe(true);
    }
  }

  const issues = validateRegistryGraph(items);
  expect(issues).toEqual([]);
});

test('data-table depends on table and blocks depend on their components', async () => {
  const registryBase = 'https://registry.test/r';
  const items = await buildRegistryItems(registrySrc, registryBase);
  const byName = new Map(items.map((item) => [item.name, item]));

  expect(byName.get('data-table')?.registryDependencies).toContain(`${registryBase}/table.json`);
  const invoice = byName.get('invoice-minimal');
  expect(invoice?.registryDependencies).toContain(`${registryBase}/text.json`);
  expect(invoice?.registryDependencies).toContain(`${registryBase}/block-shared.json`);
  expect(invoice?.registryDependencies).toContain(`${registryBase}/page-header.json`);
});

test('default registry dependencies resolve through the configured namespace', async () => {
  const items = await buildRegistryItems(registrySrc);
  const invoice = items.find(({ name }) => name === 'invoice-minimal');
  expect(invoice?.registryDependencies).toContain('@pdfcn-vue/text');
  expect(invoice?.registryDependencies).toContain('@pdfcn-vue/pdfcn-core');
  expect(validateRegistryGraph(items)).toEqual([]);
});
