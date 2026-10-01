import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import init from 'takumi-pdf/no-init';
import { expect, test } from 'vite-plus/test';
import { h } from 'vue';
import TakumiDocument from '../examples/TakumiDocument.vue';
import { renderTakumi, serializeTakumi, toCssStyle } from '../src/takumi/index.ts';

test('converts point dimensions and edge shorthands without scaling unitless styles', () => {
  expect(
    toCssStyle({
      fontSize: 12,
      paddingHorizontal: 6,
      lineHeight: 1.5,
      fontWeight: 700,
      width: '50%',
    }),
  ).toBe(
    'font-size:12pt;padding-left:6pt;padding-right:6pt;line-height:1.5;font-weight:700;width:50%',
  );
});

test('preserves flex factors, grid lines, spans, and visible borders', () => {
  expect(toCssStyle({ flex: 1, gridColumnStart: 2, gridColumnSpan: 3, borderWidth: 1 })).toBe(
    'flex:1;grid-column-start:2;grid-column:span 3;border-width:1pt;border-style:solid',
  );
});

test('serializes escaped Vue slots with theme styles and explicit page breaks', async () => {
  const html = await serializeTakumi(
    h(TakumiDocument, { recipient: '<script>alert("x")</script>' }),
  );
  expect(html).toContain('&lt;script&gt;');
  expect(html).not.toContain('<script>');
  expect(html).toContain('font-size:');
  expect(html).toContain('break-before:page');
  expect(html).not.toContain('forme-');
  expect(html).not.toContain('<!--[-->');
});

test('renders core components to two selectable PDF pages', async () => {
  const wasm = await readFile(
    fileURLToPath(import.meta.resolve('takumi-pdf/takumi_pdf_wasm_bg.wasm')),
  );
  await init({ module_or_path: wasm });
  const bytes = await renderTakumi(h(TakumiDocument, { recipient: 'Vue recipient' }), {
    size: 'letter',
    margin: 48,
  });
  const task = getDocument({ data: bytes.slice() });
  try {
    const document = await task.promise;
    expect(document.numPages).toBe(2);
    const page = await document.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    expect(viewport.width).toBeCloseTo(612);
    expect(viewport.height).toBeCloseTo(792);
    const content = await page.getTextContent();
    const text: string[] = [];
    for (const item of content.items) {
      if ('str' in item) text.push(item.str);
    }
    expect(text.join(' ')).toContain('Vue recipient');
    expect(text.join(' ')).toContain('First item');
    page.cleanup();
  } finally {
    await task.destroy();
  }
});
