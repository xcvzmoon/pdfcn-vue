import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { expect } from 'vite-plus/test';

const standardFontDataUrl = fileURLToPath(
  new URL('./standard_fonts/', import.meta.resolve('pdfjs-dist/package.json')),
);

export async function expectPdfPages(bytes: Uint8Array): Promise<void> {
  const task = getDocument({ data: bytes.slice(), standardFontDataUrl });
  try {
    const document = await task.promise;
    expect(document.numPages).toBeGreaterThanOrEqual(1);
    const page = await document.getPage(1);
    expect(page.getViewport({ scale: 1 }).width).toBeGreaterThan(0);
    await page.getOperatorList();
    page.cleanup();
  } finally {
    await task.destroy();
  }
}
