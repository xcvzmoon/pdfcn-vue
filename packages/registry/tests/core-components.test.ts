import type { FormeNode } from '@formepdf/vue';
import { renderSerializedDoc } from '@formepdf/core';
import { parseColor, serialize } from '@formepdf/vue';
import { expect, test } from 'vite-plus/test';
import { resolveColor } from '../src/forme/lib/resolve-color.ts';
import { mergePdfStyles } from '../src/forme/lib/styles.ts';
import { forestTheme } from '../src/themes/forest.ts';
import CoreComponentsDocument from './fixtures/CoreComponentsDocument.vue';
import { expectPdfPages } from './pdf-smoke.ts';

function findNodes(nodes: FormeNode[], type: FormeNode['kind']['type']): FormeNode[] {
  const found: FormeNode[] = [];
  const pending = [...nodes];
  while (pending.length > 0) {
    const node = pending.pop();
    if (!node) continue;
    if (node.kind.type === type) found.push(node);
    pending.push(...node.children);
  }
  return found;
}

test('resolves theme tokens and preserves direct colors', () => {
  expect(resolveColor('primary', forestTheme.colors)).toBe(forestTheme.colors.primary);
  expect(resolveColor('#123456', forestTheme.colors)).toBe('#123456');
  expect(mergePdfStyles({ fontSize: 12 }, undefined, { fontSize: 14, color: '#123456' })).toEqual({
    fontSize: 14,
    color: '#123456',
  });
});

test('serializes the core components with themed styles and document semantics', async () => {
  const document = await serialize(CoreComponentsDocument);
  expect(document).toMatchSnapshot();
  const headings = findNodes(document.children, 'Heading');
  const texts = findNodes(document.children, 'Text');
  const views = findNodes(document.children, 'View');

  expect(headings.map((node) => node.kind)).toContainEqual({
    type: 'Heading',
    level: 2,
    content: 'Core heading',
  });
  expect(headings.map((node) => node.kind)).toContainEqual({
    type: 'Heading',
    level: 3,
    content: 'Following page',
  });
  expect(
    texts.some((node) => node.kind.type === 'Text' && node.kind.content === 'Nested item'),
  ).toBe(true);
  expect(
    texts.some((node) => node.kind.type === 'Text' && node.kind.content === 'Supporting detail'),
  ).toBe(true);
  expect(findNodes(document.children, 'PageBreak')).toHaveLength(1);
  expect(findNodes(document.children, 'Svg')).toHaveLength(2);
  expect(views.some((node) => node.style.wrap === false)).toBe(true);
  expect(views.some((node) => node.style.flexDirection === 'Row' && node.style.gap === 8)).toBe(
    true,
  );
  const link = texts.find(
    (node) =>
      node.kind.type === 'Text' && node.kind.runs?.some((run) => run.content === 'Example link'),
  );
  expect(link?.style.color).toEqual(parseColor(forestTheme.colors.primary));
  expect(JSON.stringify(document)).toContain('https://example.com');
});

test('renders all core components to a valid PDF', async () => {
  const document = await serialize(CoreComponentsDocument);
  const bytes = await renderSerializedDoc({ ...document });

  expect(bytes.length).toBeGreaterThan(1000);
  expect(new TextDecoder().decode(bytes.subarray(0, 5))).toBe('%PDF-');
  await expectPdfPages(bytes);
});
