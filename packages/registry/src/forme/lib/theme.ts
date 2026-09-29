import type { ComputedRef, InjectionKey } from 'vue';
import type { PdfcnTheme } from '../../types/pdf-themes.ts';
import { computed, inject } from 'vue';
import { professionalTheme } from '../../themes/professional.ts';

export const pdfcnThemeKey: InjectionKey<ComputedRef<PdfcnTheme>> = Symbol('pdfcn-theme');

export function usePdfcnTheme(): ComputedRef<PdfcnTheme> {
  return inject(
    pdfcnThemeKey,
    computed(() => professionalTheme),
  );
}
