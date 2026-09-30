<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { KeyValueEntry } from '../../components/key-value.types.ts';
  import type { PackingSlipProps, PackingSlipSender } from './packing-slip.types.ts';
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
  import { samplePackingSlipData } from './packing-slip.sample.ts';

  const props = defineProps<{
    data?: PackingSlipProps | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const packingSlip = computed(() => props.data ?? samplePackingSlipData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  const pageMargin = { bottom: 25, left: 56, right: 56, top: 56 };

  function formatAddress(party: PackingSlipSender & { country?: string | undefined }): string {
    return `${party.address}, ${party.city}, ${party.state} ${party.zip}${
      party.country ? `, ${party.country}` : ''
    }`;
  }

  const styles = computed(() => {
    const current = activeTheme.value;

    return {
      columnHeading: {
        fontSize: 9,
        fontWeight: 700,
        marginBottom: 2,
      } satisfies Style,
      page: {
        backgroundColor: current.colors.background,
      } satisfies Style,
    };
  });

  const totals = computed(() => {
    let totalPacked = 0;
    let totalOrdered = 0;
    for (const item of packingSlip.value.items) {
      totalPacked += item.qtyPacked;
      totalOrdered += item.qtyOrdered;
    }
    return { totalOrdered, totalPacked };
  });

  const summaryItems = computed(() => {
    const data = packingSlip.value;
    const items: KeyValueEntry[] = [
      {
        key: 'Items Packed',
        value: `${totals.value.totalPacked} of ${totals.value.totalOrdered}`,
      },
    ];
    if (data.totalPackages !== undefined) {
      items.push({ key: 'Packages', value: `${data.totalPackages}` });
    }
    if (data.totalWeight) {
      items.push({ key: 'Total Weight', value: data.totalWeight });
    }
    return items;
  });

  const documentTitle = computed(() => `Packing Slip ${packingSlip.value.orderNumber}`);
  const footerRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);
  const headerRightSub = computed(() => `Order Date: ${packingSlip.value.orderDate}`);
  const showFooterNotes = computed(
    () => Boolean(packingSlip.value.thankYouMessage) || Boolean(packingSlip.value.returnsPolicy),
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
          :left-text="packingSlip.customerService ?? packingSlip.companyName"
          :right-text="footerRight"
          sticky
          :page-padding="25"
        />
        <View :style="styles.page">
          <PageHeader
            variant="logo-left"
            title="PACKING SLIP"
            :subtitle="packingSlip.companyName"
            :right-text="packingSlip.orderNumber"
            :right-sub-text="headerRightSub"
            :margin-bottom="0"
          >
            <template
              v-if="packingSlip.companyLogo"
              #logo
            >
              <PdfImage
                :src="packingSlip.companyLogo"
                :style="{ margin: 0 }"
              />
            </template>
          </PageHeader>
          <Section
            no-wrap
            :style="{ flexDirection: 'row' }"
          >
            <View :style="{ flex: 1, paddingRight: 15 }">
              <Text
                no-margin
                :style="styles.columnHeading"
                color="mutedForeground"
                transform="uppercase"
              >
                Ship To
              </Text>
              <Text
                no-margin
                variant="xs"
                >{{ packingSlip.shipTo.name }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ formatAddress(packingSlip.shipTo) }}</Text
              >
              <Text
                v-if="packingSlip.shipTo.phone"
                no-margin
                variant="xs"
              >
                {{ packingSlip.shipTo.phone }}
              </Text>
            </View>
            <View :style="{ flex: 1, paddingRight: 15 }">
              <Text
                no-margin
                :style="styles.columnHeading"
                color="mutedForeground"
                transform="uppercase"
              >
                From
              </Text>
              <Text
                no-margin
                variant="xs"
                >{{ packingSlip.shipFrom.name }}</Text
              >
              <Text
                no-margin
                variant="xs"
                >{{ formatAddress(packingSlip.shipFrom) }}</Text
              >
            </View>
            <View :style="{ flex: 1, paddingRight: 15 }">
              <Text
                no-margin
                :style="styles.columnHeading"
                color="mutedForeground"
                transform="uppercase"
              >
                Order
              </Text>
              <Text
                no-margin
                variant="xs"
                >{{ packingSlip.orderNumber }}</Text
              >
              <Text
                v-if="packingSlip.poNumber"
                no-margin
                variant="xs"
              >
                {{ `PO: ${packingSlip.poNumber}` }}
              </Text>
            </View>
          </Section>
          <Table
            variant="grid"
            zebra-stripe
          >
            <TableHeader>
              <TableRow header>
                <TableCell text="Item" />
                <TableCell
                  align="center"
                  text="SKU"
                />
                <TableCell
                  align="center"
                  text="Packed"
                />
                <TableCell
                  align="center"
                  text="Ordered"
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
                v-for="item in packingSlip.items"
                :key="item.sku"
              >
                <TableCell :text="item.name" />
                <TableCell
                  align="center"
                  :text="item.sku"
                />
                <TableCell
                  align="center"
                  :text="`${item.qtyPacked}`"
                />
                <TableCell
                  align="center"
                  :text="`${item.qtyOrdered}`"
                />
                <TableCell
                  align="right"
                  :text="formatCurrency(item.unitPrice)"
                />
                <TableCell
                  align="right"
                  :text="formatCurrency(item.qtyPacked * item.unitPrice)"
                />
              </TableRow>
            </TableBody>
          </Table>
          <Section
            no-wrap
            :style="{ flexDirection: 'row', marginTop: 16 }"
          >
            <View :style="{ flex: 1, paddingRight: 15 }">
              <Text
                no-margin
                :style="styles.columnHeading"
                color="mutedForeground"
                transform="uppercase"
              >
                Shipping
              </Text>
              <Text
                no-margin
                variant="xs"
              >
                {{ `${packingSlip.shipping.carrier} — ${packingSlip.shipping.method}` }}
              </Text>
              <Text
                no-margin
                variant="xs"
              >
                {{ `Tracking: ${packingSlip.shipping.trackingNumber}` }}
              </Text>
              <Text
                v-if="packingSlip.shipping.estimatedDelivery"
                no-margin
                variant="xs"
              >
                {{ `Est. Delivery: ${packingSlip.shipping.estimatedDelivery}` }}
              </Text>
            </View>
            <View :style="{ marginLeft: 'auto', width: 220 }">
              <KeyValue
                size="sm"
                :divider-thickness="1"
                :items="summaryItems"
                divided
              />
            </View>
          </Section>
          <Section
            v-if="showFooterNotes"
            spacing="sm"
            variant="highlight"
            :accent-color="packingSlip.accentColor ?? 'primary'"
          >
            <Text
              v-if="packingSlip.thankYouMessage"
              variant="sm"
              weight="medium"
              no-margin
            >
              {{ packingSlip.thankYouMessage }}
            </Text>
            <Text
              v-if="packingSlip.returnsPolicy"
              variant="xs"
              color="mutedForeground"
              no-margin
            >
              {{ packingSlip.returnsPolicy }}
            </Text>
          </Section>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
