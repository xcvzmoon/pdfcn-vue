import type { FormeNode } from '@formepdf/vue';
import { renderSerializedDoc } from '@formepdf/core';
import { serialize } from '@formepdf/vue';
import { expect, test } from 'vite-plus/test';
import { formatValue } from '../src/forme/components/data-table.styles.ts';
import { categoryLabels, isPointList, normalizeData } from '../src/forme/components/graph.utils.ts';
import DataChromeDocument from './fixtures/DataChromeDocument.vue';

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

function collectText(nodes: FormeNode[]): string[] {
  const texts: string[] = [];
  for (const node of findNodes(nodes, 'Text')) {
    if (node.kind.type === 'Text' && node.kind.content) {
      texts.push(node.kind.content);
    }
  }
  return texts;
}

test('normalizes graph data and formats table values', () => {
  const points = [
    { label: 'A', value: 1 },
    { label: 'B', value: 2 },
  ];
  const series = [{ data: points, name: 'S1' }];

  expect(isPointList(points)).toBe(true);
  expect(isPointList(series)).toBe(false);
  expect(normalizeData(points)).toEqual([{ data: points, name: 'Series 1' }]);
  expect(normalizeData(series)).toEqual(series);
  expect(categoryLabels(normalizeData(points))).toEqual(['A', 'B']);
  expect(formatValue(undefined)).toBe('');
  expect(formatValue(null)).toBe('');
  expect(formatValue(12)).toBe('12');
  expect(formatValue('ok')).toBe('ok');
});

test('serializes data and chrome components with document semantics', async () => {
  const document = await serialize(DataChromeDocument);
  const texts = collectText(document.children);
  const views = findNodes(document.children, 'View');
  const svgs = findNodes(document.children, 'Svg');
  const watermarks = findNodes(document.children, 'Watermark');
  const qrcodes = findNodes(document.children, 'QrCode');
  const images = findNodes(document.children, 'Image');
  const charts = [
    ...findNodes(document.children, 'BarChart'),
    ...findNodes(document.children, 'PieChart'),
  ];

  expect(texts).toContain('Acme Corp');
  expect(texts).toContain('Card body content');
  expect(texts).toContain('Deployment finished without errors.');
  expect(texts).toContain('Paid');
  expect(texts).toContain('Subtotal');
  expect(texts).toContain('Widget');
  expect(texts).toContain('Intake');
  expect(texts).toContain('Full name');
  expect(texts).toContain('Scan me');
  expect(texts).toContain('Approved by');
  expect(texts.some((text) => text.includes('{{pageNumber}}'))).toBe(true);

  expect(watermarks).toHaveLength(1);
  if (watermarks[0]?.kind.type === 'Watermark') {
    expect(watermarks[0].kind.text).toBe('DRAFT');
  }
  expect(qrcodes).toHaveLength(1);
  if (qrcodes[0]?.kind.type === 'QrCode') {
    expect(qrcodes[0].kind.data).toBe('https://example.com');
  }
  expect(images).toHaveLength(1);
  expect(charts.length).toBeGreaterThanOrEqual(2);
  expect(svgs.length).toBeGreaterThanOrEqual(1);
  expect(views.length).toBeGreaterThan(10);
});

test('renders all data and chrome components to a valid PDF', async () => {
  const document = await serialize(DataChromeDocument);
  const bytes = await renderSerializedDoc({ ...document });

  expect(bytes.length).toBeGreaterThan(1000);
  expect(new TextDecoder().decode(bytes.subarray(0, 5))).toBe('%PDF-');
});

test('keeps serialized document structure stable', async () => {
  const document = await serialize(DataChromeDocument);
  await expect(`${JSON.stringify(document, null, 2)}\n`).toMatchFileSnapshot(
    './__snapshots__/data-chrome-document.json',
  );
});
