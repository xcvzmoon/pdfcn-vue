<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { InvoiceCreativeData } from './invoice-creative.types.ts';
  import { Document, Page, View } from '@formepdf/vue';
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
  import { sampleInvoiceCreativeData } from './invoice-creative.sample.ts';

  const props = defineProps<{
    data?: InvoiceCreativeData | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const invoice = computed(() => props.data ?? sampleInvoiceCreativeData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  const pageMargin = { bottom: 25, left: 56, right: 56, top: 56 };

  const styles = computed(() => {
    const current = activeTheme.value;
    return {
      accentBlock: {
        backgroundColor: current.colors.muted,
        borderLeftColor: current.colors.accent,
        borderLeftWidth: 4,
        marginBottom: current.spacing.sectionGap,
        paddingLeft: 14,
        paddingVertical: 10,
      } satisfies Style,
      badgeLabel: {
        color: current.colors.primaryForeground,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 1.2,
        marginBottom: 2,
        textTransform: 'uppercase',
      } satisfies Style,
      badgeNumber: {
        color: current.colors.primaryForeground,
        fontSize: 16,
        fontWeight: 700,
      } satisfies Style,
      heroSection: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: current.spacing.sectionGap,
      } satisfies Style,
      infoColumn: {
        flex: 1,
      } satisfies Style,
      infoGrid: {
        flexDirection: 'row',
        gap: 32,
      } satisfies Style,
      invoiceBadge: {
        alignItems: 'center',
        backgroundColor: current.colors.primary,
        borderRadius: current.primitives.borderRadius.md,
        paddingHorizontal: 20,
        paddingVertical: 14,
      } satisfies Style,
      page: {
        backgroundColor: current.colors.background,
      } satisfies Style,
      sectionLabel: {
        color: current.colors.accent,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 0.8,
        marginBottom: 6,
        textTransform: 'uppercase',
      } satisfies Style,
      summaryLeft: {
        flex: 1,
        paddingRight: 20,
      } satisfies Style,
      summaryRight: {
        backgroundColor: current.colors.muted,
        borderRadius: current.primitives.borderRadius.sm,
        padding: 14,
        width: 240,
      } satisfies Style,
      summarySection: {
        flexDirection: 'row',
        marginTop: 24,
      } satisfies Style,
    };
  });

  const infoItems = computed(() => [
    { key: 'Issue Date', value: invoice.value.invoiceDate },
    { key: 'Due Date', value: invoice.value.dueDate },
    { key: 'Payment', value: invoice.value.paymentTerms.method },
  ]);

  const summaryItems = computed(() => {
    const current = activeTheme.value;
    return [
      { key: 'Subtotal', value: formatCurrency(invoice.value.summary.subtotal) },
      { key: 'Tax (6.5%)', value: formatCurrency(invoice.value.summary.tax) },
      {
        key: 'Total',
        keyStyle: { fontSize: 13, fontWeight: 700 },
        value: formatCurrency(invoice.value.summary.total),
        valueStyle: {
          color: current.colors.accent,
          fontSize: 14,
          fontWeight: 700,
        },
      },
    ];
  });

  const documentTitle = computed(() => `Invoice ${invoice.value.invoiceNumber}`);
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
          variant="centered"
          center-text="Thank you for choosing us for your creative needs!"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <View :style="styles.heroSection">
            <View :style="{ flex: 1 }">
              <PageHeader
                variant="centered"
                :title="invoice.companyName"
                :subtitle="companySubtitle"
                :margin-bottom="0"
              />
            </View>
            <View :style="styles.invoiceBadge">
              <Text
                no-margin
                :style="styles.badgeLabel"
                >Invoice</Text
              >
              <Text
                no-margin
                :style="styles.badgeNumber"
              >
                {{ invoice.invoiceNumber }}
              </Text>
            </View>
          </View>
          <View :style="styles.accentBlock">
            <View :style="styles.infoGrid">
              <View :style="styles.infoColumn">
                <Text
                  no-margin
                  :style="styles.sectionLabel"
                  >Billed To</Text
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
                  {{ invoice.billTo.email }} · {{ invoice.billTo.phone }}
                </Text>
              </View>
              <View :style="styles.infoColumn">
                <Text
                  no-margin
                  :style="styles.sectionLabel"
                  >Invoice Info</Text
                >
                <KeyValue
                  size="sm"
                  :items="infoItems"
                />
              </View>
            </View>
          </View>
          <Table
            variant="striped"
            zebra-stripe
          >
            <TableHeader>
              <TableRow header>
                <TableCell text="Deliverable" />
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
          <Section
            no-wrap
            :style="styles.summarySection"
          >
            <View :style="styles.summaryLeft">
              <Text
                no-margin
                :style="styles.sectionLabel"
                >Notes & Terms</Text
              >
              <Text
                variant="xs"
                color="mutedForeground"
                >{{ invoice.notes }}</Text
              >
              <Text
                variant="xs"
                color="mutedForeground"
                :style="{ marginTop: 4 }"
              >
                GST: {{ invoice.paymentTerms.gst }}
              </Text>
            </View>
            <View :style="styles.summaryRight">
              <KeyValue
                size="sm"
                divided
                :divider-thickness="1"
                :items="summaryItems"
              />
            </View>
          </Section>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
