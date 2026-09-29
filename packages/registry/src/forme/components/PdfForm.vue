<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type {
  FormLabelPosition,
  FormLayout,
  PdfFormField,
  PdfFormGroup,
  PdfFormVariant,
} from './form.types.ts';
import { Text, View } from '@formepdf/vue';
import { computed } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

const props = withDefaults(
  defineProps<{
    title?: string | undefined;
    subtitle?: string | undefined;
    groups: PdfFormGroup[];
    variant?: PdfFormVariant;
    labelPosition?: FormLabelPosition;
    noWrap?: boolean;
    style?: Style | undefined;
  }>(),
  { labelPosition: 'above', noWrap: false, variant: 'underline' },
);

const theme = usePdfcnTheme();

function fieldAreaStyle(height: number, extra?: Style): Style {
  const current = theme.value;
  const { spacing, borderRadius } = current.primitives;
  const borderColor = current.colors.border;
  const hairline = 0.75;
  const byVariant: Record<PdfFormVariant, Style> = {
    box: {
      borderColor,
      borderRadius: borderRadius.sm,
      borderWidth: hairline,
    },
    ghost: {
      backgroundColor: current.colors.muted,
      borderRadius: borderRadius.sm,
    },
    outlined: {
      borderColor: current.colors.foreground,
      borderRadius: borderRadius.md,
      borderWidth: hairline,
    },
    underline: {
      borderBottomColor: borderColor,
      borderBottomWidth: 1,
    },
  };
  const hasPadding =
    props.variant === 'box' || props.variant === 'outlined' || props.variant === 'ghost';
  return mergePdfStyles(
    { minHeight: height, width: '100%' },
    byVariant[props.variant],
    hasPadding
      ? {
          paddingBottom: spacing[1],
          paddingHorizontal: spacing[2],
          paddingTop: spacing[1],
        }
      : undefined,
    extra,
  );
}

function labelStyle(position: FormLabelPosition): Style {
  const current = theme.value;
  const { fontWeights } = current.primitives;
  if (position === 'left') {
    return {
      color: current.colors.mutedForeground,
      fontFamily: current.typography.body.fontFamily,
      fontSize: current.typography.body.fontSize,
      fontWeight: fontWeights.medium,
      lineHeight: current.typography.body.lineHeight,
      marginBottom: 0,
      marginTop: 0,
      width: 80,
    };
  }
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    marginBottom: current.primitives.spacing[1],
    marginTop: 0,
    textTransform: 'uppercase',
  };
}

function hintStyle(): Style {
  const current = theme.value;
  const hasPadding =
    props.variant === 'box' || props.variant === 'outlined' || props.variant === 'ghost';
  const { spacing } = current.primitives;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    marginBottom: 0,
    marginTop: 0,
    opacity: 0.14,
    paddingBottom: hasPadding ? spacing[1] : 0,
    paddingHorizontal: hasPadding ? spacing[2] : 0,
    paddingTop: hasPadding ? spacing[1] : spacing[0.5],
  };
}

function fieldWrapperStyle(position: FormLabelPosition): Style {
  const spacing = theme.value.primitives.spacing;
  if (position === 'left') {
    return {
      alignItems: 'flex-end',
      flexDirection: 'row',
      gap: spacing[2],
      marginBottom: spacing[3],
    };
  }
  return {
    marginBottom: spacing[3],
    width: '100%',
  };
}

function columnCount(layout: FormLayout | undefined): number {
  if (layout === 'three-column') return 3;
  if (layout === 'two-column') return 2;
  return 1;
}

function chunkFields(fields: PdfFormField[], cols: number): PdfFormField[][] {
  const chunkSize = Math.ceil(fields.length / cols);
  const chunks: PdfFormField[][] = [];
  for (let index = 0; index < fields.length; index += chunkSize) {
    chunks.push(fields.slice(index, index + chunkSize));
  }
  while (chunks.length < cols) {
    chunks.push([]);
  }
  return chunks;
}

