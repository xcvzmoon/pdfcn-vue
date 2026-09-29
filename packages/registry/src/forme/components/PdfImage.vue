<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { PdfImageFit, PdfImageVariant } from './pdf-image.types.ts';
import { Image, Text, View } from '@formepdf/vue';
import { computed } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

type VariantDefaults = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | undefined;
};

const props = withDefaults(
  defineProps<{
    src: string;
    variant?: PdfImageVariant;
    width?: number | string;
    height?: number | string;
    fit?: PdfImageFit;
    caption?: string | undefined;
    aspectRatio?: number | undefined;
    borderRadius?: number | undefined;
    noWrap?: boolean;
    style?: Style | undefined;
  }>(),
  { noWrap: true, variant: 'default' },
);

const VARIANT_DEFAULTS: Record<PdfImageVariant, VariantDefaults> = {
  avatar: { borderRadius: 999, height: 48, width: 48 },
  bordered: { width: '100%' },
  cover: { height: 160, width: '100%' },
  default: {},
  'full-width': { width: '100%' },
  rounded: { borderRadius: 8, width: 200 },
  thumbnail: { height: 80, width: 80 },
};

const UNSUPPORTED_FORMATS = new Set(['webp', 'avif', 'heic', 'heif', 'ico']);

function detectFormat(src: string): string | null {
  const dataMatch = src.match(/^data:image\/([a-zA-Z0-9+.-]+)/);
  if (dataMatch) return dataMatch[1]?.toLowerCase() ?? null;
  return src.split('?')[0]?.split('.').pop()?.toLowerCase() ?? null;
}

const format = detectFormat(props.src);
if (format && UNSUPPORTED_FORMATS.has(format)) {
  console.warn(
    `[PdfImage] Unsupported format "${format}" detected. Forme supports JPEG, PNG, and WebP. Convert before use.`,
  );
}

const theme = usePdfcnTheme();

function toNumericDimension(value: number | string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

const resolvedWidth = computed(() => props.width ?? VARIANT_DEFAULTS[props.variant].width);
const resolvedHeight = computed(() => {
  if (props.height !== undefined) return props.height;
  const fallback = VARIANT_DEFAULTS[props.variant].height;
  if (fallback !== undefined) return fallback;
  const numericWidth = toNumericDimension(resolvedWidth.value);
  if (props.aspectRatio !== undefined && numericWidth !== undefined) {
    return numericWidth / props.aspectRatio;
  }
  return undefined;
});
const resolvedRadius = computed(
  () => props.borderRadius ?? VARIANT_DEFAULTS[props.variant].borderRadius,
);

const imageStyle = computed<Style>(() => {
  const current = theme.value;
  return mergePdfStyles(
    {
      width: resolvedWidth.value,
      height: resolvedHeight.value,
      borderRadius: resolvedRadius.value,
      borderColor: props.variant === 'bordered' ? current.colors.border : undefined,
      borderWidth: props.variant === 'bordered' ? 1 : undefined,
    },
    props.style,
  );
});

const containerStyle = computed<Style>(() => ({ flexDirection: 'column' }));

const captionStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    marginTop: current.primitives.spacing[1],
    textAlign: 'center',
  };
});
</script>

<template>
  <View v-if="noWrap" :wrap="false" :style="containerStyle">
    <Image :src="src" :style="imageStyle" />
    <Text v-if="caption" :style="captionStyle">{{ caption }}</Text>
  </View>
  <View v-else :style="containerStyle">
    <Image :src="src" :style="imageStyle" />
    <Text v-if="caption" :style="captionStyle">{{ caption }}</Text>
  </View>
</template>
