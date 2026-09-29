import type { Style } from '@formepdf/vue';

export type KeyValueDirection = 'horizontal' | 'vertical';
export type KeyValueSize = 'sm' | 'md' | 'lg';

export type KeyValueEntry = {
  key: string;
  value: string;
  valueColor?: string | undefined;
  valueStyle?: Style | undefined;
  keyStyle?: Style | undefined;
};
