<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
import type { MedicalIntakeFormProps } from './medical-intake-form.types.ts';
import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
import { computed } from 'vue';
import PageFooter from '../../components/PageFooter.vue';
import PageHeader from '../../components/PageHeader.vue';
import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
import PdfForm from '../../components/PdfForm.vue';
import PdfImage from '../../components/PdfImage.vue';
import PdfList from '../../components/PdfList.vue';
import Section from '../../components/Section.vue';
import Signature from '../../components/Signature.vue';
import Table from '../../components/Table.vue';
import TableBody from '../../components/TableBody.vue';
import TableCell from '../../components/TableCell.vue';
import TableHeader from '../../components/TableHeader.vue';
import TableRow from '../../components/TableRow.vue';
import Text from '../../components/Text.vue';
import { resolveColor } from '../../lib/resolve-color.ts';
import { usePdfcnTheme } from '../../lib/theme.ts';
import { sampleMedicalIntakeFormData } from './medical-intake-form.sample.ts';

const props = defineProps<{
  data?: MedicalIntakeFormProps | undefined;
  theme?: PdfcnTheme | undefined;
}>();

const intake = computed(() => props.data ?? sampleMedicalIntakeFormData);
const fallbackTheme = usePdfcnTheme();
const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

const FORM_VERSION = 'Form v1.0 · Revised 09/2026';
const FORM_STYLE: Style = { marginBottom: 0 };
const SECOND_PAGE_MARGIN_BOTTOM = 44;
const SECOND_PAGE_MARGIN_TOP = 24;

const MEDICAL_CONDITIONS = [
  'Diabetes',
  'High Blood Pressure',
  'Heart Disease',
  'Asthma',
  'COPD',
  'Cancer',
  'Stroke',
  'Thyroid Disorder',
  'Kidney Disease',
  'Liver Disease',
  'Seizures / Epilepsy',
  'Other',
];

const CONSENT_ACKNOWLEDGMENTS = [
  { checked: false, text: 'I have read and understand the consent above.' },
  { checked: false, text: 'I have received the Notice of Privacy Practices.' },
];

const MEDICATION_ROW_COUNT = 4;
const ALLERGY_ROW_COUNT = 3;

function blankChecklist(labels: string[]): { checked: boolean; text: string }[] {
  return labels.map((text) => ({ checked: false, text }));
}

const personalInfoGroups = [
  {
    fields: [
      { height: 14, label: 'Full Name' },
      { height: 14, hint: 'DD / MM / YYYY', label: 'Date of Birth' },
      { height: 14, label: 'Gender' },
      { height: 14, hint: '+1 (555) 000-0000', label: 'Phone Number' },
      { height: 14, label: 'Email Address' },
    ],
    layout: 'two-column' as const,
    title: 'Patient Information',
  },
  {
    fields: [
      { height: 14, label: 'Street Address', width: '100%' as const },
      { height: 14, label: 'City' },
      { height: 14, label: 'State / Province' },
      { height: 14, label: 'Postal Code' },
    ],
    layout: 'two-column' as const,
    title: 'Address',
  },
];

const emergencyContactGroups = [
  {
    fields: [
      { height: 14, label: 'Emergency Contact Name' },
      { height: 14, label: 'Relationship' },
      { height: 14, label: 'Phone Number' },
    ],
    layout: 'two-column' as const,
    title: 'Emergency Contact',
  },
];

const insuranceGroups = [
  {
    fields: [
      { height: 14, label: 'Insurance Provider' },
      { height: 14, label: 'Policy Number' },
      { height: 14, label: 'Group Number' },
      { height: 14, label: 'Subscriber Name' },
    ],
    layout: 'two-column' as const,
    title: 'Insurance',
  },
];

const medicationRows = Array.from({ length: MEDICATION_ROW_COUNT }, (_, index) => index);
const allergyRows = Array.from({ length: ALLERGY_ROW_COUNT }, (_, index) => index);
const conditionColumns = [
  MEDICAL_CONDITIONS.slice(0, 4),
  MEDICAL_CONDITIONS.slice(4, 8),
  MEDICAL_CONDITIONS.slice(8),
];

