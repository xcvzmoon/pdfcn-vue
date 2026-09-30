import type { ComputedRef, Ref } from 'vue';
import type { PdfcnTheme, ThemePresetName } from '#registry/themes';
import * as v from 'valibot';
import { themePresets } from '#registry/themes';

export const themeNames: ThemePresetName[] = [
  'professional',
  'modern',
  'minimal',
  'executive',
  'corporate',
  'elegant',
  'vivid',
  'forest',
  'blueprint',
];
export type ThemeColorKey = keyof PdfcnTheme['colors'];
export type ThemeNumericKey =
  | 'bodySize'
  | 'headingSize'
  | 'lineHeight'
  | 'sectionGap'
  | 'paragraphGap'
  | 'componentGap'
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft';

const presetSchema = v.picklist(themeNames);
const colorSchema = v.pipe(v.string(), v.regex(/^#[\da-f]{6}$/i));
const exportNameSchema = v.pipe(
  v.string(),
  v.regex(/^[a-zA-Z_$][\w$]*$/),
  v.check(
    (value) =>
      ![
        'default',
        'class',
        'const',
        'export',
        'import',
        'var',
        'let',
        'function',
        'return',
        'new',
        'delete',
        'enum',
        'extends',
        'if',
        'else',
        'switch',
        'case',
        'throw',
        'try',
        'catch',
        'finally',
        'while',
        'for',
        'do',
        'break',
        'continue',
        'super',
        'this',
        'null',
        'true',
        'false',
        'void',
        'typeof',
        'instanceof',
        'in',
        'yield',
        'await',
        'static',
        'implements',
        'interface',
        'package',
        'private',
        'protected',
        'public',
      ].includes(value),
  ),
);

function cloneTheme(name: ThemePresetName): PdfcnTheme {
  return structuredClone(themePresets[name]);
}

type ThemeBuilderState = {
  selectedName: Ref<ThemePresetName>;
  draft: Ref<PdfcnTheme>;
  exportName: Ref<string>;
  feedback: Ref<string>;
  exportValid: ComputedRef<boolean>;
  exportCode: ComputedRef<string>;
  choosePreset: (name: ThemePresetName) => void;
  reset: () => void;
  setColor: (key: ThemeColorKey, value: string) => boolean;
  setNumber: (key: ThemeNumericKey, value: number) => void;
  downloadTheme: () => void;
};

export function useThemeBuilder(): ThemeBuilderState {
  const route = useRoute();
  const presetResult = v.safeParse(presetSchema, route.query.preset);
  const selectedName = ref<ThemePresetName>(
    presetResult.success ? presetResult.output : 'professional',
  );
  const draft = ref<PdfcnTheme>(cloneTheme(selectedName.value));
  const exportName = ref<string>('customTheme');
  const feedback = ref<string>('');
  const exportValid = computed<boolean>(
    () => v.safeParse(exportNameSchema, exportName.value).success,
  );
  const exportCode = computed<string>(() =>
    [
      "import type { PdfcnTheme } from '@/lib/pdfcn/pdf-themes'",
      '',
      `export const ${exportValid.value ? exportName.value : 'customTheme'} = ${JSON.stringify(draft.value, null, 2)} satisfies PdfcnTheme`,
    ].join('\n'),
  );

  function choosePreset(name: ThemePresetName): void {
    selectedName.value = name;
    draft.value = cloneTheme(name);
    feedback.value = `Loaded ${name} preset.`;
  }

  function reset(): void {
    draft.value = cloneTheme(selectedName.value);
    feedback.value = 'Reset to the selected preset.';
  }

  function setColor(key: ThemeColorKey, value: string): boolean {
    const result = v.safeParse(colorSchema, value);
    if (!result.success) return false;
    draft.value.colors[key] = result.output;
    return true;
  }

  function setNumber(key: ThemeNumericKey, value: number): void {
    const min = key === 'lineHeight' ? 1 : key.includes('Size') ? 6 : 0;
    const max = key === 'lineHeight' ? 2.5 : key.includes('Size') ? 72 : 120;
    const result = v.safeParse(
      v.pipe(v.number(), v.finite(), v.minValue(min), v.maxValue(max)),
      value,
    );
    if (!result.success) return;
    switch (key) {
      case 'bodySize':
        draft.value.typography.body.fontSize = value;
        break;
      case 'headingSize':
        draft.value.typography.heading.fontSize.h1 = value;
        break;
      case 'lineHeight':
        draft.value.typography.body.lineHeight = value;
        break;
      case 'sectionGap':
        draft.value.spacing.sectionGap = value;
        break;
      case 'paragraphGap':
        draft.value.spacing.paragraphGap = value;
        break;
      case 'componentGap':
        draft.value.spacing.componentGap = value;
        break;
      case 'marginTop':
        draft.value.spacing.page.marginTop = value;
        break;
      case 'marginRight':
        draft.value.spacing.page.marginRight = value;
        break;
      case 'marginBottom':
        draft.value.spacing.page.marginBottom = value;
        break;
      case 'marginLeft':
        draft.value.spacing.page.marginLeft = value;
        break;
    }
  }

  function downloadTheme(): void {
    if (!exportValid.value) return;
    const url = URL.createObjectURL(new Blob([exportCode.value], { type: 'text/typescript' }));
    try {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${exportName.value}.ts`;
      anchor.click();
      feedback.value = 'Theme downloaded.';
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  return {
    selectedName,
    draft,
    exportName,
    feedback,
    exportValid,
    exportCode,
    choosePreset,
    reset,
    setColor,
    setNumber,
    downloadTheme,
  };
}
