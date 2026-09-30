<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { ShippingLabelAddress, ShippingLabelData } from './shipping-label.types.ts';
  import { Document, Page, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
  import PdfImage from '../../components/PdfImage.vue';
  import QrCode from '../../components/QrCode.vue';
  import Text from '../../components/Text.vue';
  import { resolveColor } from '../../lib/resolve-color.ts';
  import { usePdfcnTheme } from '../../lib/theme.ts';
  import { sampleShippingLabelData } from './shipping-label.sample.ts';

  const props = defineProps<{
    data?: ShippingLabelData | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const label = computed(() => props.data ?? sampleShippingLabelData);
  const fallbackTheme = usePdfcnTheme();
  const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

  // Standard 4" x 6" shipping label, expressed in PDF points (72 dpi)
  const LABEL_SIZE = { height: 432, width: 288 };

  // Quiet zone kept clear of the printed label frame, plus the frame itself
  const LABEL_MARGIN = 8;
  const LABEL_BORDER = 2;
  const LABEL_PADDING = 10;

  // Forme scales an image with the Image element's own width/height (style
  // dimensions only size the box), so the barcode is measured in points from
  // the label's content box instead of a percentage width.
  const BARCODE_WIDTH = LABEL_SIZE.width - 2 * (LABEL_MARGIN + LABEL_BORDER + LABEL_PADDING);
  const BARCODE_HEIGHT = 72;

  function formatCityLine(party: ShippingLabelAddress): string {
    const cityStateZip = `${party.city}, ${party.state} ${party.zip}`;
    return party.country ? `${cityStateZip}, ${party.country}` : cityStateZip;
  }

  const accent = computed(() =>
    resolveColor(
      label.value.accentColor ?? activeTheme.value.colors.primary,
      activeTheme.value.colors,
    ),
  );

  const detailRows = computed(() => {
    const data = label.value;
    const rows: { key: string; value: string }[] = [];
    if (data.weight) {
      rows.push({ key: 'Weight', value: data.weight });
    }
    if (data.dimensions) {
      rows.push({ key: 'Dimensions', value: data.dimensions });
    }
    if (data.packageCount !== undefined) {
      rows.push({ key: 'Packages', value: `${data.packageCount}` });
    }
    rows.push({ key: 'Postage', value: data.postage ?? 'PAID' });
    return rows;
  });

  const styles = computed(() => {
    const current = activeTheme.value;

    return {
      addresses: {
        flex: 1,
        flexDirection: 'row',
      } satisfies Style,
      badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
      } satisfies Style,
      barcodeArea: {
        alignItems: 'center',
        marginTop: 10,
      } satisfies Style,
      carrierName: {
        fontSize: 16,
        fontWeight: 700,
      } satisfies Style,
      fromColumn: {
        flex: 1,
        paddingLeft: 12,
      } satisfies Style,
      handlingTag: {
        alignItems: 'center',
        backgroundColor: current.colors.foreground,
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
      } satisfies Style,
      handlingTagText: {
        color: current.colors.background,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: 'uppercase',
      } satisfies Style,
      headerRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      } satisfies Style,
      label: {
        borderColor: current.colors.foreground,
        borderWidth: LABEL_BORDER,
        flex: 1,
        padding: LABEL_PADDING,
      } satisfies Style,
      page: {
        backgroundColor: current.colors.background,
        flex: 1,
        flexDirection: 'column',
        height: LABEL_SIZE.height - LABEL_MARGIN * 2,
        overflow: 'hidden',
      } satisfies Style,
      rule: {
        backgroundColor: current.colors.foreground,
        height: 2,
        marginVertical: 6,
      } satisfies Style,
      sectionLabel: {
        color: accent.value,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 1,
        marginBottom: 4,
        textTransform: 'uppercase',
      } satisfies Style,
      serviceRight: {
        alignItems: 'flex-end',
      } satisfies Style,
      shipToColumn: {
        borderRightColor: current.colors.foreground,
        borderRightWidth: 2,
        flex: 1.4,
        paddingRight: 12,
      } satisfies Style,
      table: {
        borderColor: current.colors.foreground,
        borderWidth: 2,
      } satisfies Style,
      tableKey: {
        color: current.colors.mutedForeground,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        width: 84,
      } satisfies Style,
      tableRow: {
        alignItems: 'center',
        borderBottomColor: current.colors.border,
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 3,
      } satisfies Style,
      tableRowLast: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 3,
      } satisfies Style,
      tableValue: {
        flex: 1,
      } satisfies Style,
      trackingText: {
        fontWeight: 700,
        letterSpacing: 2,
        marginTop: 6,
        textTransform: 'uppercase',
      } satisfies Style,
    };
  });

  const documentTitle = computed(() => `Shipping Label ${label.value.trackingNumber}`);
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page
        :size="LABEL_SIZE"
        :margin="LABEL_MARGIN"
      >
        <View :style="styles.page">
          <View :style="styles.label">
            <View :style="styles.headerRow">
              <Text
                no-margin
                :style="styles.carrierName"
                >{{ label.carrier }}</Text
              >
              <View :style="styles.serviceRight">
                <Text
                  no-margin
                  :style="styles.sectionLabel"
                  >{{ label.serviceLevel }}</Text
                >
              </View>
            </View>

            <View :style="styles.rule" />

            <View :style="styles.addresses">
              <View :style="styles.shipToColumn">
                <Text
                  no-margin
                  :style="styles.sectionLabel"
                  >Ship To</Text
                >
                <View>
                  <Text
                    no-margin
                    variant="xs"
                    weight="bold"
                    >{{ label.to.name }}</Text
                  >
                  <Text
                    no-margin
                    variant="xs"
                    >{{ label.to.address }}</Text
                  >
                  <Text
                    no-margin
                    variant="xs"
                    >{{ formatCityLine(label.to) }}</Text
                  >
                  <Text
                    v-if="label.to.phone"
                    no-margin
                    variant="xs"
                    color="mutedForeground"
                  >
                    {{ label.to.phone }}
                  </Text>
                </View>
              </View>
              <View :style="styles.fromColumn">
                <Text
                  no-margin
                  :style="styles.sectionLabel"
                  >From</Text
                >
                <View>
                  <Text
                    no-margin
                    variant="xs"
                    weight="bold"
                    >{{ label.from.name }}</Text
                  >
                  <Text
                    no-margin
                    variant="xs"
                    >{{ label.from.address }}</Text
                  >
                  <Text
                    no-margin
                    variant="xs"
                    >{{ formatCityLine(label.from) }}</Text
                  >
                </View>
              </View>
            </View>

            <View :style="styles.rule" />

            <View :style="styles.table">
              <View
                v-for="(row, index) in detailRows"
                :key="row.key"
                :style="index === detailRows.length - 1 ? styles.tableRowLast : styles.tableRow"
              >
                <Text
                  no-margin
                  :style="styles.tableKey"
                  >{{ row.key }}</Text
                >
                <Text
                  no-margin
                  :style="styles.tableValue"
                  variant="xs"
                >
                  {{ row.value }}
                </Text>
              </View>
            </View>

            <View
              v-if="label.handlingLabels && label.handlingLabels.length > 0"
              :style="styles.badgesRow"
            >
              <View
                v-for="(handlingLabel, index) in label.handlingLabels"
                :key="`${handlingLabel}-${index}`"
                :style="styles.handlingTag"
              >
                <Text
                  no-margin
                  :style="styles.handlingTagText"
                  >{{ handlingLabel }}</Text
                >
              </View>
            </View>

            <View :style="styles.barcodeArea">
              <PdfImage
                v-if="label.barcodeUrl"
                :src="label.barcodeUrl"
                :width="BARCODE_WIDTH"
                :height="BARCODE_HEIGHT"
              />
              <QrCode
                v-else
                :value="label.trackingNumber"
                :size="80"
                color="#000000"
                background-color="#ffffff"
              />
              <Text
                no-margin
                :style="styles.trackingText"
                variant="xs"
                weight="bold"
              >
                {{ label.trackingNumber }}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
