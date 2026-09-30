<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
import type { InvoiceModernData } from './invoice-modern.types.ts';
import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
import { computed } from 'vue';
import KeyValue from '../../components/KeyValue.vue';
import PageFooter from '../../components/PageFooter.vue';
import PageHeader from '../../components/PageHeader.vue';
import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
import Section from '../../components/Section.vue';
import Table from '../../components/Table.vue';
import TableBody from '../../components/TableBody.vue';
import TableCell from '../../components/TableCell.vue';
import TableHeader from '../../components/TableHeader.vue';
import TableRow from '../../components/TableRow.vue';
import Text from '../../components/Text.vue';
import { usePdfcnTheme } from '../../lib/theme.ts';
import { formatCurrency } from '../shared/format.ts';
import { sampleInvoiceModernData } from './invoice-modern.sample.ts';

const props = defineProps<{
  data?: InvoiceModernData | undefined;
  theme?: PdfcnTheme | undefined;
}>();

const invoice = computed(() => props.data ?? sampleInvoiceModernData);
const fallbackTheme = usePdfcnTheme();
const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

const pageMargin = { bottom: 25, left: 56, right: 56, top: 56 };

const styles = computed(() => {
  const current = activeTheme.value;
  return {
    dividerCol: {
      backgroundColor: current.colors.border,
      marginRight: 12,
      width: 1,
    } satisfies Style,
    metaCol: {
      flex: 1,
      paddingRight: 12,
    } satisfies Style,
    metaLabel: {
      color: current.colors.mutedForeground,
      fontSize: 8,
      fontWeight: 700,
      letterSpacing: 0.5,
      marginBottom: 3,
      textTransform: 'uppercase',
    } satisfies Style,
    metaRow: {
      flexDirection: 'row',
      marginBottom: current.spacing.sectionGap,
    } satisfies Style,
    metaValue: {
      color: current.colors.foreground,
      fontSize: 9,
    } satisfies Style,
    metaValueBold: {
      color: current.colors.foreground,
      fontSize: 9,
      fontWeight: 700,
    } satisfies Style,
    metaValueMuted: {
      color: current.colors.mutedForeground,
      fontSize: 9,
    } satisfies Style,
    page: {
      backgroundColor: current.colors.background,
    } satisfies Style,
    paymentColumn: {
      flex: 1,
      paddingRight: 20,
    } satisfies Style,
    summaryColumn: {
      width: 220,
    } satisfies Style,
    summaryRow: {
      flexDirection: 'row',
      marginTop: 16,
    } satisfies Style,
  };
});

const summaryItems = computed(() => [
  { key: 'Subtotal', value: formatCurrency(invoice.value.summary.subtotal) },
  { key: 'Tax (7%)', value: formatCurrency(invoice.value.summary.tax) },
  {
    key: 'Total Due',
    keyStyle: { fontSize: 12, fontWeight: 700 },
    value: formatCurrency(invoice.value.summary.total),
    valueStyle: { fontSize: 12, fontWeight: 700 },
  },
]);

const documentTitle = computed(() => `Invoice ${invoice.value.invoiceNumber}`);
const footerRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);
const companySubtitle = computed(
  () =>
    `${invoice.value.subtitle}  ·  ${invoice.value.companyAddress}  ·  ${invoice.value.companyEmail}`,
);
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page size="A4" :margin="pageMargin">
        <PageFooter
          :left-text="invoice.notes"
          :right-text="footerRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <PageHeader variant="branded" :title="invoice.companyName" :subtitle="companySubtitle" />
          <View :style="styles.metaRow">
            <View :style="styles.metaCol">
              <Text no-margin :style="styles.metaLabel">Invoice Number</Text>
              <Text no-margin :style="styles.metaValueBold">
                {{ invoice.invoiceNumber }}
              </Text>
            </View>
            <View :style="styles.metaCol">
              <Text no-margin :style="styles.metaLabel">Invoice Date</Text>
              <Text no-margin :style="styles.metaValue">{{ invoice.invoiceDate }}</Text>
            </View>
            <View :style="styles.metaCol">
              <Text no-margin :style="styles.metaLabel">Due Date</Text>
              <Text no-margin :style="styles.metaValue">{{ invoice.dueDate }}</Text>
            </View>
            <View :style="styles.dividerCol" />
            <View :style="{ flex: 2 }">
              <Text no-margin :style="styles.metaLabel">Billed To</Text>
              <Text no-margin :style="styles.metaValueBold">{{ invoice.billTo.name }}</Text>
              <Text no-margin :style="styles.metaValueMuted">
                {{ invoice.billTo.address }}
              </Text>
              <Text no-margin :style="styles.metaValueMuted">
                {{ invoice.billTo.email }}
              </Text>
              <Text no-margin :style="styles.metaValueMuted">
                {{ invoice.billTo.phone }}
              </Text>
            </View>
          </View>
          <Table variant="primary-header">
            <TableHeader>
              <TableRow header>
                <TableCell text="Description" />
                <TableCell align="center" text="Qty" />
                <TableCell align="right" text="Unit Price" />
                <TableCell align="right" text="Amount" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(item, index) in invoice.items" :key="index">
                <TableCell :text="item.description" />
                <TableCell align="center" :text="`${item.quantity}`" />
                <TableCell align="right" :text="formatCurrency(item.unitPrice)" />
                <TableCell align="right" :text="formatCurrency(item.quantity * item.unitPrice)" />
              </TableRow>
            </TableBody>
          </Table>
          <Section no-wrap :style="styles.summaryRow">
            <View :style="styles.paymentColumn">
              <Text no-margin :style="styles.metaLabel">Payment Method</Text>
              <Text no-margin variant="xs">{{ invoice.paymentTerms.method }}</Text>
              <Text no-margin variant="xs" color="mutedForeground">
                {{ invoice.paymentTerms.gst }}
              </Text>
            </View>
            <View :style="styles.summaryColumn">
              <KeyValue size="sm" divided :divider-thickness="1" :items="summaryItems" />
            </View>
          </Section>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
