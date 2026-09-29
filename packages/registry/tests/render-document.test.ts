import { renderSerializedDoc } from '@formepdf/core';
import { serialize } from '@formepdf/vue';
import { expect, test } from 'vite-plus/test';
import SmokeDocument from '../src/forme/SmokeDocument.vue';

test('renders a Vue document to PDF bytes in Node', async () => {
  const document = await serialize(SmokeDocument, { props: { recipient: 'Node' } });
  const bytes = await renderSerializedDoc({ ...document });

  expect(document).toBeDefined();
  expect(bytes).toBeInstanceOf(Uint8Array);
  expect(bytes.length).toBeGreaterThan(100);
  expect(new TextDecoder().decode(bytes.subarray(0, 5))).toBe('%PDF-');
});
