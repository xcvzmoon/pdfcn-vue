import type { Style } from '@formepdf/vue';

export type ListVariant =
  | 'bullet'
  | 'numbered'
  | 'checklist'
  | 'icon'
  | 'multi-level'
  | 'descriptive';

export type ListItem = {
  text: string;
  description?: string;
  checked?: boolean;
  children?: ListItem[];
};

export type PdfListProps = {
  items: ListItem[];
  variant?: ListVariant;
  gap?: 'xs' | 'sm' | 'md';
  noWrap?: boolean;
  style?: Style;
};
