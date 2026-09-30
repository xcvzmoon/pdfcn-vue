<script setup lang="ts">
import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
import type { GraphDataPoint } from '../../components/graph.types.ts';
import type { ReportOperationsData } from './report-operations.types.ts';
import { computed } from 'vue';
import PdfcnThemeProvider from '../../components/PdfcnThemeProvider.vue';
import { usePdfcnTheme } from '../../lib/theme.ts';
import ReportLayout from '../shared/ReportLayout.vue';
import { sampleReportOperationsData } from './report-operations.sample.ts';

const props = defineProps<{
  data?: ReportOperationsData | undefined;
  theme?: PdfcnTheme | undefined;
}>();

const report = computed(() => props.data ?? sampleReportOperationsData);
const fallbackTheme = usePdfcnTheme();
const resolvedTheme = computed(() => props.theme ?? fallbackTheme.value);

const graphColors = ['#2563EB'];
const graphData: GraphDataPoint[] = [
  { label: 'Incident', value: 66 },
  { label: 'Automation', value: 77 },
  { label: 'L2 Support', value: 85 },
  { label: 'L1 Support', value: 91 },
];
</script>

<template>
  <PdfcnThemeProvider :theme="resolvedTheme">
    <ReportLayout
      :data="report"
      title-prefix="Operations Report"
      status-label="Ops: Watch"
      status-tone="warning"
      graph-variant="horizontal-bar"
      graph-title="Throughput by week"
      graph-subtitle="Resolved workload distribution"
      graph-legend="none"
      graph-show-values
      :graph-colors="graphColors"
      :graph-data="graphData"
    />
  </PdfcnThemeProvider>
</template>