const accent = computed(() => {
  const current = activeTheme.value;
  const value = intake.value.accentColor;
  return value ? resolveColor(value, current.colors) : current.colors.primary;
});

const sections = computed(() => {
  const data = intake.value;
  return {
    allergies: data.allergies ?? true,
    consent: data.consent ?? true,
    emergencyContact: data.emergencyContact ?? true,
    insurance: data.insurance ?? true,
    medicalHistory: data.medicalHistory ?? true,
    medications: data.medications ?? true,
    personalInfo: data.personalInfo ?? true,
    reasonForVisit: data.reasonForVisit ?? true,
  };
});

const hasSecondPage = computed(() => {
  const s = sections.value;
  return s.allergies || s.consent || s.medications || s.reasonForVisit;
});

const styles = computed(() => {
  const current = activeTheme.value;
  return {
    blankCell: {
      minHeight: 14,
    } satisfies Style,
    column: { flex: 1 } satisfies Style,
    consentText: {
      fontSize: current.primitives.typography.xs,
      lineHeight: 1.4,
      marginBottom: 6,
    } satisfies Style,
    labelText: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 0.6,
    } satisfies Style,
    page: { backgroundColor: current.colors.background } satisfies Style,
    pageTwoHeader: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    } satisfies Style,
    reasonBox: {
      borderColor: current.colors.border,
      borderRadius: current.primitives.borderRadius.sm,
      borderWidth: 1,
      height: 40,
      minHeight: 40,
    } satisfies Style,
    row: { flexDirection: 'row', gap: 20 } satisfies Style,
    section: { marginBottom: 4 } satisfies Style,
    sectionRule: {
      borderBottomColor: accent.value,
      borderBottomWidth: 1,
      marginBottom: 4,
      paddingBottom: 2,
    } satisfies Style,
    signature: { marginBottom: 0, marginTop: 8 } satisfies Style,
    title: { fontSize: 13, fontWeight: 700 } satisfies Style,
  };
});

const firstPageMargin = computed(() => {
  const current = activeTheme.value;
  return {
    bottom: current.spacing.page.marginBottom,
    left: current.spacing.page.marginLeft,
    right: current.spacing.page.marginRight,
    top: current.spacing.page.marginTop,
  };
});

const secondPageMargin = computed(() => {
  const current = activeTheme.value;
  return {
    bottom: SECOND_PAGE_MARGIN_BOTTOM,
    left: current.spacing.page.marginLeft,
    right: current.spacing.page.marginRight,
    top: SECOND_PAGE_MARGIN_TOP,
  };
});

