<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
import type { GiftCertificateData } from './gift-certificate.types.ts';
import { Document, Page, View } from '@formepdf/vue';
import { computed } from 'vue';
import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
import PdfImage from '../../components/PdfImage.vue';
import Section from '../../components/Section.vue';
import Text from '../../components/Text.vue';
import { usePdfcnTheme } from '../../lib/theme.ts';
import { sampleGiftCertificateData } from './gift-certificate.sample.ts';

const props = defineProps<{
  data?: GiftCertificateData | undefined;
  theme?: PdfcnTheme | undefined;
}>();

const certificate = computed(() => props.data ?? sampleGiftCertificateData);
const fallbackTheme = usePdfcnTheme();
const activeTheme = computed(() => props.theme ?? fallbackTheme.value);

const accentColor = computed(() => certificate.value.accentColor || '#000000');
const currencySymbol = computed(() => {
  const currency = certificate.value.currency;
  if (currency === 'USD') return '$';
  return currency || '$';
});
const amountLabel = computed(() => `${currencySymbol.value}${certificate.value.amount.toFixed(2)}`);

const styles = computed(() => {
  const current = activeTheme.value;
  const accent = accentColor.value;
  return {
    amount: {
      color: accent,
      fontSize: 36,
      fontWeight: 700,
    } satisfies Style,
    amountContainer: {
      alignItems: 'center',
      backgroundColor: current.colors.muted,
      borderColor: accent,
      borderRadius: current.primitives.borderRadius.md,
      borderWidth: 2,
      marginBottom: 10,
      marginTop: 10,
      paddingHorizontal: 20,
      paddingVertical: 12,
    } satisfies Style,
    code: {
      color: current.colors.foreground,
      fontFamily: 'Courier',
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 1.2,
    } satisfies Style,
    codeBox: {
      alignItems: 'center',
      backgroundColor: current.colors.background,
      borderColor: current.colors.border,
      borderRadius: current.primitives.borderRadius.sm,
      borderWidth: 1,
      marginBottom: 8,
      marginTop: 8,
      paddingHorizontal: 14,
      paddingVertical: 8,
    } satisfies Style,
    companyName: {
      color: current.colors.foreground,
      fontSize: 13,
      fontWeight: 500,
      marginTop: 4,
      textAlign: 'center',
    } satisfies Style,
    decorativeBorder: {
      borderColor: accent,
      borderRadius: current.primitives.borderRadius.lg,
      borderWidth: 3,
      padding: 16,
    } satisfies Style,
    expiry: {
      color: accent,
      fontSize: 12,
      fontWeight: 700,
    } satisfies Style,
    fieldLabel: {
      color: current.colors.mutedForeground,
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 4,
      textTransform: 'uppercase',
    } satisfies Style,
    fieldValue: {
      color: current.colors.foreground,
      fontSize: 14,
      fontWeight: 500,
    } satisfies Style,
    header: {
      alignItems: 'center',
      marginBottom: 8,
    } satisfies Style,
    innerBorder: {
      borderColor: accent,
      borderRadius: current.primitives.borderRadius.md,
      borderWidth: 1,
      padding: 18,
    } satisfies Style,
    instructions: {
      color: current.colors.foreground,
      fontSize: 9,
      lineHeight: 1.3,
      textAlign: 'center',
    } satisfies Style,
    logo: {
      height: 28,
      marginBottom: 6,
      width: 28,
    } satisfies Style,
    message: {
      color: current.colors.foreground,
      fontSize: 10,
      fontStyle: 'italic',
      lineHeight: 1.4,
      textAlign: 'center',
    } satisfies Style,
    messageBox: {
      backgroundColor: current.colors.muted,
      borderRadius: current.primitives.borderRadius.sm,
      marginBottom: 8,
      marginTop: 8,
      padding: 10,
    } satisfies Style,
    page: {
      backgroundColor: current.colors.background,
    } satisfies Style,
    peopleRow: {
      flexDirection: 'row',
      gap: 28,
      marginBottom: 8,
    } satisfies Style,
    termsText: {
      color: current.colors.mutedForeground,
      fontSize: 8,
      lineHeight: 1.4,
      textAlign: 'center',
    } satisfies Style,
    title: {
      color: accent,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: 2,
      textAlign: 'center',
      textTransform: 'uppercase',
    } satisfies Style,
  };
});

const documentTitle = computed(() => `Gift Certificate ${certificate.value.certificateCode}`);
</script>

<template>
  <PdfcnThemeProvider :theme="activeTheme">
    <Document :title="documentTitle">
      <Page size="A4" :margin="24">
        <View :style="styles.page">
          <View :style="styles.decorativeBorder">
            <View :style="styles.innerBorder">
              <Section no-wrap :style="styles.header">
                <PdfImage
                  v-if="certificate.companyLogo"
                  :src="certificate.companyLogo"
                  :style="styles.logo"
                />
                <Text :style="styles.title" no-margin>Gift Certificate</Text>
                <Text v-if="certificate.companyName" :style="styles.companyName" no-margin>
                  {{ certificate.companyName }}
                </Text>
              </Section>

              <Section no-wrap :style="styles.amountContainer">
                <Text :style="styles.amount" no-margin>{{ amountLabel }}</Text>
              </Section>

              <Section no-wrap :style="styles.peopleRow">
                <View :style="{ flex: 1 }">
                  <Text :style="styles.fieldLabel" no-margin>To</Text>
                  <Text :style="styles.fieldValue" no-margin>{{ certificate.recipientName }}</Text>
                </View>
                <View :style="{ flex: 1 }">
                  <Text :style="styles.fieldLabel" no-margin>From</Text>
                  <Text :style="styles.fieldValue" no-margin>{{ certificate.senderName }}</Text>
                </View>
              </Section>

              <Section v-if="certificate.message" no-wrap :style="styles.messageBox">
                <Text :style="styles.message" no-margin>{{ `"${certificate.message}"` }}</Text>
              </Section>

              <Section no-wrap :style="styles.codeBox">
                <Text :style="styles.fieldLabel" no-margin>Certificate Code</Text>
                <Text :style="styles.code" no-margin>{{ certificate.certificateCode }}</Text>
              </Section>

              <Section no-wrap :style="{ alignItems: 'center', marginBottom: 8 }">
                <Text :style="styles.fieldLabel" no-margin>Valid Until</Text>
                <Text :style="styles.expiry" no-margin>{{ certificate.expiryDate }}</Text>
              </Section>

              <Section v-if="certificate.redemptionInstructions" no-wrap :style="{ marginTop: 8 }">
                <Text :style="styles.instructions" no-margin>
                  {{ certificate.redemptionInstructions }}
                </Text>
              </Section>

              <Section v-if="certificate.terms" no-wrap :style="{ marginTop: 10 }">
                <Text :style="styles.termsText" no-margin>{{ certificate.terms }}</Text>
              </Section>

              <Section v-if="certificate.companyContact" no-wrap :style="{ marginTop: 6 }">
                <Text :style="styles.termsText" no-margin>{{ certificate.companyContact }}</Text>
              </Section>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  </PdfcnThemeProvider>
</template>
