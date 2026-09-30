<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { BadgeVariant } from '../../components/badge.types.ts';
  import type { KeyValueEntry } from '../../components/key-value.types.ts';
  import type { SignatureSigner } from '../../components/signature.types.ts';
  import type { WorkOrderData, WorkOrderPriority } from './work-order.types.ts';
  import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import Badge from '../../components/Badge.vue';
  import KeyValue from '../../components/KeyValue.vue';
  import PageFooter from '../../components/PageFooter.vue';
  import PageHeader from '../../components/PageHeader.vue';
  import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
  import PdfImage from '../../components/PdfImage.vue';
  import Section from '../../components/Section.vue';
  import Signature from '../../components/Signature.vue';
  import Table from '../../components/Table.vue';
  import TableBody from '../../components/TableBody.vue';
  import TableCell from '../../components/TableCell.vue';
  import TableHeader from '../../components/TableHeader.vue';
  import TableRow from '../../components/TableRow.vue';
  import Text from '../../components/Text.vue';
  import { usePdfcnTheme } from '../../lib/theme.ts';
  import { formatCurrency, formatHours } from '../shared/format.ts';
  import { sampleWorkOrderData } from './work-order.sample.ts';

  const props = defineProps<{
    data?: WorkOrderData | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const workOrder = computed(() => props.data ?? sampleWorkOrderData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  const PRIORITY_BADGE_VARIANT: Record<WorkOrderPriority, BadgeVariant> = {
    High: 'warning',
    Low: 'default',
    Medium: 'info',
    Urgent: 'destructive',
  };

  const styles = computed(() => {
    const current = activeTheme.value;

    return {
      checkbox: {
        borderColor: current.colors.foreground,
        borderWidth: 1,
        height: 10,
        width: 10,
      } satisfies Style,
      checkboxRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
        marginTop: current.spacing.componentGap,
      } satisfies Style,
      col: {
        flex: 1,
        paddingRight: 15,
      } satisfies Style,
      label: {
        fontSize: 9,
        fontWeight: 700,
        marginBottom: 2,
      } satisfies Style,
      page: {
        backgroundColor: current.colors.background,
      } satisfies Style,
      row: {
        flexDirection: 'row',
      } satisfies Style,
      section: {
        marginBottom: current.spacing.componentGap,
      } satisfies Style,
      sectionSpaced: {
        marginBottom: current.spacing.componentGap,
        marginTop: current.spacing.componentGap,
      } satisfies Style,
      signature: {
        marginBottom: 0,
        marginTop: 0,
      } satisfies Style,
    };
  });

  const totals = computed(() => {
    const data = workOrder.value;
    let partsTotal = 0;
    for (const part of data.parts) {
      partsTotal += part.qty * part.unitPrice;
    }
    let laborTotal = 0;
    for (const item of data.labor) {
      laborTotal += item.hours * item.rate;
    }
    const taxRate = data.taxRate ?? 0;
    const tax = (partsTotal + laborTotal) * taxRate;
    const grandTotal = partsTotal + laborTotal + tax;
    return { grandTotal, laborTotal, partsTotal, tax, taxRate };
  });

  const summaryItems = computed(() => {
    const current = totals.value;
    const items: KeyValueEntry[] = [
      { key: 'Parts Total', value: formatCurrency(current.partsTotal) },
      { key: 'Labor Total', value: formatCurrency(current.laborTotal) },
      {
        key: `Tax (${(current.taxRate * 100).toFixed(2)}%)`,
        value: formatCurrency(current.tax),
      },
      {
        key: 'Grand Total',
        keyStyle: { fontSize: 12, fontWeight: 700 },
        value: formatCurrency(current.grandTotal),
        valueStyle: { fontSize: 12, fontWeight: 700 },
      },
    ];
    return items;
  });

  const signers = computed<[SignatureSigner, SignatureSigner]>(() => [
    { date: workOrder.value.date, label: 'Customer Signature' },
    {
      date: workOrder.value.date,
      label: 'Technician Signature',
      name: workOrder.value.technician,
    },
  ]);

  const documentTitle = computed(() => `Work Order ${workOrder.value.workOrderNumber}`);
  const footerRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);
  const headerRight = computed(() => `WO #${workOrder.value.workOrderNumber}`);
  const headerRightSub = computed(() => `Date: ${workOrder.value.date}`);
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page
        :margin="{
          bottom: activeTheme.spacing.page.marginBottom,
          left: activeTheme.spacing.page.marginLeft,
          right: activeTheme.spacing.page.marginRight,
          top: activeTheme.spacing.page.marginTop,
        }"
        size="A4"
      >
        <PageFooter
          :left-text="workOrder.warrantyInfo"
          :right-text="footerRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <PageHeader
            variant="logo-left"
            :title="workOrder.companyName"
            subtitle="Work Order"
            :right-text="headerRight"
            :right-sub-text="headerRightSub"
            :style="styles.section"
          >
            <template
              v-if="workOrder.companyLogo"
              #logo
            >
              <PdfImage
                :src="workOrder.companyLogo"
                :style="{ margin: 0 }"
              />
            </template>
          </PageHeader>

          <Section
            no-wrap
            spacing="none"
            :style="{
              ...styles.row,
              ...styles.section,
              alignItems: 'center',
              justifyContent: 'space-between',
            }"
          >
            <View :style="{ alignItems: 'center', flexDirection: 'row', gap: 8 }">
              <Text
                no-margin
                :style="{ fontSize: 9, fontWeight: 700 }"
                color="mutedForeground"
                transform="uppercase"
              >
                Priority
              </Text>
              <Badge
                :label="workOrder.priority"
                :variant="PRIORITY_BADGE_VARIANT[workOrder.priority]"
                size="sm"
              />
            </View>
            <Badge
              :label="workOrder.jobType"
              variant="outline"
              size="sm"
            />
          </Section>

          <Section
            no-wrap
            spacing="none"
            :style="{ ...styles.row, ...styles.section }"
          >
            <View :style="styles.col">
              <Text
                no-margin
                :style="styles.label"
                color="mutedForeground"
                transform="uppercase"
              >
                Customer
              </Text>
              <Text
                no-margin
                variant="xs"
                >{{ workOrder.customer.name }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ workOrder.customer.address }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ workOrder.customer.phone }}</Text
              >
              <Text
                v-if="workOrder.customer.email"
                no-margin
                variant="xs"
              >
                {{ workOrder.customer.email }}
              </Text>
              <Text
                v-if="workOrder.customer.accountNumber"
                no-margin
                variant="xs"
              >
                {{ `Acct #: ${workOrder.customer.accountNumber}` }}
              </Text>
            </View>
            <View :style="styles.col">
              <Text
                no-margin
                :style="styles.label"
                color="mutedForeground"
                transform="uppercase"
              >
                Job Info
              </Text>
              <Text
                no-margin
                variant="xs"
              >
                {{ `Technician: ${workOrder.technician}` }}
              </Text>
              <Text
                no-margin
                variant="xs"
              >
                {{ `Job Type: ${workOrder.jobType}` }}
              </Text>
            </View>
            <View :style="styles.col">
              <Text
                no-margin
                :style="styles.label"
                color="mutedForeground"
                transform="uppercase"
              >
                Equipment
              </Text>
              <Text
                no-margin
                variant="xs"
                >{{ workOrder.equipment.description }}</Text
              >
              <Text
                v-if="workOrder.equipment.makeModel"
                no-margin
                variant="xs"
              >
                {{ workOrder.equipment.makeModel }}
              </Text>
              <Text
                v-if="workOrder.equipment.serialNumber"
                no-margin
                variant="xs"
              >
                {{ `S/N: ${workOrder.equipment.serialNumber}` }}
              </Text>
              <Text
                v-if="workOrder.equipment.location"
                no-margin
                variant="xs"
              >
                {{ `Location: ${workOrder.equipment.location}` }}
              </Text>
            </View>
          </Section>

          <Section spacing="none">
            <Text
              no-margin
              :style="styles.label"
              color="mutedForeground"
              transform="uppercase"
            >
              Parts Used
            </Text>
            <Table
              variant="grid"
              zebra-stripe
            >
              <TableHeader>
                <TableRow header>
                  <TableCell text="Part #" />
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
                    text="Total"
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(part, index) in workOrder.parts"
                  :key="index"
                >
                  <TableCell :text="part.partNumber" />
                  <TableCell :text="part.description" />
                  <TableCell
                    align="center"
                    :text="`${part.qty}`"
                  />
                  <TableCell
                    align="right"
                    :text="formatCurrency(part.unitPrice)"
                  />
                  <TableCell
                    align="right"
                    :text="formatCurrency(part.qty * part.unitPrice)"
                  />
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          <Section spacing="none">
            <Text
              no-margin
              :style="styles.label"
              color="mutedForeground"
              transform="uppercase"
            >
              Labor
            </Text>
            <Table
              variant="grid"
              zebra-stripe
            >
              <TableHeader>
                <TableRow header>
                  <TableCell text="Description" />
                  <TableCell text="Technician" />
                  <TableCell
                    align="center"
                    text="Hours"
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
                  v-for="(item, index) in workOrder.labor"
                  :key="index"
                >
                  <TableCell :text="item.description" />
                  <TableCell :text="item.technician" />
                  <TableCell
                    align="center"
                    :text="formatHours(item.hours)"
                  />
                  <TableCell
                    align="right"
                    :text="formatCurrency(item.rate)"
                  />
                  <TableCell
                    align="right"
                    :text="formatCurrency(item.hours * item.rate)"
                  />
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          <Section
            no-wrap
            spacing="none"
            :style="{ ...styles.row, ...styles.section }"
          >
            <View :style="{ flex: 1, paddingRight: 15 }">
              <View v-if="workOrder.technicianNotes">
                <Text
                  no-margin
                  :style="styles.label"
                  color="mutedForeground"
                  transform="uppercase"
                >
                  Technician Notes
                </Text>
                <Text
                  no-margin
                  variant="xs"
                  >{{ workOrder.technicianNotes }}</Text
                >
              </View>
            </View>
            <View :style="{ marginLeft: 'auto', width: 200 }">
              <KeyValue
                size="sm"
                :divider-thickness="1"
                :items="summaryItems"
                divided
              />
            </View>
          </Section>

          <Section
            v-if="workOrder.customerNotes"
            spacing="none"
            :style="styles.sectionSpaced"
          >
            <Text
              no-margin
              :style="styles.label"
              color="mutedForeground"
              transform="uppercase"
            >
              Customer Notes
            </Text>
            <Text
              no-margin
              variant="xs"
              >{{ workOrder.customerNotes }}</Text
            >
          </Section>

          <Section spacing="none">
            <Signature
              variant="double"
              :signers="signers"
              :style="styles.signature"
            />
            <View :style="styles.checkboxRow">
              <View :style="styles.checkbox" />
              <Text
                no-margin
                variant="xs"
              >
                Customer approves work performed and charges above
              </Text>
            </View>
          </Section>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
