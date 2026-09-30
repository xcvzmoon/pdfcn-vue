<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
import type { InvoiceConsultantData } from './invoice-consultant.types.ts';
import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
import { computed } from 'vue';
import KeyValue from '../../components/KeyValue.vue';
import PageFooter from '../../components/PageFooter.vue';
import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
import Section from '../../components/Section.vue';
import Table from '../../components/Table.vue';
import TableBody from '../../components/TableBody.vue';
import TableCell from '../../components/TableCell.vue';
import TableHeader from '../../components/TableHeader.vue';
import TableRow from '../../components/TableRow.vue';
import Text from '../../components/Text.vue';
import { usePdfcnTheme } from '../../lib/theme.ts';
import { formatCurrency, formatHours } from '../shared/format.ts';
import { sampleInvoiceConsultantData } from './invoice-consultant.sample.ts';

const props = defineProps<{
  data?: InvoiceConsultantData | undefined;
  theme?: PdfcnTheme | undefined;
}>();

const invoice = computed(() => props.data ?? sampleInvoiceConsultantData);
const fallbackTheme = usePdfcnTheme();
const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

const pageMargin = { bottom: 25, left: 56, right: 56, top: 56 };

const styles = computed(() => {
  const current = activeTheme.value;
  return {
    calloutNote: {
      backgroundColor: current.colors.muted,
      borderLeftColor: current.colors.info,
      borderLeftWidth: 3,
      marginTop: 16,
      paddingLeft: 12,
      paddingVertical: 8,
    } satisfies Style,
    companyInfo: {
      flex: 1,
    } satisfies Style,
    headerRow: {
      alignItems: 'flex-start',
      borderBottomColor: current.colors.primary,
      borderBottomWidth: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: current.spacing.sectionGap,
      paddingBottom: current.spacing.componentGap,
    } satisfies Style,
    hoursBadge: {
      alignSelf: 'flex-start',
      backgroundColor: current.colors.primary,
      borderRadius: current.primitives.borderRadius.sm,
      paddingHorizontal: 12,
      paddingVertical: 8,
    } satisfies Style,
    hoursBadgeText: {
      color: current.colors.primaryForeground,
      fontSize: 9,
      fontWeight: 700,
    } satisfies Style,
    hoursBox: {
      flex: 1,
      paddingRight: 24,
    } satisfies Style,
    invoiceInfo: {
      alignItems: 'flex-end',
    } satisfies Style,
    page: {
      backgroundColor: current.colors.background,
    } satisfies Style,
    partiesRow: {
      flexDirection: 'row',
      gap: 40,
      marginBottom: current.spacing.sectionGap,
    } satisfies Style,
    partyColumn: {
      flex: 1,
    } satisfies Style,
    partyLabel: {
      borderBottomColor: current.colors.border,
      borderBottomWidth: 1,
      color: current.colors.primary,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 0.6,
      marginBottom: 6,
      paddingBottom: 4,
      textTransform: 'uppercase',
    } satisfies Style,
    projectRef: {
      alignItems: 'center',
      backgroundColor: current.colors.muted,
      borderRadius: current.primitives.borderRadius.sm,
      flexDirection: 'row',
      gap: 8,
      marginBottom: current.spacing.sectionGap,
      paddingHorizontal: 10,
      paddingVertical: 6,
    } satisfies Style,
    summaryRow: {
      flexDirection: 'row',
      marginTop: 20,
    } satisfies Style,
    totalsBox: {
      width: 250,
    } satisfies Style,
  };
});

const summaryItems = computed(() => {
  const current = activeTheme.value;
  return [
    { key: 'Subtotal', value: formatCurrency(invoice.value.summary.subtotal) },
    { key: 'Tax (5%)', value: formatCurrency(invoice.value.summary.tax) },
    {
      key: 'Amount Due',
      keyStyle: { fontSize: 13, fontWeight: 700 },
      value: formatCurrency(invoice.value.summary.total),
      valueStyle: {
        color: current.colors.primary,
        fontSize: 14,
        fontWeight: 700,
      },
    },
  ];
});