const documentTitle = computed(() => `${intake.value.clinicName} — Patient Intake Form`);
const pageFooterRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);
const continuedTitle = computed(
  () => `${intake.value.clinicName} — Patient Intake Form (continued)`,
);
const consentText = computed(
  () =>
    `I authorize ${intake.value.clinicName} to provide treatment and to release the information required to process insurance claims for this visit, and I acknowledge that I have received the Notice of Privacy Practices (HIPAA) explaining how my health information may be used.`,
);
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page :margin="firstPageMargin" size="A4">
        <PageFooter
          :address="intake.clinicAddress"
          :left-text="FORM_VERSION"
          :phone="intake.clinicPhone"
          :right-text="pageFooterRight"
          sticky
          variant="three-column"
          :page-padding="firstPageMargin.bottom"
        />
        <View :style="styles.page">
          <PageHeader
            variant="logo-left"
            :title="intake.clinicName"
            subtitle="Patient Intake Form"
            :right-text="intake.clinicPhone"
            :right-sub-text="intake.clinicAddress"
            :margin-bottom="16"
          >
            <template v-if="intake.clinicLogo" #logo>
              <PdfImage :height="48" :src="intake.clinicLogo" :style="{ margin: 0 }" :width="48" />
            </template>
          </PageHeader>
          <PdfForm
            v-if="sections.personalInfo"
            :groups="personalInfoGroups"
            :style="FORM_STYLE"
            variant="underline"
          />
          <PdfForm
            v-if="sections.emergencyContact"
            :groups="emergencyContactGroups"
            :style="FORM_STYLE"
            variant="underline"
          />
          <PdfForm
            v-if="sections.insurance"
            :groups="insuranceGroups"
            :style="FORM_STYLE"
            variant="underline"
          />
        </View>
      </Page>

      <Page v-if="hasSecondPage" :margin="secondPageMargin" size="A4">
        <PageFooter
          :address="intake.clinicAddress"
          :left-text="FORM_VERSION"
          :phone="intake.clinicPhone"
          :right-text="pageFooterRight"
          sticky
          variant="three-column"
          :page-padding="secondPageMargin.bottom"
        />
        <View :style="styles.page">
          <View :style="styles.pageTwoHeader">
            <Text no-margin :style="styles.title">{{ continuedTitle }}</Text>
            <Text v-if="intake.clinicPhone" color="mutedForeground" variant="xs" no-margin>
              {{ intake.clinicPhone }}
            </Text>
          </View>

          <View v-if="sections.medicalHistory" :style="styles.section">
            <View :style="styles.sectionRule">
              <Text no-margin :style="styles.labelText" transform="uppercase">
                Medical History
              </Text>
            </View>
            <View :style="styles.row">
              <View v-for="(column, index) in conditionColumns" :key="index" :style="styles.column">
                <PdfList gap="xs" :items="blankChecklist(column)" variant="checklist" />
              </View>
            </View>
          </View>

          <View v-if="sections.medications" :style="styles.section">
            <View :style="styles.sectionRule">
              <Text no-margin :style="styles.labelText" transform="uppercase">
                Current Medications
              </Text>
            </View>
            <Table variant="grid">
              <TableHeader>
                <TableRow header>
                  <TableCell text="Medication" />
                  <TableCell text="Dosage" />
                  <TableCell text="Frequency" />
                  <TableCell text="Prescribing Doctor" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="row in medicationRows" :key="`medication-${row}`">
                  <TableCell><View :style="styles.blankCell" /></TableCell>
                  <TableCell><View :style="styles.blankCell" /></TableCell>
                  <TableCell><View :style="styles.blankCell" /></TableCell>
                  <TableCell><View :style="styles.blankCell" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </View>

          <View v-if="sections.allergies" :style="styles.section">
            <View :style="styles.sectionRule">
              <Text no-margin :style="styles.labelText" transform="uppercase">Allergies</Text>
            </View>
            <Table variant="grid">
              <TableHeader>
                <TableRow header>
                  <TableCell text="Allergen" />
                  <TableCell text="Reaction" />
                  <TableCell text="Severity" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="row in allergyRows" :key="`allergy-${row}`">
                  <TableCell><View :style="styles.blankCell" /></TableCell>
                  <TableCell><View :style="styles.blankCell" /></TableCell>
                  <TableCell><View :style="styles.blankCell" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </View>

          <View v-if="sections.reasonForVisit" :style="styles.section">
            <View :style="styles.sectionRule">
              <Text no-margin :style="styles.labelText" transform="uppercase">
                Reason for Visit
              </Text>
            </View>
            <View :style="styles.reasonBox" />
          </View>

          <View v-if="sections.consent" :style="styles.section">
            <View :style="styles.sectionRule">
              <Text no-margin :style="styles.labelText" transform="uppercase">
                Consent & Authorization
              </Text>
            </View>
            <Section
              :accent-color="intake.accentColor ?? 'primary'"
              padding="sm"
              spacing="none"
              variant="highlight"
            >
              <Text color="mutedForeground" no-margin :style="styles.consentText">
                {{ consentText }}
              </Text>
              <PdfList gap="xs" :items="CONSENT_ACKNOWLEDGMENTS" variant="checklist" />
            </Section>
            <Signature
              variant="double"
              :signers="[{ label: 'Patient / Guardian Signature' }, { label: 'Date' }]"
              :style="styles.signature"
            />
          </View>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
