import type { FormeNode } from '@formepdf/vue';
import type { InvoiceClassicData } from '../src/forme/blocks/invoice-classic/invoice-classic.types.ts';
import type { InvoiceConsultantData } from '../src/forme/blocks/invoice-consultant/invoice-consultant.types.ts';
import type { InvoiceCorporateData } from '../src/forme/blocks/invoice-corporate/invoice-corporate.types.ts';
import type { InvoiceCreativeData } from '../src/forme/blocks/invoice-creative/invoice-creative.types.ts';
import type { InvoiceBaseData } from '../src/forme/blocks/shared/invoice.types.ts';
import { renderSerializedDoc } from '@formepdf/core';
import { serialize } from '@formepdf/vue';
import { expect, test } from 'vite-plus/test';
import { sampleInvoiceClassicData } from '../src/forme/blocks/invoice-classic/invoice-classic.sample.ts';
import InvoiceClassic from '../src/forme/blocks/invoice-classic/InvoiceClassic.vue';
import { sampleInvoiceConsultantData } from '../src/forme/blocks/invoice-consultant/invoice-consultant.sample.ts';
import InvoiceConsultant from '../src/forme/blocks/invoice-consultant/InvoiceConsultant.vue';
import { sampleInvoiceCorporateData } from '../src/forme/blocks/invoice-corporate/invoice-corporate.sample.ts';
import InvoiceCorporate from '../src/forme/blocks/invoice-corporate/InvoiceCorporate.vue';
import { sampleInvoiceCreativeData } from '../src/forme/blocks/invoice-creative/invoice-creative.sample.ts';
import InvoiceCreative from '../src/forme/blocks/invoice-creative/InvoiceCreative.vue';
import { sampleInvoiceMinimalData } from '../src/forme/blocks/invoice-minimal/invoice-minimal.sample.ts';
import InvoiceMinimal from '../src/forme/blocks/invoice-minimal/InvoiceMinimal.vue';
import { sampleInvoiceModernData } from '../src/forme/blocks/invoice-modern/invoice-modern.sample.ts';
import InvoiceModern from '../src/forme/blocks/invoice-modern/InvoiceModern.vue';
import { formatCurrency } from '../src/forme/blocks/shared/format.ts';

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

type InvoiceCaseData =
  | InvoiceBaseData
  | InvoiceClassicData
  | InvoiceConsultantData
  | InvoiceCorporateData
  | InvoiceCreativeData;

type InvoiceCase = {
  name: string;
  component: Parameters<typeof serialize>[0];
  props: { data: InvoiceCaseData };
  mustContain: string[];
};

const invoiceCases: InvoiceCase[] = [
  {
    name: 'invoice-minimal',
    component: InvoiceMinimal,
    props: { data: sampleInvoiceMinimalData },
    mustContain: ['INV-2026-003', 'Enterprise Corp', 'Balance Due', '$58,850.00'],
  },
  {
    name: 'invoice-classic',
    component: InvoiceClassic,
    props: { data: sampleInvoiceClassicData },
    mustContain: ['INV-2026-001', 'Client Corp.', 'Web Development', '$38,787.50'],
  },
  {
    name: 'invoice-modern',
    component: InvoiceModern,
    props: { data: sampleInvoiceModernData },
    mustContain: ['INV-2026-002', 'TechStart Solutions', 'Total Due', '$35,524.00'],
  },
  {
    name: 'invoice-corporate',
    component: InvoiceCorporate,
    props: { data: sampleInvoiceCorporateData },
    mustContain: ['INV-2026-004', 'Global Industries Ltd.', 'Total Due', '$61,020.00'],
  },
  {
    name: 'invoice-creative',
    component: InvoiceCreative,
    props: { data: sampleInvoiceCreativeData },
    mustContain: ['INV-2026-005', 'Creative Agency Co.', 'Brand Identity Design'],
  },
  {
    name: 'invoice-consultant',
    component: InvoiceConsultant,
    props: { data: sampleInvoiceConsultantData },
    mustContain: ['INV-2026-006', 'John Smith', 'Acme Technologies', 'Total Hours: 60'],
  },
];

test('formats invoice currency deterministically', () => {
  expect(formatCurrency(58_850)).toBe('$58,850.00');
  expect(formatCurrency(2537.5)).toBe('$2,537.50');
});

for (const invoiceCase of invoiceCases) {
  test(`serializes ${invoiceCase.name} with sample data`, async () => {
    const document = await serialize(invoiceCase.component, {
      props: invoiceCase.props,
    });
    const text = collectText(document.children);
    for (const expected of invoiceCase.mustContain) {
      expect(text).toContain(expected);
    }
  });

  test(`renders ${invoiceCase.name} to a valid PDF`, async () => {
    const document = await serialize(invoiceCase.component, {
      props: invoiceCase.props,
    });
    const bytes = await renderSerializedDoc({ ...document });

    expect(bytes.length).toBeGreaterThan(1000);
    expect(new TextDecoder().decode(bytes.subarray(0, 5))).toBe('%PDF-');
  });
}
