<script setup lang="ts">
import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
import type { ReportMarketingData } from './report-marketing.types.ts';
import { computed } from 'vue';
import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
import { usePdfcnTheme } from '../../lib/theme.ts';
import ReportLayout from '../shared/ReportLayout.vue';
import { sampleReportMarketingData } from './report-marketing.sample.ts';

const props = defineProps<{
  data?: ReportMarketingData | undefined;
  theme?: PdfcnTheme | undefined;
}>();

const report = computed(() => props.data ?? sampleReportMarketingData);
const fallbackTheme = usePdfcnTheme();
const resolvedTheme = computed(() => props.theme ?? fallbackTheme.value);

const graphColors = ['#0EA5E9'];
</script>

<template>
  <PdfcnThemeProvider :theme="resolvedTheme">
    <ReportLayout
      :data="report"
      title-prefix="Growth Report"
      status-label="Growth: Strong"
      status-tone="success"
      graph-variant="bar"
      graph-title="Pipeline build by week"
      graph-subtitle="Demand creation output trend"
      graph-legend="none"
      graph-show-values
      :graph-colors="graphColors"
    />
  </PdfcnThemeProvider>
</template>