function groupColumns(group: PdfFormGroup): PdfFormField[][] {
  const cols = columnCount(group.layout);
  if (cols === 1) return [group.fields];
  return chunkFields(group.fields, cols);
}

function isMultiColumn(group: PdfFormGroup): boolean {
  return columnCount(group.layout) > 1;
}

const rootStyle = computed<Style>(() =>
  mergePdfStyles(
    {
      flexDirection: 'column',
      marginBottom: theme.value.spacing.componentGap,
      width: '100%',
    },
    props.style,
  ),
);

const formTitleStyle = computed<Style>(() => {
  const current = theme.value;
  const { fontWeights, spacing } = current.primitives;
  return {
    color: current.colors.foreground,
    fontFamily: current.typography.heading.fontFamily,
    fontSize: current.primitives.typography.xl,
    fontWeight: fontWeights.bold,
    lineHeight: current.typography.heading.lineHeight,
    marginBottom: spacing[1],
    marginTop: 0,
  };
});

const formSubtitleStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.sm,
    lineHeight: current.typography.body.lineHeight,
    marginBottom: current.primitives.spacing[3],
    marginTop: 0,
  };
});

const formDividerStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    borderBottomColor: current.colors.border,
    borderBottomWidth: 1,
    marginBottom: current.primitives.spacing[4],
  };
});

const groupStyle = computed<Style>(() => ({
  flexDirection: 'column',
  marginBottom: theme.value.primitives.spacing[5],
}));

const groupTitleStyle = computed<Style>(() => {
  const current = theme.value;
  const { fontWeights, spacing } = current.primitives;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.8,
    lineHeight: 1.2,
    marginBottom: spacing[3],
    marginTop: 0,
    textTransform: 'uppercase',
  };
});

const columnsRowStyle = computed<Style>(() => ({
  flexDirection: 'row',
  gap: theme.value.primitives.spacing[4],
}));

const columnStyle: Style = { flex: 1 };
</script>

<template>
  <View :wrap="!noWrap" :style="rootStyle">
    <Text v-if="title" :style="formTitleStyle">{{ title }}</Text>
    <Text v-if="subtitle" :style="formSubtitleStyle">{{ subtitle }}</Text>
    <View v-if="title || subtitle" :style="formDividerStyle" />
    <View v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :style="groupStyle">
      <Text v-if="group.title" :style="groupTitleStyle">{{ group.title }}</Text>
      <View v-if="isMultiColumn(group)" :style="columnsRowStyle">
        <View
          v-for="(chunk, chunkIndex) in groupColumns(group)"
          :key="`col-${groupIndex}-${chunkIndex}`"
          :style="columnStyle"
        >
          <View
            v-for="(field, fieldIndex) in chunk"
            :key="`${field.label}-${fieldIndex}`"
            :style="fieldWrapperStyle(labelPosition)"
          >
            <Text :style="labelStyle(labelPosition)">{{ field.label }}</Text>
            <View
              :style="
                fieldAreaStyle(
                  field.height ?? 18,
                  labelPosition === 'left' ? { flex: 1 } : undefined,
                )
              "
            >
              <Text v-if="field.hint" :style="hintStyle()">{{ field.hint }}</Text>
            </View>
          </View>
        </View>
      </View>
      <template v-else>
        <View
          v-for="(field, fieldIndex) in group.fields"
          :key="`${field.label}-${fieldIndex}`"
          :style="fieldWrapperStyle(labelPosition)"
        >
          <Text :style="labelStyle(labelPosition)">{{ field.label }}</Text>
          <View
            :style="
              fieldAreaStyle(field.height ?? 18, labelPosition === 'left' ? { flex: 1 } : undefined)
            "
          >
            <Text v-if="field.hint" :style="hintStyle()">{{ field.hint }}</Text>
          </View>
        </View>
      </template>
    </View>
  </View>
</template>
