<script setup lang="ts">
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { ReportFinancialData } from './report-financial.types.ts';
  import { computed } from 'vue';
  import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
  import { usePdfcnTheme } from '../../lib/theme.ts';
  import ReportLayout from '../shared/ReportLayout.vue';
  import { sampleReportFinancialData } from './report-financial.sample.ts';

  const props = defineProps<{
    data?: ReportFinancialData | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const report = computed(() => props.data ?? sampleReportFinancialData);
  const fallbackTheme = usePdfcnTheme();
  const resolvedTheme = computed(() => props.theme ?? fallbackTheme.value);

  const graphColors = ['#0F172A'];
</script>

<template>
  <PdfcnThemeProvider :theme="resolvedTheme">
    <ReportLayout
      :data="report"
      title-prefix="Financial Report"
      status-label="Finance: Healthy"
      status-tone="success"
      graph-variant="line"
      graph-title="Revenue trajectory"
      graph-subtitle="Quarterly weighted revenue index"
      graph-legend="none"
      :graph-colors="graphColors"
    />
  </PdfcnThemeProvider>
</template>
