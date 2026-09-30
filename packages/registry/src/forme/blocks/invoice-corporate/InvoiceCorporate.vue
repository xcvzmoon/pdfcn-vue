<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { InvoiceCorporateData } from './invoice-corporate.types.ts';
  import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import KeyValue from '../../components/KeyValue.vue';
  import PageFooter from '../../components/PageFooter.vue';
  import PageHeader from '../../components/PageHeader.vue';
  import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
  import PdfImage from '../../components/PdfImage.vue';
  import Table from '../../components/Table.vue';
  import TableBody from '../../components/TableBody.vue';
  import TableCell from '../../components/TableCell.vue';
  import TableHeader from '../../components/TableHeader.vue';
  import TableRow from '../../components/TableRow.vue';
  import Text from '../../components/Text.vue';
  import { usePdfcnTheme } from '../../lib/theme.ts';
  import { formatCurrency } from '../shared/format.ts';
  import { sampleInvoiceCorporateData } from './invoice-corporate.sample.ts';

  const props = defineProps<{
    data?: InvoiceCorporateData | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const invoice = computed(() => props.data ?? sampleInvoiceCorporateData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  const pageMargin = { bottom: 25, left: 56, right: 56, top: 56 };

  const styles = computed(() => {
    const current = activeTheme.value;
    return {
      infoColumn: {
        flex: 1,
      } satisfies Style,
      infoGrid: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: current.spacing.sectionGap,
      } satisfies Style,
      infoLabel: {
        color: current.colors.mutedForeground,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 0.6,
        marginBottom: 6,
        textTransform: 'uppercase',
      } satisfies Style,
      page: {
        backgroundColor: current.colors.background,
      } satisfies Style,
      summaryCard: {
        backgroundColor: current.colors.muted,
        borderRadius: current.primitives.borderRadius.md,
        marginTop: 20,
        padding: 16,
      } satisfies Style,
      summaryRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      } satisfies Style,
      summaryColumn: {
        width: 260,
      } satisfies Style,
    };
  });

  const detailItems = computed(() => [
    { key: 'Invoice #', value: invoice.value.invoiceNumber },
    { key: 'Issue Date', value: invoice.value.invoiceDate },
    { key: 'Due Date', value: invoice.value.dueDate },
    { key: 'Payment', value: invoice.value.paymentTerms.method },
  ]);

  const summaryItems = computed(() => {
    const current = activeTheme.value;
    return [
      { key: 'Subtotal', value: formatCurrency(invoice.value.summary.subtotal) },
      { key: 'Tax (8%)', value: formatCurrency(invoice.value.summary.tax) },
      {
        key: 'Total Due',
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
  const logoSrc = computed(() => invoice.value.logo ?? '/favicon.png');
  const companySubtitle = computed(
    () => `${invoice.value.subtitle}  ·  ${invoice.value.companyAddress}`,
  );
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
            variant="logo-right"
            :title="invoice.companyName"
            :subtitle="companySubtitle"
            :style="{ marginBottom: activeTheme.spacing.sectionGap }"
          >
            <template #logo>
              <PdfImage
                :src="logoSrc"
                :width="56"
                :height="56"
                :style="{ margin: 0 }"
              />
            </template>
          </PageHeader>
          <View :style="styles.infoGrid">
            <View :style="styles.infoColumn">
              <Text
                no-margin
                :style="styles.infoLabel"
                >Invoice Details</Text
              >
              <KeyValue
                size="sm"
                :items="detailItems"
              />
            </View>
            <View :style="styles.infoColumn">
              <Text
                no-margin
                :style="styles.infoLabel"
                >Bill To</Text
              >
              <Text
                variant="sm"
                weight="semibold"
                no-margin
              >
                {{ invoice.billTo.name }}
              </Text>
              <Text
                variant="xs"
                no-margin
                color="mutedForeground"
              >
                {{ invoice.billTo.address }}
              </Text>
              <Text
                variant="xs"
                no-margin
                color="mutedForeground"
              >
                {{ invoice.billTo.email }}
              </Text>
              <Text
                variant="xs"
                no-margin
                color="mutedForeground"
              >
                {{ invoice.billTo.phone }}
              </Text>
            </View>
          </View>
          <Table variant="bordered">
            <TableHeader>
              <TableRow header>
                <TableCell text="Description" />
                <TableCell
                  align="center"
                  text="Qty"
                />
                <TableCell
                  align="right"
                  text="Unit Price"
                />
                <TableCell
                  align="right"
                  text="Amount"
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
                  align="right"
                  :text="formatCurrency(item.unitPrice)"
                />
                <TableCell
                  align="right"
                  :text="formatCurrency(item.quantity * item.unitPrice)"
                />
              </TableRow>
            </TableBody>
          </Table>
          <View :style="styles.summaryCard">
            <View :style="styles.summaryRow">
              <View :style="styles.summaryColumn">
                <KeyValue
                  size="md"
                  divided
                  :divider-thickness="1"
                  divider-color="border"
                  :items="summaryItems"
                />
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
