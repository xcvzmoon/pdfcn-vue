export type ReportMetricTone = 'success' | 'warning' | 'destructive' | 'info';

export type ReportSummaryMetric = {
  label: string;
  value: string;
  trend?: string | undefined;
  tone?: ReportMetricTone | undefined;
};

export type ReportRow = {
  label: string;
  owner: string;
  status: string;
  progress: number;
  risk?: string | undefined;
  detail?: string | undefined;
  metric?: string | undefined;
  region?: string | undefined;
};

export type ReportSeriesPoint = {
  label: string;
  value: number;
};

export type BaseReportData = {
  title: string;
  subtitle: string;
  generatedAt: string;
  period: string;
  author: string;
  summary: ReportSummaryMetric[];
  rows: ReportRow[];
  series: ReportSeriesPoint[];
  highlights: string[];
};
