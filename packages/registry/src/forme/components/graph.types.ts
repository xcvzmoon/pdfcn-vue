import type { Style } from '@formepdf/vue';

export type GraphVariant = 'bar' | 'horizontal-bar' | 'line' | 'area' | 'pie' | 'donut';
export type GraphLegendPosition = 'bottom' | 'right' | 'none';

export type GraphDataPoint = {
  label: string;
  value: number;
  color?: string | undefined;
};

export type GraphSeries = {
  name: string;
  data: GraphDataPoint[];
  color?: string | undefined;
};

export type GraphWidthOptions = {
  containerPadding?: number | undefined;
  wrapperPadding?: number | undefined;
  pageWidth?: number | undefined;
};

export type GraphProps = {
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
};
