<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type {
  GraphDataPoint,
  GraphLegendPosition,
  GraphSeries,
  GraphVariant,
} from './graph.types.ts';
import { AreaChart, BarChart, LineChart, PieChart, Text, View } from '@formepdf/vue';
import { computed } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';
import {
  DEFAULT_PALETTE,
  categoryLabels,
  getGraphWidth,
  isPointList,
  normalizeData,
  resolveSeriesColors,
} from './graph.utils.ts';

const props = withDefaults(
  defineProps<{
    variant?: GraphVariant;
    data: GraphDataPoint[] | GraphSeries[];
    title?: string | undefined;
    subtitle?: string | undefined;
    xLabel?: string | undefined;
    yLabel?: string | undefined;
    width?: number;
    height?: number | undefined;
    fullWidth?: boolean;
    containerPadding?: number;
    wrapperPadding?: number;
    colors?: string[];
    showValues?: boolean;
    showGrid?: boolean;
    legend?: GraphLegendPosition;
    centerLabel?: string | undefined;
    showDots?: boolean;
    smooth?: boolean;
    yTicks?: number | undefined;
    noWrap?: boolean;
    style?: Style | undefined;
  }>(),
  {
    fullWidth: false,
    height: 260,
    legend: 'bottom',
    noWrap: true,
    showDots: true,
    showGrid: true,
    showValues: false,
    variant: 'bar',
    width: 420,
  },
);

const theme = usePdfcnTheme();
const palette = computed(() => props.colors ?? DEFAULT_PALETTE);
const series = computed(() => normalizeData(props.data));
const labels = computed(() => categoryLabels(series.value));
const chartWidth = computed(() => {
  if (props.fullWidth) {
    return getGraphWidth(theme.value, {
      containerPadding: props.containerPadding ?? 0,
      wrapperPadding: props.wrapperPadding ?? 0,
    });
  }
  return props.width;
});
const chartHeight = computed(() => props.height);

const pointData = computed<GraphDataPoint[]>(() => {
  if (isPointList(props.data)) return props.data;
  const first = series.value[0];
  return first?.data ?? [];
});

const formChartData = computed(() =>
  pointData.value.map((point, index) => ({
    color: point.color ?? palette.value[index % palette.value.length],
    label: point.label,
    value: point.value,
  })),
);

const formSeries = computed(() => resolveSeriesColors(series.value, palette.value));

const showLegend = computed(() => props.legend !== 'none');

const wrapperStyle = computed<Style>(() =>
  mergePdfStyles({ flexDirection: 'column', width: chartWidth.value }, props.style),
);

const titleStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.foreground,
    fontFamily: current.typography.heading.fontFamily,
    fontSize: current.primitives.typography.sm,
    fontWeight: current.primitives.fontWeights.semibold,
    marginBottom: current.primitives.spacing[1],
    marginTop: 0,
    textAlign: 'center',
  };
});

const subtitleStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    marginBottom: current.primitives.spacing[2],
    marginTop: 0,
    textAlign: 'center',
  };
});

const axisLabelStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    marginTop: current.primitives.spacing[1],
    textAlign: 'center',
  };
});

const horizontalTrackStyle = computed<Style>(() => ({
  flexDirection: 'column',
  gap: 6,
  width: '100%',
}));

const horizontalRowStyle = computed<Style>(() => ({
  alignItems: 'center',
  flexDirection: 'row',
  gap: 8,
}));

const horizontalLabelStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    marginBottom: 0,
    marginTop: 0,
    width: 72,
  };
});

const horizontalBarTrackStyle = computed<Style>(() => ({
  flexDirection: 'row',
  flexGrow: 1,
  height: 14,
}));

function horizontalBarWidth(value: number, max: number): number {
  const track = chartWidth.value - 96;
  if (max <= 0) return 0;
  return Math.max(4, Math.round((value / max) * track));
}

const horizontalMax = computed(() => {
  let max = 0;
  for (const point of pointData.value) {
    if (point.value > max) max = point.value;
  }
  return max;
});
</script>

<template>
  <View :wrap="!noWrap" :style="wrapperStyle">
    <Text v-if="title" :style="titleStyle">{{ title }}</Text>
    <Text v-if="subtitle" :style="subtitleStyle">{{ subtitle }}</Text>

    <BarChart
      v-if="variant === 'bar'"
      :width="chartWidth"
      :height="chartHeight"
      :data="formChartData"
      :show-grid="showGrid"
      :show-values="showValues"
      :title="undefined"
    />

    <View v-else-if="variant === 'horizontal-bar'" :style="horizontalTrackStyle">
      <View
        v-for="(point, index) in pointData"
        :key="`${point.label}-${index}`"
        :style="horizontalRowStyle"
      >
        <Text :style="horizontalLabelStyle">{{ point.label }}</Text>
        <View :style="horizontalBarTrackStyle">
          <View
            :style="{
              backgroundColor: point.color ?? palette[index % palette.length],
              height: 14,
              width: horizontalBarWidth(point.value, horizontalMax),
            }"
          />
          <Text
            v-if="showValues"
            :style="{
              color: theme.colors.foreground,
              fontFamily: theme.typography.body.fontFamily,
              fontSize: theme.primitives.typography.xs,
              marginBottom: 0,
              marginLeft: 6,
              marginTop: 0,
            }"
          >
            {{ point.value }}
          </Text>
        </View>
      </View>
    </View>

    <LineChart
      v-else-if="variant === 'line'"
      :width="chartWidth"
      :height="chartHeight"
      :series="formSeries"
      :labels="labels"
      :show-grid="showGrid"
      :show-points="showDots"
      :title="undefined"
    />

    <AreaChart
      v-else-if="variant === 'area'"
      :width="chartWidth"
      :height="chartHeight"
      :series="formSeries"
      :labels="labels"
      :show-grid="showGrid"
      :title="undefined"
    />

    <PieChart
      v-else
      :width="chartWidth"
      :height="chartHeight"
      :data="formChartData"
      :donut="variant === 'donut'"
      :show-legend="showLegend"
      :title="undefined"
    />

    <Text v-if="xLabel" :style="axisLabelStyle">{{ xLabel }}</Text>
    <Text v-if="yLabel" :style="axisLabelStyle">{{ yLabel }}</Text>
  </View>
</template>
