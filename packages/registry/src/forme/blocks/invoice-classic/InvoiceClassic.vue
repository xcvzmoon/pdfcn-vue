<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { InvoiceClassicData } from './invoice-classic.types.ts';
  import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import KeyValue from '../../components/KeyValue.vue';
  import PageFooter from '../../components/PageFooter.vue';
  import PageHeader from '../../components/PageHeader.vue';
  import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
  import PdfImage from '../../components/PdfImage.vue';
  import Section from '../../components/Section.vue';
  import Table from '../../components/Table.vue';
  import TableBody from '../../components/TableBody.vue';
  import TableCell from '../../components/TableCell.vue';
  import TableHeader from '../../components/TableHeader.vue';
  import TableRow from '../../components/TableRow.vue';
  import Text from '../../components/Text.vue';
  import { usePdfcnTheme } from '../../lib/theme.ts';
  import { formatCurrency } from '../shared/format.ts';
  import { sampleInvoiceClassicData } from './invoice-classic.sample.ts';

  const props = defineProps<{
    data?: InvoiceClassicData | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const invoice = computed(() => props.data ?? sampleInvoiceClassicData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  const pageMargin = { bottom: 25, left: 56, right: 56, top: 56 };

  const styles = computed(() => {
    const current = activeTheme.value;
    const label: Style = {
      color: current.colors.mutedForeground,
      fontSize: 9,
      fontWeight: 700,
      marginBottom: 2,
      textTransform: 'uppercase',
    };

    return {
      column: {
        flex: 1,
        paddingRight: 15,
      } satisfies Style,
      label,
      page: {
        backgroundColor: current.colors.background,
      } satisfies Style,
      summaryRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
      } satisfies Style,
      summaryColumn: {
        width: 220,
      } satisfies Style,
    };
  });

  const summaryItems = computed(() => [
    { key: 'Subtotal', value: formatCurrency(invoice.value.summary.subtotal) },
    { key: 'Tax', value: formatCurrency(invoice.value.summary.tax) },
    {
      key: 'Total',
      keyStyle: { fontSize: 12, fontWeight: 700 },
      value: formatCurrency(invoice.value.summary.total),
      valueStyle: { fontSize: 12, fontWeight: 700 },
    },
  ]);

  const documentTitle = computed(() => `Invoice ${invoice.value.invoiceNumber}`);
  const footerRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);
  const logoSrc = computed(() => invoice.value.logo ?? '/favicon.png');
  const headerRight = computed(() => invoice.value.invoiceNumber);
  const headerRightSub = computed(() => `Due: ${invoice.value.dueDate}`);
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page
        size="A4"
        :margin="pageMargin"
      >
        <PageFooter
          :left-text="invoice.notes"
          :right-text="footerRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <PageHeader
            variant="logo-left"
            :title="invoice.companyName"
            :subtitle="invoice.subtitle"
            :right-text="headerRight"
            :right-sub-text="headerRightSub"
            :style="{ marginBottom: 0 }"
          >
            <template #logo>
              <PdfImage
                :src="logoSrc"
                :style="{ margin: 0 }"
              />
            </template>
          </PageHeader>
          <Section
            no-wrap
            :style="{ flexDirection: 'row' }"
          >
            <View :style="styles.column">
              <Text
                no-margin
                :style="styles.label"
                >From</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ invoice.companyName }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ invoice.companyAddress }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ invoice.companyEmail }}</Text
              >
            </View>
            <View :style="styles.column">
              <Text
                no-margin
                :style="styles.label"
                >Bill To</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ invoice.billTo.name }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ invoice.billTo.address }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ invoice.billTo.email }}</Text
              >
            </View>
            <View :style="styles.column">
              <Text
                no-margin
                :style="styles.label"
                >Payment Terms</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ invoice.paymentTerms.method }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ invoice.paymentTerms.gst }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ invoice.paymentTerms.dueDate }}</Text
              >
            </View>
          </Section>
          <Table
            variant="grid"
            zebra-stripe
          >
            <TableHeader>
              <TableRow header>
                <TableCell text="Description" />
                <TableCell
                  align="center"
                  text="QTY"
                />
                <TableCell
                  align="center"
                  text="Rate"
                />
                <TableCell
                  align="right"
                  text="Total"
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="(item, index) in invoice.items"
                :key="index"
              >
                <TableCell :text="item.description" />
                <TableCell
                  align="center"
                  :text="`${item.quantity}`"
                />
                <TableCell
                  align="center"
                  :text="formatCurrency(item.unitPrice)"
                />
                <TableCell
                  align="right"
                  :text="formatCurrency(item.quantity * item.unitPrice)"
                />
              </TableRow>
            </TableBody>
          </Table>
          <View :style="styles.summaryRow">
            <View :style="styles.summaryColumn">
              <KeyValue
                size="sm"
                divided
                :divider-thickness="1"
                :items="summaryItems"
              />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
