<script setup lang="ts">
  import type { Style } from '../lib/styles.ts';
  import { computed } from 'vue';
  import { resolveColor } from '../../forme/lib/resolve-color.ts';
  import { usePdfcnTheme } from '../../forme/lib/theme.ts';
  import { mergePdfStyles, toCssStyle } from '../lib/styles.ts';

  export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
  export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';
  export type HeadingTracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider';

  const props = withDefaults(
    defineProps<{
      level?: HeadingLevel;
      align?: 'left' | 'center' | 'right';
      color?: string | undefined;
      transform?: 'uppercase' | 'lowercase' | 'capitalize';
      weight?: HeadingWeight;
      tracking?: HeadingTracking;
      noMargin?: boolean;
      style?: Style | undefined;
    }>(),
    { level: 1, weight: 'bold', tracking: 'normal' },
  );

  const headingComponent = computed<string>(() => `h${props.level}`);
  const theme = usePdfcnTheme();
  const pdfStyle = computed<Style>(() => {
    const current = theme.value;
    const top =
      props.level === 1
        ? 0
        : props.level === 2
          ? current.spacing.sectionGap
          : props.level === 3
            ? current.spacing.componentGap
            : current.spacing.paragraphGap;
    const tracking = current.primitives.letterSpacing;
    const letterSpacing = {
      tighter: tracking.tight * 15,
      tight: tracking.tight * 10,
      normal: tracking.normal,
      wide: tracking.wide * 10,
      wider: tracking.wider * 10,
    }[props.tracking];

    return mergePdfStyles(
      {
        color: resolveColor(props.color ?? 'foreground', current.colors),
        fontFamily: current.typography.heading.fontFamily,
        fontSize: current.typography.heading.fontSize[`h${props.level}`],
        fontWeight:
          current.primitives.fontWeights[props.weight === 'normal' ? 'regular' : props.weight],
        lineHeight: current.typography.heading.lineHeight,
        letterSpacing: props.transform === 'uppercase' ? tracking.wider * 10 : letterSpacing,
        marginTop: props.noMargin ? 0 : top,
        marginBottom: props.noMargin
          ? 0
          : props.level >= 5
            ? current.primitives.spacing[1]
            : current.spacing.paragraphGap,
        textAlign: props.align,
        textTransform: props.transform,
      },
      props.style,
    );
  });
</script>

<template>
  <component
    :is="headingComponent"
    :style="toCssStyle(pdfStyle)"
    ><slot
  /></component>
</template>
