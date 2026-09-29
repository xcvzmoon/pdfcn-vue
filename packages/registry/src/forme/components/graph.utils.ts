import type { PdfcnTheme } from '../../types/pdf-themes.ts';
import type { GraphDataPoint, GraphSeries, GraphWidthOptions } from './graph.types.ts';

export const A4_WIDTH = 595;

export const DEFAULT_PALETTE = [
  '#1a365d',
  '#2b6cb0',
  '#3182ce',
  '#63b3ed',
  '#90cdf4',
  '#bee3f8',
  '#c05621',
  '#718096',
];

export function isPointList(data: GraphDataPoint[] | GraphSeries[]): data is GraphDataPoint[] {
  const first = data[0];
  return first !== undefined && 'label' in first && 'value' in first;
}

export function normalizeData(data: GraphDataPoint[] | GraphSeries[]): GraphSeries[] {
  if (data.length === 0) return [];
  if (isPointList(data)) {
    return [{ data, name: 'Series 1' }];
  }
  return data;
}

export function getGraphWidth(theme: PdfcnTheme, options: GraphWidthOptions = {}): number {
  const { containerPadding = 0, wrapperPadding = 0, pageWidth = A4_WIDTH } = options;
  const { marginLeft, marginRight } = theme.spacing.page;
  const availableWidth =
    pageWidth - marginLeft - marginRight - containerPadding * 2 - wrapperPadding * 2;
  return Math.max(Math.floor(availableWidth), 100);
}

export function resolveSeriesColors(
  series: GraphSeries[],
  palette: string[],
): { name: string; data: number[]; color?: string | undefined }[] {
  return series.map((entry, index) => ({
    color: entry.color ?? palette[index % palette.length],
    data: entry.data.map((point) => point.value),
    name: entry.name,
  }));
}

export function categoryLabels(series: GraphSeries[]): string[] {
  const first = series[0];
  if (!first) return [];
  return first.data.map((point) => point.label);
}

export function flattenPoints(series: GraphSeries[]): GraphDataPoint[] {
  const points: GraphDataPoint[] = [];
  for (const entry of series) {
    for (const point of entry.data) {
      points.push(point);
    }
  }
  return points;
}
