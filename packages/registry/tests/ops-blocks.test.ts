import type { FormeDocument, FormeNode } from '@formepdf/vue';
import { renderSerializedDoc } from '@formepdf/core';
import { serialize } from '@formepdf/vue';
import { expect, test } from 'vite-plus/test';
import { samplePackingSlipData } from '../src/forme/blocks/packing-slip/packing-slip.sample.ts';
import PackingSlip from '../src/forme/blocks/packing-slip/PackingSlip.vue';
import { sampleShippingLabelData } from '../src/forme/blocks/shipping-label/shipping-label.sample.ts';
import ShippingLabel from '../src/forme/blocks/shipping-label/ShippingLabel.vue';
import { sampleWorkOrderData } from '../src/forme/blocks/work-order/work-order.sample.ts';
import WorkOrder from '../src/forme/blocks/work-order/WorkOrder.vue';
import { expectPdfPages } from './pdf-smoke.ts';

function collectText(nodes: FormeNode[]): string {
  const parts: string[] = [];
  const pending = [...nodes];
  while (pending.length > 0) {
    const node = pending.pop();
    if (!node) continue;
    if (node.kind.type === 'Text') {
      if (node.kind.content) parts.push(node.kind.content);
      if (node.kind.runs) {
        for (const run of node.kind.runs) parts.push(run.content);
      }
    }
    pending.push(...node.children);
  }
  return parts.join('\n');
}

async function expectValidPdf(document: FormeDocument): Promise<void> {
  const bytes = await renderSerializedDoc({ ...document });

  expect(bytes.length).toBeGreaterThan(1000);
  expect(new TextDecoder().decode(bytes.subarray(0, 5))).toBe('%PDF-');
  await expectPdfPages(bytes);
}

test('serializes packing-slip with sample data', async () => {
  const document = await serialize(PackingSlip, {
    props: { data: samplePackingSlipData },
  });
  expect(document).toMatchSnapshot();
  const text = collectText(document.children);

  expect(text).toContain('ORD-2026-0891');
  expect(text).toContain('1Z999AA10123456784');
  expect(text).toContain('Jane Doe');
  expect(text).toContain('Widget Pro');
  expect(text).toContain('Acme Store');
  expect(text).toContain('PO-4471');
});

test('renders packing-slip to a valid PDF', async () => {
  const document = await serialize(PackingSlip, {
    props: { data: samplePackingSlipData },
  });
  await expectValidPdf(document);
});

test('serializes shipping-label with sample data', async () => {
  const document = await serialize(ShippingLabel, {
    props: { data: sampleShippingLabelData },
  });
  expect(document).toMatchSnapshot();
  const text = collectText(document.children);

  expect(text).toContain('TRACK123456789US');
  expect(text).toContain('John Doe');
  expect(text).toContain('ACME Corporation');
  expect(text).toContain('UPS');
  expect(text).toContain('FRAGILE');
});

test('renders shipping-label to a valid PDF', async () => {
  const document = await serialize(ShippingLabel, {
    props: { data: sampleShippingLabelData },
  });
  await expectValidPdf(document);
});

test('serializes work-order with sample data', async () => {
  const document = await serialize(WorkOrder, {
    props: { data: sampleWorkOrderData },
  });
  expect(document).toMatchSnapshot();
  const text = collectText(document.children);

  expect(text).toContain('WO-2026-0452');
  expect(text).toContain('Riverside Apartments');
  expect(text).toContain('Mike Torres');
  expect(text).toContain('PUMP-001');
  expect(text).toContain('FixIt Pro Services');
  expect(text).toContain('High');
});

test('renders work-order to a valid PDF', async () => {
  const document = await serialize(WorkOrder, {
    props: { data: sampleWorkOrderData },
  });
  await expectValidPdf(document);
});
