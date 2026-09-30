<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PdfcnTheme } from '../../../types/pdf-themes.ts';
  import type { DataTableFooter, DataTableRow } from '../../components/data-table.types.ts';
  import type {
    GraphDataPoint,
    GraphLegendPosition,
    GraphVariant,
  } from '../../components/graph.types.ts';
  import type { KeyValueEntry } from '../../components/key-value.types.ts';
  import type { ListItem } from '../../components/list.types.ts';
  import type { BaseReportData, ReportMetricTone, ReportSummaryMetric } from './report.types.ts';
  import { Document, PAGE_NUMBER, Page, TOTAL_PAGES, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import Badge from '../../components/Badge.vue';
  import DataTable from '../../components/DataTable.vue';
  import Graph from '../../components/Graph.vue';
  import KeyValue from '../../components/KeyValue.vue';
  import PageFooter from '../../components/PageFooter.vue';
  import PageHeader from '../../components/PageHeader.vue';
  import PdfList from '../../components/PdfList.vue';
  import Section from '../../components/Section.vue';
  import Text from '../../components/Text.vue';
  import { usePdfcnTheme } from '../../lib/theme.ts';

  const props = withDefaults(
    defineProps<{
      data: BaseReportData;
      titlePrefix: string;
      statusLabel: string;
      statusTone: ReportMetricTone;
      graphVariant: GraphVariant;
      graphTitle: string;
      graphSubtitle: string;
      graphLegend?: GraphLegendPosition | undefined;
      graphShowValues?: boolean | undefined;
      graphColors?: string[] | undefined;
      graphData?: GraphDataPoint[] | undefined;
    }>(),
    {
      graphLegend: 'none',
      graphShowValues: false,
    },
  );

  const theme = usePdfcnTheme();
  const pageMargin = { bottom: 48, left: 48, right: 48, top: 56 };

  const graphHeight: Record<GraphVariant, number> = {
    area: 191,
    bar: 181,
    donut: 191,
    'horizontal-bar': 148,
    line: 191,
    pie: 191,
  };

  const deliveryOffset: Record<GraphVariant, number> = {
    area: 0,
    bar: 59,
    donut: -3,
    'horizontal-bar': -4,
    line: -30,
    pie: 0,
  };

  const sectionOffset: Record<GraphVariant, number> = {
    area: 0,
    bar: 32,
    donut: 0,
    'horizontal-bar': 0,
    line: 0,
    pie: 0,
  };

  const titleOffset: Record<GraphVariant, number> = {
    area: 0,
    bar: 0,
    donut: 0,
    'horizontal-bar': 0,
    line: 0,
    pie: 0,
  };

  function toneColor(current: PdfcnTheme, tone: ReportMetricTone): string {
    if (tone === 'success') {
      return current.colors.success;
    }
    if (tone === 'warning') {
      return current.colors.warning;
    }
    if (tone === 'destructive') {
      return current.colors.destructive;
    }
    return current.colors.info;
  }

  function trendBadgeWidth(trend: string): number {
    return trend.endsWith('QoQ') ? trend.length * 6.5 + 10 : trend.length * 5 + 18;
  }

  function averageProgress(rows: BaseReportData['rows']): number {
    let total = 0;
    for (const row of rows) {
      total += row.progress;
    }
    return Math.round(total / Math.max(rows.length, 1));
  }

  const accent = computed(() => toneColor(theme.value, props.statusTone));

  const styles = computed(() => {
    const current = theme.value;
    return {
      col: {
        width: 225,
      } satisfies Style,
      graphShell: {
        backgroundColor: current.colors.background,
        borderColor: current.colors.border,
        borderRadius: current.primitives.borderRadius.md,
        borderWidth: 1,
        padding: 12,
        paddingBottom: props.graphVariant === 'horizontal-bar' ? 56 : 12,
      } satisfies Style,
      metricCard: {
        alignItems: 'flex-start',
        backgroundColor: current.colors.background,
        borderColor: current.colors.border,
        borderRadius: current.primitives.borderRadius.md,
        borderWidth: 1,
        height: 75,
        padding: 8,
        width: 225,
      } satisfies Style,
      metricLabel: {
        color: current.colors.mutedForeground,
        fontSize: 8,
        letterSpacing: 0.5,
        marginBottom: 2,
        textTransform: 'uppercase',
      } satisfies Style,
      metricValue: {
        color: current.colors.foreground,
        fontSize: 14,
        fontWeight: current.primitives.fontWeights.bold,
        marginBottom: 2,
      } satisfies Style,
      metricsGrid: {
        flexDirection: 'column',
        gap: 8,
      } satisfies Style,
      metricsRow: {
        flexDirection: 'row',
        gap: 8,
      } satisfies Style,
      page: {
        backgroundColor: current.colors.background,
      } satisfies Style,
      toolbar: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        width: 499,
      } satisfies Style,
      twoColumn: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 10,
      } satisfies Style,
    };
  });

  function metricCardStyle(metric: ReportSummaryMetric): Style {
    const cards = styles.value.metricCard;
    return {
      ...cards,
      borderLeftColor: metric.tone ? toneColor(theme.value, metric.tone) : accent.value,
      borderLeftWidth: 3,
    };
  }

  const metricRows = computed(() => {
    const rows: ReportSummaryMetric[][] = [];
    const summary = props.data.summary;
    for (let index = 0; index < summary.length; index += 2) {
      rows.push(summary.slice(index, index + 2));
    }
    return rows;
  });

  const tableRows = computed<DataTableRow[]>(() =>
    props.data.rows.map((row) => ({
      label: row.label,
      owner: row.owner,
      progress: `${row.progress}%`,
      risk: row.risk ?? '-',
      status: row.status,
    })),
  );

  const tableFooter = computed<DataTableFooter>(() => ({
    label: 'Totals',
    owner: '-',
    progress: `${averageProgress(props.data.rows)}%`,
    risk: '-',
    status: '-',
  }));

  const highlightItems = computed<ListItem[]>(() =>
    props.data.highlights.map((item) => ({
      checked: true,
      text: item,
    })),
  );

  const riskStats = computed<KeyValueEntry[]>(() => {
    const rows = props.data.rows;
    let openRisks = 0;
    let onTrack = 0;
    for (const row of rows) {
      if (row.risk !== 'Low') {
        openRisks += 1;
      }
      if (row.status === 'On Track') {
        onTrack += 1;
      }
    }
    return [
      { key: 'Open Risks', value: `${openRisks}` },
      { key: 'On-Track Streams', value: `${onTrack}/${rows.length}` },
      { key: 'Avg Progress', value: `${averageProgress(rows)}%` },
    ];
  });

  const documentTitle = computed(() => `${props.titlePrefix} ${props.data.period}`);
  const footerRight = computed(() => `Page ${PAGE_NUMBER} of ${TOTAL_PAGES}`);
  const pageSubtitle = computed(() => `${props.titlePrefix} · ${props.data.subtitle}`);
  const generatedLabel = computed(() => `Generated ${props.data.generatedAt}`);
  const authorLabel = computed(() => `Author: ${props.data.author}`);
  const graphPoints = computed(() => props.graphData ?? props.data.series);
  const graphColorBindings = computed(() =>
    props.graphColors ? { colors: props.graphColors } : {},
  );
  const sectionStyle = computed<Style>(() => ({
    position: 'relative',
    top: sectionOffset[props.graphVariant],
  }));
  const performanceTitleStyle = computed<Style>(() => ({
    position: 'relative',
    top: titleOffset[props.graphVariant],
  }));
  const deliveryStyle = computed<Style>(() => ({
    position: 'relative',
    top: deliveryOffset[props.graphVariant],
  }));