const documentTitle = computed(() => `Invoice ${invoice.value.invoiceNumber}`);
const footerRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);
const dueLabel = computed(() => `Due: ${invoice.value.dueDate}`);
const totalHoursLabel = computed(
  () => `Total Hours: ${formatHours(invoice.value.summary.totalHours)}`,
);
const paymentLabel = computed(() => `Payment: ${invoice.value.paymentTerms.method}`);
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page size="A4" :margin="pageMargin">
        <PageFooter
          left-text="Professional services invoice – Please retain for records"
          :right-text="footerRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <View :style="styles.headerRow">
            <View :style="styles.companyInfo">
              <Text variant="xl" weight="bold" no-margin>{{ invoice.companyName }}</Text>
              <Text variant="sm" color="mutedForeground" no-margin>
                {{ invoice.subtitle }}
              </Text>
              <Text variant="xs" color="mutedForeground" no-margin>
                {{ invoice.companyAddress }}
              </Text>
            </View>
            <View :style="styles.invoiceInfo">
              <Text variant="xs" color="mutedForeground" transform="uppercase" no-margin>
                Invoice
              </Text>
              <Text variant="lg" weight="bold" no-margin>
                {{ invoice.invoiceNumber }}
              </Text>
              <Text variant="xs" color="mutedForeground" no-margin>
                {{ invoice.invoiceDate }}
              </Text>
              <Text variant="xs" color="mutedForeground" no-margin>
                {{ dueLabel }}
              </Text>
            </View>
          </View>
          <View v-if="invoice.projectRef" :style="styles.projectRef">
            <Text variant="xs" weight="semibold" color="mutedForeground" no-margin>
              Project Reference:
            </Text>
            <Text variant="xs" weight="bold" no-margin>{{ invoice.projectRef }}</Text>
          </View>
          <View :style="styles.partiesRow">
            <View :style="styles.partyColumn">
              <Text no-margin :style="styles.partyLabel">From (Consultant)</Text>
              <Text variant="sm" weight="semibold" no-margin>
                {{ invoice.consultant.name }}
              </Text>
              <Text variant="xs" no-margin color="mutedForeground">
                {{ invoice.consultant.title }}
              </Text>
              <Text variant="xs" no-margin color="mutedForeground">
                {{ invoice.consultant.email }}
              </Text>
            </View>
            <View :style="styles.partyColumn">
              <Text no-margin :style="styles.partyLabel">Bill To (Client)</Text>
              <Text variant="sm" weight="semibold" no-margin>
                {{ invoice.client.name }}
              </Text>
              <Text variant="xs" no-margin color="mutedForeground">
                {{ invoice.client.company }}
              </Text>
              <Text variant="xs" no-margin color="mutedForeground">
                {{ invoice.client.address }}
              </Text>
              <Text variant="xs" no-margin color="mutedForeground">
                {{ invoice.client.email }}
              </Text>
            </View>
          </View>
          <Table variant="line">
            <TableHeader>
              <TableRow header>
                <TableCell text="Service Description" />
                <TableCell align="center" text="Hours" />
                <TableCell align="right" text="Rate ($/hr)" />
                <TableCell align="right" text="Amount" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(service, index) in invoice.services" :key="index">
                <TableCell :text="service.description" />
                <TableCell align="center" :text="`${service.hours}`" />
                <TableCell align="right" :text="formatCurrency(service.rate)" />
                <TableCell align="right" :text="formatCurrency(service.hours * service.rate)" />
              </TableRow>
            </TableBody>
          </Table>
          <Section no-wrap :style="styles.summaryRow">
            <View :style="styles.hoursBox">
              <View :style="styles.hoursBadge">
                <Text no-margin :style="styles.hoursBadgeText">
                  {{ totalHoursLabel }}
                </Text>
              </View>
              <Text variant="xs" color="mutedForeground" :style="{ marginTop: 8 }">
                {{ paymentLabel }}
              </Text>
            </View>
            <View :style="styles.totalsBox">
              <KeyValue size="sm" divided :divider-thickness="1" :items="summaryItems" />
            </View>
          </Section>
          <View v-if="invoice.notes" :style="styles.calloutNote">
            <Text variant="xs" color="mutedForeground">{{ invoice.notes }}</Text>
          </View>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
