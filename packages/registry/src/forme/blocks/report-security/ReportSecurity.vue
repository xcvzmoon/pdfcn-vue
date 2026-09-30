<script setup lang="ts">
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { GraphDataPoint } from '../../components/graph.types.ts';
  import type { ReportSecurityData } from './report-security.types.ts';
  import { computed } from 'vue';
  import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
  import { usePdfcnTheme } from '../../lib/theme.ts';
  import ReportLayout from '../shared/ReportLayout.vue';
  import { sampleReportSecurityData } from './report-security.sample.ts';

  const props = defineProps<{
    data?: ReportSecurityData | undefined;
    theme?: PdfcnTheme | undefined;
  }>();

  const report = computed(() => props.data ?? sampleReportSecurityData);
  const fallbackTheme = usePdfcnTheme();
  const resolvedTheme = computed(() => props.theme ?? fallbackTheme.value);

  const graphColors = ['#DC2626', '#F59E0B', '#16A34A', '#0EA5E9'];
  const graphData: GraphDataPoint[] = [
    { label: 'High Risk', value: 14 },
    { label: 'Medium Risk', value: 17 },
    { label: 'Low Risk', value: 8 },
    { label: 'Info', value: 4 },
  ];
</script>

<template>
  <PdfcnThemeProvider :theme="resolvedTheme">
    <ReportLayout
      :data="report"
      title-prefix="Security Report"
      status-label="Security: Action Needed"
      status-tone="destructive"
      graph-variant="donut"
      graph-title="Open risk distribution"
      graph-subtitle="High/Medium/Low workload share"
      graph-legend="right"
      graph-show-values
      :graph-colors="graphColors"
      :graph-data="graphData"
    />
  </PdfcnThemeProvider>
</template>
