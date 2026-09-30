<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { InvoiceMinimalData } from './invoice-minimal.types.ts';
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
  import { sampleInvoiceMinimalData } from './invoice-minimal.sample.ts';

  const props = defineProps<{
    data?: InvoiceMinimalData | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const invoice = computed(() => props.data ?? sampleInvoiceMinimalData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  const pageMargin = { bottom: 25, left: 56, right: 56, top: 56 };

  const styles = computed(() => {
    const current = activeTheme.value;
    const baseLabel: Style = {
      fontSize: 8,
      fontWeight: 700,
      letterSpacing: 0.8,
      marginBottom: 4,
      textTransform: 'uppercase',
    };

    return {
      column: {
        paddingRight: 20,
        width: 251,
      } satisfies Style,
      detailsColumn: {
        width: 232,
      } satisfies Style,
      infoLabel: {
        ...baseLabel,
        color: current.colors.primary,
      } satisfies Style,
      infoRow: {
        flexDirection: 'row',
        marginBottom: 28,
      } satisfies Style,
      invoiceStamp: {
        alignSelf: 'flex-start',
        borderColor: current.colors.primary,
        borderRadius: current.primitives.borderRadius.sm,
        borderWidth: 2,
        paddingHorizontal: 12,
        paddingVertical: 8,
      } satisfies Style,
      page: {
        backgroundColor: current.colors.background,
      } satisfies Style,
      stampDate: {
        color: current.colors.mutedForeground,
        fontSize: 8,
        textAlign: 'right',
      } satisfies Style,
      stampLabel: {
        color: current.colors.primary,
        fontSize: 7,
        fontWeight: 700,
        textAlign: 'right',
      } satisfies Style,
      stampNumber: {
        color: current.colors.foreground,
        fontSize: 14,
        fontWeight: 700,
        textAlign: 'right',
      } satisfies Style,
      summaryColumn: {
        width: 240,
      } satisfies Style,
      summaryRow: {
        flexDirection: 'row',
        marginTop: 20,
      } satisfies Style,
      summarySpacer: {
        flex: 1,
      } satisfies Style,
    };
  });

  const detailItems = computed(() => [
    { key: 'Due Date', value: invoice.value.dueDate },
    { key: 'Payment', value: invoice.value.paymentTerms.method },
    { key: 'GST', value: invoice.value.paymentTerms.gst },
  ]);

  const summaryItems = computed(() => {
    const current = activeTheme.value;
    return [
      { key: 'Subtotal', value: formatCurrency(invoice.value.summary.subtotal) },
      { key: 'Tax (7%)', value: formatCurrency(invoice.value.summary.tax) },
      {
        key: 'Balance Due',
        keyStyle: { fontSize: 12, fontWeight: 700 },
        value: formatCurrency(invoice.value.summary.total),
        valueStyle: {
          color: current.colors.primary,
          fontSize: 13,
          fontWeight: 700,
        },
      },
    ];
  });

  const documentTitle = computed(() => `Invoice ${invoice.value.invoiceNumber}`);
  const footerRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);
  const companySubtitle = computed(
    () => `${invoice.value.companyAddress}  ·  ${invoice.value.companyEmail}`,
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
          <Section
            no-wrap
            :style="{
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginBottom: activeTheme.spacing.sectionGap,
            }"
          >
            <View :style="{ flex: 1 }">
              <PageHeader
                variant="minimal"
                :title="invoice.companyName"
                :subtitle="companySubtitle"
                :margin-bottom="0"
              />
            </View>
            <View :style="styles.invoiceStamp">
              <Text
                no-margin
                transform="uppercase"
                :style="styles.stampLabel"
                >Invoice</Text
              >
              <Text
                no-margin
                :style="styles.stampNumber"
              >
                {{ invoice.invoiceNumber }}
              </Text>
              <Text
                no-margin
                :style="styles.stampDate"
                >{{ invoice.invoiceDate }}</Text
              >
            </View>
          </Section>
          <View :style="styles.infoRow">
            <View :style="styles.column">
              <Text
                no-margin
                :style="styles.infoLabel"
                >Bill To</Text
              >
              <Text
                variant="sm"
                no-margin
                >{{ invoice.billTo.name }}</Text
              >
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
            <View :style="styles.detailsColumn">
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
          </View>
          <Table variant="compact">
            <TableHeader>
              <TableRow header>
                <TableCell text="Description" />
                <TableCell
                  align="center"
                  text="Qty"
                />
                <TableCell
                  align="right"
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
          <View :style="styles.summaryRow">
            <View :style="styles.summarySpacer" />
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
