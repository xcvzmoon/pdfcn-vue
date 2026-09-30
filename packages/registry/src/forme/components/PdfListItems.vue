<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { ListItem, ListVariant } from './list.types.ts';
  import { Svg, Text, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import { usePdfcnTheme } from '../lib/theme.ts';

  const checkIcon =
    '<path d="M2 6l2.4 2.4L10 3" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />';
  const starIcon =
    '<path d="M6 1l1.4 3.3L11 4.6 8.2 7l.8 3.8L6 8.8 3 10.8 3.8 7 1 4.6l3.6-.3z" fill="#fff" />';

  const props = defineProps<{
    items: ListItem[];
    variant: ListVariant;
    gap: 'xs' | 'sm' | 'md';
    level: number;
    noWrap?: boolean;
  }>();

  const theme = usePdfcnTheme();
  const spacing = computed(() => theme.value.primitives.spacing);
  const rowGap = computed(
    () => ({ xs: spacing.value[1], sm: spacing.value[2], md: spacing.value[3] })[props.gap],
  );
  const nestedStyle = computed<Style>(() => ({
    flexDirection: 'column',
    marginLeft: props.level > 0 ? spacing.value[5] : 0,
    marginTop: props.level > 0 ? spacing.value[1] : 0,
  }));
  const rowStyle = computed<Style>(() => ({
    alignItems:
      props.variant === 'numbered' || props.variant === 'checklist' || props.variant === 'icon'
        ? 'center'
        : 'flex-start',
    flexDirection: 'row',
  }));
  const itemTextStyle = computed<Style>(() => ({
    color:
      props.level > 0 && props.variant === 'multi-level'
        ? theme.value.colors.mutedForeground
        : theme.value.colors.foreground,
    fontFamily: theme.value.typography.body.fontFamily,
    fontSize:
      props.level > 0 && props.variant === 'multi-level'
        ? theme.value.typography.body.fontSize - 0.5
        : theme.value.typography.body.fontSize,
    fontWeight:
      props.variant === 'descriptive' || (props.variant === 'multi-level' && props.level === 0)
        ? theme.value.primitives.fontWeights.semibold
        : theme.value.primitives.fontWeights.regular,
    lineHeight: theme.value.typography.body.lineHeight,
  }));
  const markerStyle = computed<Style>(() => ({
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.value[2],
    width: spacing.value[5],
    height: spacing.value[5],
    borderRadius:
      props.variant === 'numbered' ? spacing.value[5] : theme.value.primitives.borderRadius.md,
    backgroundColor:
      props.variant === 'checklist' ? theme.value.colors.background : theme.value.colors.primary,
    borderColor: theme.value.colors.border,
    borderWidth: props.variant === 'checklist' ? 1 : 0,
  }));
  const checkedMarkerStyle = computed<Style>(() => ({
    ...markerStyle.value,
    backgroundColor: theme.value.colors.success,
    borderColor: theme.value.colors.success,
  }));
  const markerTextStyle = computed<Style>(() => ({
    color:
      props.variant === 'checklist'
        ? theme.value.colors.foreground
        : theme.value.colors.primaryForeground,
    fontFamily: theme.value.typography.body.fontFamily,
    fontSize: theme.value.primitives.typography.xs,
    fontWeight: theme.value.primitives.fontWeights.bold,
  }));
  const bulletStyle = computed<Style>(() => ({
    marginTop: spacing.value[1] + 2,
    marginRight: spacing.value[2],
    width: spacing.value[4],
    height: spacing.value[4],
    alignItems: 'center',
  }));
  const bulletDotStyle = computed<Style>(() => ({
    width: props.level === 0 ? 5 : 4,
    height: props.level === 0 ? 5 : 4,
    borderRadius: props.level === 0 ? 3 : 2,
    backgroundColor: props.level === 0 ? theme.value.colors.primary : 'transparent',
    borderColor: props.level > 0 ? theme.value.colors.mutedForeground : 'transparent',
    borderWidth: props.level > 0 ? 1 : 0,
  }));
  const descriptionStyle = computed<Style>(() => ({
    color: theme.value.colors.mutedForeground,
    fontFamily: theme.value.typography.body.fontFamily,
    fontSize: theme.value.primitives.typography.sm,
    lineHeight: theme.value.typography.body.lineHeight,
    marginTop: 1,
  }));
  const accentStyle = computed<Style>(() => ({
    backgroundColor: theme.value.colors.primary,
    borderRadius: theme.value.primitives.borderRadius.sm,
    marginRight: spacing.value[3],
    minHeight: spacing.value[4],
    width: 3,
  }));
  const textWrapStyle: Style = { flexGrow: 1, flexBasis: 0 };
</script>

<template>
  <View :style="nestedStyle">
    <View
      v-for="(item, index) in items"
      :key="index"
      :wrap="!noWrap"
      :style="{ marginBottom: index === items.length - 1 ? 0 : rowGap }"
    >
      <View :style="rowStyle">
        <View
          v-if="variant === 'bullet' || variant === 'multi-level'"
          :style="bulletStyle"
        >
          <View :style="bulletDotStyle" />
        </View>
        <View
          v-else-if="variant === 'descriptive'"
          :style="accentStyle"
        />
        <View
          v-else
          :style="
            variant === 'checklist' && (item.checked ?? true) ? checkedMarkerStyle : markerStyle
          "
        >
          <Text
            v-if="variant === 'numbered'"
            :style="markerTextStyle"
            >{{ index + 1 }}</Text
          >
          <Svg
            v-else-if="variant === 'icon'"
            :width="12"
            :height="12"
            view-box="0 0 12 12"
            :content="starIcon"
          />
          <Svg
            v-else-if="item.checked ?? true"
            :width="12"
            :height="12"
            view-box="0 0 12 12"
            :content="checkIcon"
          />
        </View>
        <View :style="textWrapStyle">
          <Text :style="itemTextStyle">{{ item.text }}</Text>
          <Text
            v-if="variant === 'descriptive' && item.description"
            :style="descriptionStyle"
          >
            {{ item.description }}
          </Text>
        </View>
      </View>
      <PdfListItems
        v-if="item.children?.length && (variant === 'bullet' || variant === 'multi-level')"
        :items="item.children"
        :variant="variant"
        :gap="gap"
        :no-wrap="noWrap"
        :level="level + 1"
      />
    </View>
  </View>
</template>