</script>

<template>
  <Document :title="documentTitle">
    <Page
      size="A4"
      :margin="pageMargin"
    >
      <PageFooter
        variant="three-column"
        left-text="Confidential — Internal Use"
        center-text="Generated with pdfcn-vue"
        :right-text="footerRight"
        sticky
        :page-padding="theme.spacing.page.marginLeft"
      />
      <View :style="styles.page">
        <PageHeader
          variant="two-column"
          :title="data.title"
          :subtitle="pageSubtitle"
          :right-text="data.period"
          :right-sub-text="generatedLabel"
          :margin-bottom="14"
        />
        <View :style="styles.toolbar">
          <Badge
            :label="statusLabel"
            :variant="statusTone"
            size="sm"
          />
          <Text
            variant="xs"
            color="mutedForeground"
            no-margin
            >{{ authorLabel }}</Text
          >
        </View>
        <Section
          variant="card"
          padding="md"
          no-wrap
        >
          <Text
            variant="sm"
            transform="uppercase"
            color="mutedForeground"
          >
            Executive Summary
          </Text>
          <View :style="styles.metricsGrid">
            <View
              v-for="(row, rowIndex) in metricRows"
              :key="rowIndex"
              :style="styles.metricsRow"
            >
              <View
                v-for="metric in row"
                :key="metric.label"
                :style="metricCardStyle(metric)"
              >
                <Text
                  :style="styles.metricLabel"
                  no-margin
                  >{{ metric.label }}</Text
                >
                <Text
                  :style="styles.metricValue"
                  no-margin
                  >{{ metric.value }}</Text
                >
                <Badge
                  v-if="metric.trend"
                  :label="metric.trend"
                  size="sm"
                  :variant="metric.tone ?? 'info'"
                  :style="{
                    height: 16,
                    width: trendBadgeWidth(metric.trend),
                  }"
                />
              </View>
            </View>
          </View>
        </Section>
      </View>
    </Page>
    <Page
      size="A4"
      :margin="pageMargin"
    >
      <PageFooter
        variant="three-column"
        left-text="Confidential — Internal Use"
        center-text="Generated with pdfcn-vue"
        :right-text="footerRight"
        sticky
        :page-padding="theme.spacing.page.marginLeft"
      />
      <View :style="styles.page">
        <Section
          padding="md"
          no-wrap
          :style="sectionStyle"
        >
          <Text
            variant="sm"
            transform="uppercase"
            color="mutedForeground"
            :style="performanceTitleStyle"
          >
            Performance Trend
          </Text>
          <View :style="styles.graphShell">
            <Graph
              :variant="graphVariant"
              :data="graphPoints"
              :title="graphTitle"
              :subtitle="graphSubtitle"
              :show-grid="graphVariant !== 'pie' && graphVariant !== 'donut'"
              :show-values="graphShowValues"
              :smooth="graphVariant === 'line' || graphVariant === 'area'"
              :legend="graphLegend"
              :height="graphHeight[graphVariant]"
              v-bind="graphColorBindings"
              full-width
              :container-padding="12"
              :wrapper-padding="12"
              :style="{ marginBottom: 0 }"
            />
          </View>
        </Section>
        <Section
          padding="md"
          :style="deliveryStyle"
        >
          <Text
            variant="sm"
            transform="uppercase"
            color="mutedForeground"
          >
            Delivery Table
          </Text>
          <DataTable
            variant="compact"
            size="compact"
            stripe
            :columns="[
              { header: 'Stream', key: 'label' },
              { header: 'Owner', key: 'owner' },
              { align: 'center', header: 'Status', key: 'status' },
              { align: 'right', header: 'Progress', key: 'progress' },
              { align: 'right', header: 'Risk', key: 'risk' },
            ]"
            :data="tableRows"
            :footer="tableFooter"
          />
        </Section>
      </View>
    </Page>
    <Page
      size="A4"
      :margin="pageMargin"
    >
      <PageFooter
        variant="three-column"
        left-text="Confidential — Internal Use"
        center-text="Generated with pdfcn-vue"
        :right-text="footerRight"
        sticky
        :page-padding="theme.spacing.page.marginLeft"
      />
      <View :style="styles.page">
        <Section
          variant="card"
          padding="md"
          no-wrap
        >
          <Text
            variant="sm"
            transform="uppercase"
            color="mutedForeground"
          >
            Highlights & Risks
          </Text>
          <View :style="styles.twoColumn">
            <View :style="styles.col">
              <PdfList
                variant="checklist"
                :items="highlightItems"
                gap="sm"
              />
            </View>
            <View :style="styles.col">
              <KeyValue
                size="sm"
                divided
                :items="riskStats"
              />
            </View>
          </View>
        </Section>
      </View>
    </Page>
  </Document>
</template>
