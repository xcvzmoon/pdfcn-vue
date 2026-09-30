import type { FormeDocument, FormeNode } from '@formepdf/vue';
import { renderSerializedDoc } from '@formepdf/core';
import { serialize } from '@formepdf/vue';
import { expect, test } from 'vite-plus/test';
import { sampleEventAgendaData } from '../src/forme/blocks/event-agenda/event-agenda.sample.ts';
import EventAgenda from '../src/forme/blocks/event-agenda/EventAgenda.vue';
import { sampleEventTicketData } from '../src/forme/blocks/event-ticket/event-ticket.sample.ts';
import EventTicket from '../src/forme/blocks/event-ticket/EventTicket.vue';
import { sampleGiftCertificateData } from '../src/forme/blocks/gift-certificate/gift-certificate.sample.ts';
import GiftCertificate from '../src/forme/blocks/gift-certificate/GiftCertificate.vue';
import { sampleLessonPlanData } from '../src/forme/blocks/lesson-plan/lesson-plan.sample.ts';
import LessonPlan from '../src/forme/blocks/lesson-plan/LessonPlan.vue';
import { sampleMedicalIntakeFormData } from '../src/forme/blocks/medical-intake-form/medical-intake-form.sample.ts';
import MedicalIntakeForm from '../src/forme/blocks/medical-intake-form/MedicalIntakeForm.vue';
import { sampleMeetingMinutesData } from '../src/forme/blocks/meeting-minutes/meeting-minutes.sample.ts';
import MeetingMinutes from '../src/forme/blocks/meeting-minutes/MeetingMinutes.vue';
import { samplePressReleaseData } from '../src/forme/blocks/press-release/press-release.sample.ts';
import PressRelease from '../src/forme/blocks/press-release/PressRelease.vue';

function collectText(nodes: FormeNode[]): string {
  const parts: string[] = [];
  const pending = [...nodes];
  while (pending.length > 0) {
    const node = pending.pop();
    if (!node) continue;
    if (node.kind.type === 'Text') {
      parts.push(node.kind.content);
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
}

test('serializes event-agenda with sample data', async () => {
  const document = await serialize(EventAgenda, {
    props: { data: sampleEventAgendaData },
  });
  const text = collectText(document.children);

  expect(text).toContain('React Summit 2026');
  expect(text).toContain('Amsterdam Convention Center');
  expect(text).toContain('Opening Keynote: The Next Decade of React');
  expect(text).toContain('Coffee & Networking Break');
  expect(text).toContain('Day 1 of 2');
});

test('serializes event-ticket with sample data', async () => {
  const document = await serialize(EventTicket, {
    props: { data: sampleEventTicketData },
  });
  const text = collectText(document.children);

  expect(text).toContain('ShadCN Labs Conf');
  expect(text).toContain('TKT-00142');
  expect(text).toContain('Convention Center');
  expect(text).toContain('VIP');
  expect(text).toContain('Admit one');
});

test('serializes gift-certificate with sample data', async () => {
  const document = await serialize(GiftCertificate, {
    props: { data: sampleGiftCertificateData },
  });
  const text = collectText(document.children);

  expect(text).toContain('Gift Certificate');
  expect(text).toContain('Harbor Roasters');
  expect(text).toContain('$50.00');
  expect(text).toContain('PDFCN-GC-2026-00891');
  expect(text).toContain('Sarah');
});

test('serializes press-release with sample data', async () => {
  const document = await serialize(PressRelease, {
    props: { data: samplePressReleaseData },
  });
  const text = collectText(document.children);

  expect(text).toContain('Acme Corp Launches Revolutionary PDF Toolkit for Developers');
  expect(text).toContain('Acme Corp');
  expect(text).toContain('For Immediate Release');
  expect(text).toContain('Press Team');
});

test('serializes lesson-plan with sample data', async () => {
  const document = await serialize(LessonPlan, {
    props: { data: sampleLessonPlanData },
  });
  const text = collectText(document.children);

  expect(text).toContain('Introduction to Linear Equations');
  expect(text).toContain('Mathematics');
  expect(text).toContain('Ms. Johnson');
  expect(text).toContain('Guided Practice');
});

test('serializes medical-intake-form with sample data', async () => {
  const document = await serialize(MedicalIntakeForm, {
    props: { data: sampleMedicalIntakeFormData },
  });
  const text = collectText(document.children);

  expect(text).toContain('Riverside Family Clinic');
  expect(text).toContain('Patient Intake Form');
  expect(text).toContain('Patient Information');
  expect(text).toContain('Consent & Authorization');
});

test('serializes meeting-minutes with sample data', async () => {
  const document = await serialize(MeetingMinutes, {
    props: { data: sampleMeetingMinutesData },
  });
  const text = collectText(document.children);

  expect(text).toContain('Q3 Product Roadmap Review');
  expect(text).toContain('Conference Room B / Zoom');
  expect(text).toContain('Q2 Outcomes');
  expect(text).toContain('Create pdfme integration RFC');
});

test('renders event-agenda to a valid PDF', async () => {
  const document = await serialize(EventAgenda, {
    props: { data: sampleEventAgendaData },
  });
  await expectValidPdf({ ...document });
});

test('renders press-release to a valid PDF', async () => {
  const document = await serialize(PressRelease, {
    props: { data: samplePressReleaseData },
  });
  await expectValidPdf({ ...document });
});

test('renders meeting-minutes to a valid PDF', async () => {
  const document = await serialize(MeetingMinutes, {
    props: { data: sampleMeetingMinutesData },
  });
  await expectValidPdf({ ...document });
});

test('renders medical-intake-form to a valid PDF', async () => {
  const document = await serialize(MedicalIntakeForm, {
    props: { data: sampleMedicalIntakeFormData },
  });
  await expectValidPdf({ ...document });
});

test('renders lesson-plan to a valid PDF', async () => {
  const document = await serialize(LessonPlan, {
    props: { data: sampleLessonPlanData },
  });
  await expectValidPdf({ ...document });
});

test('renders gift-certificate to a valid PDF', async () => {
  const document = await serialize(GiftCertificate, {
    props: { data: sampleGiftCertificateData },
  });
  await expectValidPdf({ ...document });
});

test('renders event-ticket to a valid PDF', async () => {
  const document = await serialize(EventTicket, {
    props: { data: sampleEventTicketData },
  });
  await expectValidPdf({ ...document });
});
