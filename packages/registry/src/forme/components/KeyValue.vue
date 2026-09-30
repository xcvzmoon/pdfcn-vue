<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { KeyValueDirection, KeyValueEntry, KeyValueSize } from './key-value.types.ts';
  import { Text, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import { resolveColor } from '../lib/resolve-color.ts';
  import { mergePdfStyles } from '../lib/styles.ts';
  import { usePdfcnTheme } from '../lib/theme.ts';

  const props = withDefaults(
    defineProps<{
      items: KeyValueEntry[];
      direction?: KeyValueDirection;
      divided?: boolean;
      size?: KeyValueSize;
      labelFlex?: number | undefined;
      labelColor?: string | undefined;
      valueColor?: string | undefined;
      boldValue?: boolean;
      noWrap?: boolean;
      dividerColor?: string | undefined;
      dividerThickness?: number | undefined;
      dividerMargin?: number | undefined;
      style?: Style | undefined;
    }>(),
    {
      boldValue: false,
      direction: 'horizontal',
      divided: false,
      labelFlex: 1,
      noWrap: false,
      size: 'md',
    },
  );

  const theme = usePdfcnTheme();

  function keyBaseStyle(): Style {
    const current = theme.value;
    return {
      color: current.colors.mutedForeground,
      fontFamily: current.typography.body.fontFamily,
      fontWeight: current.primitives.fontWeights.medium,
      marginBottom: 0,
      marginTop: 0,
    };
  }

  function valueBaseStyle(): Style {
    const current = theme.value;
    return {
      color: current.colors.foreground,
      fontFamily: current.typography.body.fontFamily,
      fontWeight: current.primitives.fontWeights.regular,
      marginBottom: 0,
      marginTop: 0,
    };
  }

  function sizeFontSize(size: KeyValueSize): number {
    const typography = theme.value.primitives.typography;
    if (size === 'sm') return typography.xs;
    if (size === 'lg') return typography.base;
    return theme.value.typography.body.fontSize;
  }

  function keyStyleFor(item: KeyValueEntry): Style {
    const color = props.labelColor
      ? resolveColor(props.labelColor, theme.value.colors)
      : keyBaseStyle().color;
    return mergePdfStyles(
      keyBaseStyle(),
      { color, fontSize: sizeFontSize(props.size) },
      item.keyStyle,
    );
  }

  function valueStyleFor(item: KeyValueEntry): Style {
    const resolved = item.valueColor ?? props.valueColor;
    return mergePdfStyles(
      valueBaseStyle(),
      {
        color: resolved ? resolveColor(resolved, theme.value.colors) : valueBaseStyle().color,
        fontSize: sizeFontSize(props.size),
        fontWeight: props.boldValue
          ? theme.value.primitives.fontWeights.bold
          : valueBaseStyle().fontWeight,
      },
      item.valueStyle,
    );
  }

  function rowStyle(index: number): Style {
    const current = theme.value;
    const { spacing } = current.primitives;
    const isLast = index === props.items.length - 1;
    const dividerStyle: Style = {};
    if (props.dividerColor) {
      dividerStyle.borderBottomColor = resolveColor(props.dividerColor, current.colors);
    }
    if (props.dividerThickness !== undefined) {
      dividerStyle.borderBottomWidth = props.dividerThickness;
    }
    if (props.dividerMargin !== undefined) {
      dividerStyle.marginBottom = props.dividerMargin;
    }

    if (props.direction === 'horizontal') {
      return mergePdfStyles(
        {
          alignItems: 'flex-start',
          flexDirection: 'row',
          paddingVertical: spacing[1],
          width: '100%',
        },
        props.divided
          ? isLast
            ? { borderBottomWidth: 0.01, borderBottomColor: '#ffffff' }
            : mergePdfStyles(
                {
                  borderBottomColor: current.colors.border,
                  borderBottomWidth: spacing[0.5],
                },
                dividerStyle,
              )
          : undefined,
      );
    }

    return mergePdfStyles(
      {
        flexDirection: 'column',
        marginBottom: current.spacing.paragraphGap,
      },
      props.divided && !isLast
        ? mergePdfStyles(
            {
              borderBottomColor: current.colors.border,
              borderBottomWidth: spacing[0.5],
            },
            dividerStyle,
          )
        : undefined,
    );
  }

  const containerStyle = computed<Style>(() =>
    mergePdfStyles({ flexDirection: 'column', width: '100%' }, props.style),
  );
</script>

<template>
  <View
    :wrap="!noWrap"
    :style="containerStyle"
  >
    <View
      v-for="(item, index) in items"
      :key="`${item.key}-${index}`"
      :style="rowStyle(index)"
    >
      <template v-if="direction === 'horizontal'">
        <Text :style="[keyStyleFor(item), { flex: labelFlex }]">{{ item.key }}</Text>
        <Text :style="[valueStyleFor(item), { flex: 1, textAlign: 'right' }]">{{
          item.value
        }}</Text>
      </template>
      <template v-else>
        <Text :style="keyStyleFor(item)">{{ item.key }}</Text>
        <Text :style="valueStyleFor(item)">{{ item.value }}</Text>
      </template>
    </View>
  </View>
</template>
