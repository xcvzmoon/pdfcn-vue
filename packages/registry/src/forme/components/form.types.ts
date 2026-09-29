import type { Style } from '@formepdf/vue';

export type PdfFormVariant = 'underline' | 'box' | 'outlined' | 'ghost';
export type FormLayout = 'single' | 'two-column' | 'three-column';
export type FormLabelPosition = 'above' | 'left';

export type PdfFormField = {
  label: string;
  hint?: string | undefined;
  height?: number | undefined;
  width?: number | string;
};

export type PdfFormGroup = {
  title?: string | undefined;
  fields: PdfFormField[];
  layout?: FormLayout;
};

export type PdfFormProps = {
  title?: string | undefined;
  subtitle?: string | undefined;
  groups: PdfFormGroup[];
  variant?: PdfFormVariant;
  labelPosition?: FormLabelPosition;
  noWrap?: boolean;
  style?: Style | undefined;
};
