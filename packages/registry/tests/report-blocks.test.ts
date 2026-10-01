import type { FormeNode } from '@formepdf/vue';
import type { BaseReportData } from '../src/forme/blocks/shared/report.types.ts';
import { renderSerializedDoc } from '@formepdf/core';
import { serialize } from '@formepdf/vue';
import { expect, test } from 'vite-plus/test';
import { sampleReportFinancialData } from '../src/forme/blocks/report-financial/report-financial.sample.ts';
import ReportFinancial from '../src/forme/blocks/report-financial/ReportFinancial.vue';
import { sampleReportMarketingData } from '../src/forme/blocks/report-marketing/report-marketing.sample.ts';
import ReportMarketing from '../src/forme/blocks/report-marketing/ReportMarketing.vue';
import { sampleReportOperationsData } from '../src/forme/blocks/report-operations/report-operations.sample.ts';
import ReportOperations from '../src/forme/blocks/report-operations/ReportOperations.vue';
import { sampleReportSecurityData } from '../src/forme/blocks/report-security/report-security.sample.ts';
import ReportSecurity from '../src/forme/blocks/report-security/ReportSecurity.vue';
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

type ReportCase = {
  name: string;
  component: Parameters<typeof serialize>[0];
  data: BaseReportData;
  mustContain: string[];
};

const reportCases: ReportCase[] = [
  {
    name: 'report-financial',
    component: ReportFinancial,
    data: sampleReportFinancialData,
    mustContain: [
      'Quarterly Financial Report',
      'Revenue',
      '$2.48M',
      'Collections requires executive follow-up on two overdue accounts.',
    ],
  },
  {
    name: 'report-marketing',
    component: ReportMarketing,
    data: sampleReportMarketingData,
    mustContain: [
      'Growth & Marketing Report',
      'MQLs',
      '3,940',
      'Channel mix improved CAC while maintaining lead quality.',
    ],
  },
  {
    name: 'report-operations',
    component: ReportOperations,
    data: sampleReportOperationsData,
    mustContain: [
      'Monthly Operations Report',
      'Tickets Closed',
      '1,284',
      'Incident queue remediation plan has executive sponsorship and budget.',
    ],
  },
  {
    name: 'report-security',
    component: ReportSecurity,
    data: sampleReportSecurityData,
    mustContain: [
      'Security Posture Report',
      'Critical Vulns',
      '84/100',
      'Secrets rotation remains the highest-risk stream and needs additional staffing.',
    ],
  },
];

async function expectValidPdf(bytes: Uint8Array): Promise<void> {
  expect(bytes.length).toBeGreaterThan(1000);
  expect(new TextDecoder().decode(bytes.subarray(0, 5))).toBe('%PDF-');
  await expectPdfPages(bytes);
}

for (const reportCase of reportCases) {
  test(`serializes ${reportCase.name} with sample data`, async () => {
    const document = await serialize(reportCase.component, {
      props: { data: reportCase.data },
    });
    expect(document).toMatchSnapshot();
    const text = collectText(document.children);

    for (const fragment of reportCase.mustContain) {
      expect(text).toContain(fragment);
    }

    const bytes = await renderSerializedDoc({ ...document });
    await expectValidPdf(bytes);
  });
}

test('report layout includes shared chrome labels', async () => {
  const document = await serialize(ReportFinancial, {
    props: { data: sampleReportFinancialData },
  });
  expect(document).toMatchSnapshot();
  const text = collectText(document.children);

  expect(text).toContain('Executive Summary');
  expect(text).toContain('Performance Trend');
  expect(text).toContain('Delivery Table');
  expect(text).toContain('Highlights & Risks');
  expect(text).toContain('Confidential — Internal Use');
  expect(text).toContain('Enterprise Sales');
});
