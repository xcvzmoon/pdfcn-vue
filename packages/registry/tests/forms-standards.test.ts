import { renderDocument, renderDocumentWithLayout, serialize } from '@formepdf/vue';
import { readFile } from 'node:fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { expect, test } from 'vite-plus/test';
import FillableFormDocument from '../examples/FillableFormDocument.vue';
import StandardsDocument from '../examples/StandardsDocument.vue';

test('renders named AcroForm fields with their initial values', async () => {
  const bytes = await renderDocument(FillableFormDocument, { props: { fullName: 'Grace Hopper' } });
  const task = getDocument({ data: bytes.slice() });
  try {
    const document = await task.promise;
    const page = await document.getPage(1);
    const annotations = await page.getAnnotations();
    expect(annotations).toHaveLength(5);
    expect(annotations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          subtype: 'Widget',
          fieldName: 'fullName',
          fieldValue: 'Grace Hopper',
          fieldType: 'Tx',
        }),
        expect.objectContaining({ subtype: 'Widget', fieldName: 'department', fieldType: 'Ch' }),
        expect.objectContaining({ subtype: 'Widget', fieldName: 'updates', fieldType: 'Btn' }),
        expect.objectContaining({
          subtype: 'Widget',
          fieldName: 'contactMethod',
          fieldType: 'Btn',
          radioButton: true,
        }),
      ]),
    );
    expect(document.numPages).toBe(1);
  } finally {
    await task.destroy();
  }
});

test('flattenForms removes widgets and retains the supplied values as page text', async () => {
  const bytes = await renderDocument(FillableFormDocument, {
    props: { fullName: 'Grace Hopper' },
    flattenForms: true,
  });
  const task = getDocument({ data: bytes.slice() });
  try {
    const document = await task.promise;
    const page = await document.getPage(1);
    expect(await page.getAnnotations()).toHaveLength(0);
    const content = await page.getTextContent();
    const text: string[] = [];
    for (const item of content.items) {
      if ('str' in item) text.push(item.str);
    }
    expect(text.join(' ')).toContain('Grace Hopper');
    expect(text.join(' ')).toContain('Engineering');
  } finally {
    await task.destroy();
  }
});

test('passes PDF/UA and PDF/A claims and metadata through Vue serialization', async () => {
  const document = await serialize(StandardsDocument, {
    props: { pdfUa: true, pdfa: '2a', pdfVersion: '1.7' },
  });
  expect(document).toMatchObject({
    pdfUa: true,
    pdfa: '2a',
    pdfVersion: '1.7',
    metadata: { title: 'Standards example', author: 'Example team', lang: 'en' },
  });
  const modernDocument = await serialize(StandardsDocument, {
    props: { pdfUa2: true, pdfa: '4', pdfVersion: '2.0' },
  });
  expect(modernDocument).toMatchObject({ pdfUa2: true, pdfa: '4', pdfVersion: '2.0' });
});

test('reports missing embedded fonts when a PDF/UA claim uses default fonts', async () => {
  const result = await renderDocumentWithLayout(StandardsDocument, { props: { pdfUa: true } });
  expect(result.warnings.length).toBeGreaterThan(0);
  const task = getDocument({ data: result.pdf.slice() });
  try {
    const document = await task.promise;
    const metadata = await document.getMetadata();
    expect(metadata.metadata?.get('pdfuaid:part')).toBe('1');
    expect(await document.getMarkInfo()).toEqual(
      new Map([
        ['Marked', true],
        ['UserProperties', false],
        ['Suspects', false],
      ]),
    );
    const page = await document.getPage(1);
    expect(await page.getStructTree()).not.toBeNull();
  } finally {
    await task.destroy();
  }
});

test('renders PDF/A and PDF/UA metadata with embedded fonts and no warnings', async () => {
  const fontDirectory = new URL(
    './standard_fonts/',
    import.meta.resolve('pdfjs-dist/package.json'),
  );
  const regular = await readFile(new URL('LiberationSans-Regular.ttf', fontDirectory));
  const bold = await readFile(new URL('LiberationSans-Bold.ttf', fontDirectory));
  const result = await renderDocumentWithLayout(StandardsDocument, {
    props: {
      pdfUa: true,
      pdfa: '2a',
      fonts: [
        { family: 'Helvetica', src: new Uint8Array(regular) },
        { family: 'Helvetica', fontWeight: 700, src: new Uint8Array(bold) },
      ],
    },
  });
  expect(result.warnings).toEqual([]);
  expect(new TextDecoder().decode(result.pdf)).toContain('/FontFile2');
  const task = getDocument({ data: result.pdf.slice() });
  try {
    const document = await task.promise;
    const metadata = await document.getMetadata();
    expect(metadata.metadata?.get('pdfaid:part')).toBe('2');
    expect(metadata.metadata?.get('pdfaid:conformance')).toBe('A');
    expect(metadata.metadata?.get('pdfuaid:part')).toBe('1');
    const page = await document.getPage(1);
    await page.getOperatorList();
  } finally {
    await task.destroy();
  }
});
