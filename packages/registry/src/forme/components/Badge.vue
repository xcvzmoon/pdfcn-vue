<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { BadgeSize, BadgeVariant } from './badge.types.ts';
  import { Text, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import { resolveColor } from '../lib/resolve-color.ts';
  import { mergePdfStyles } from '../lib/styles.ts';
  import { usePdfcnTheme } from '../lib/theme.ts';

  const props = withDefaults(
    defineProps<{
      label?: string | undefined;
      variant?: BadgeVariant;
      size?: BadgeSize;
      background?: string | undefined;
      color?: string | undefined;
      style?: Style | undefined;
    }>(),
    { size: 'md', variant: 'default' },
  );

  const theme = usePdfcnTheme();

  const containerStyle = computed<Style>(() => {
    const current = theme.value;
    const { spacing, borderRadius } = current.primitives;
    const c = current.colors;
    const sizes = {
      sm: { paddingHorizontal: spacing[2], paddingVertical: spacing[0.5] },
      md: { paddingHorizontal: spacing[3], paddingVertical: spacing[1] },
      lg: { paddingHorizontal: spacing[4], paddingVertical: spacing[2] },
    };
    const variants: Record<BadgeVariant, { backgroundColor: string; borderColor: string }> = {
      default: { backgroundColor: c.muted, borderColor: c.border },
      destructive: { backgroundColor: c.destructive, borderColor: c.destructive },
      info: { backgroundColor: c.info, borderColor: c.info },
      outline: { backgroundColor: c.background, borderColor: c.border },
      primary: { backgroundColor: c.primary, borderColor: c.primary },
      success: { backgroundColor: c.success, borderColor: c.success },
      warning: { backgroundColor: c.warning, borderColor: c.warning },
    };
    const box = variants[props.variant];
    return mergePdfStyles(
      {
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: props.background
          ? resolveColor(props.background, current.colors)
          : box.backgroundColor,
        borderColor: box.borderColor,
        borderRadius: borderRadius.full,
        borderWidth: spacing[0.5],
        flexDirection: 'row',
      },
      sizes[props.size],
      props.style,
    );
  });

  const textStyle = computed<Style>(() => {
    const current = theme.value;
    const c = current.colors;
    const { fontWeights } = current.primitives;
    const sizes = {
      sm: current.primitives.typography.xs - 1,
      md: current.primitives.typography.xs,
      lg: current.primitives.typography.sm,
    };
    const colors: Record<BadgeVariant, string> = {
      default: c.mutedForeground,
      destructive: c.destructive,
      info: c.info,
      outline: c.foreground,
      primary: c.primaryForeground,
      success: c.success,
      warning: c.warning,
    };
    return {
      color: props.color ? resolveColor(props.color, current.colors) : colors[props.variant],
      fontFamily: current.typography.body.fontFamily,
      fontSize: sizes[props.size],
      fontWeight: fontWeights.semibold,
      letterSpacing: 0.3,
      marginBottom: 0,
      marginTop: 0,
    };
  });
</script>

<template>
  <View :style="containerStyle">
    <Text :style="textStyle">{{ label ?? '' }}</Text>
  </View>
</template>
