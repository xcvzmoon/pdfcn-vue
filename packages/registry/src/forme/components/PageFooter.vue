<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { PageFooterVariant } from './page-chrome.types.ts';
  import { Fixed, Text, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import { resolveColor } from '../lib/resolve-color.ts';
  import { mergePdfStyles } from '../lib/styles.ts';
  import { usePdfcnTheme } from '../lib/theme.ts';

  const props = withDefaults(
    defineProps<{
      leftText?: string | undefined;
      rightText?: string | undefined;
      centerText?: string | undefined;
      variant?: PageFooterVariant;
      background?: string | undefined;
      textColor?: string | undefined;
      marginTop?: number | undefined;
      address?: string | undefined;
      phone?: string | undefined;
      email?: string | undefined;
      website?: string | undefined;
      fixed?: boolean;
      sticky?: boolean;
      pagePadding?: number | undefined;
      noWrap?: boolean;
      style?: Style | undefined;
    }>(),
    {
      fixed: false,
      noWrap: true,
      pagePadding: 0,
      sticky: false,
      variant: 'simple',
    },
  );

  const theme = usePdfcnTheme();
  const spacing = computed(() => theme.value.primitives.spacing);
  const colors = computed(() => theme.value.colors);

  const isFixed = computed(() => props.fixed || props.sticky);
  const marginTop = computed(() =>
    props.sticky ? 0 : (props.marginTop ?? theme.value.spacing.sectionGap),
  );

  const resolvedTextColor = computed(() =>
    props.textColor ? resolveColor(props.textColor, colors.value) : undefined,
  );

  function textBase(): Style {
    const current = theme.value;
    return {
      color: resolvedTextColor.value ?? current.colors.mutedForeground,
      fontFamily: current.typography.body.fontFamily,
      fontSize: current.primitives.typography.xs,
      lineHeight: current.typography.body.lineHeight,
      marginBottom: 0,
      marginTop: 0,
    };
  }

  const containerStyle = computed<Style>(() => {
    const s = spacing.value;
    const c = colors.value;
    const shared = mergePdfStyles(
      { marginTop: marginTop.value },
      props.background ? { backgroundColor: resolveColor(props.background, c) } : undefined,
      props.style,
    );

    if (props.variant === 'branded') {
      return mergePdfStyles(shared, {
        alignItems: 'center',
        backgroundColor: props.background ? resolveColor(props.background, c) : c.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: s[4],
        paddingVertical: s[3],
      });
    }
    if (props.variant === 'centered') {
      return mergePdfStyles(shared, {
        alignItems: 'center',
        borderTopColor: c.border,
        borderTopWidth: s[0.5],
        flexDirection: 'column',
        paddingTop: s[3],
      });
    }
    if (props.variant === 'detailed') {
      return mergePdfStyles(shared, {
        borderTopColor: c.border,
        borderTopWidth: s[1],
        flexDirection: 'column',
        paddingTop: s[3],
      });
    }
    if (props.variant === 'minimal') {
      return mergePdfStyles(shared, {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: s[1],
        paddingTop: s[1],
      });
    }
    if (props.variant === 'three-column') {
      return mergePdfStyles(shared, {
        alignItems: 'flex-start',
        borderTopColor: c.border,
        borderTopWidth: s[0.5],
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: s[3],
      });
    }
    return mergePdfStyles(shared, {
      alignItems: 'center',
      borderTopColor: c.border,
      borderTopWidth: s[0.5],
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: s[3],
    });
  });

  const leftStyle = computed<Style>(() =>
    mergePdfStyles(textBase(), {
      color: resolvedTextColor.value ?? theme.value.colors.foreground,
      flex:
        props.variant === 'simple' && props.centerText
          ? 160
          : props.variant === 'simple'
            ? 360
            : undefined,
      fontWeight:
        props.variant === 'detailed'
          ? theme.value.primitives.fontWeights.bold
          : props.variant === 'branded'
            ? theme.value.primitives.fontWeights.medium
            : theme.value.primitives.fontWeights.medium,
      textAlign: props.variant === 'branded' ? undefined : undefined,
    }),
  );

  const centerStyle = computed<Style>(() =>
    mergePdfStyles(textBase(), {
      flex: props.variant === 'simple' ? 160 : props.variant === 'three-column' ? 1 : undefined,
      textAlign: props.variant === 'three-column' ? 'center' : 'center',
    }),
  );

  const rightStyle = computed<Style>(() =>
    mergePdfStyles(textBase(), {
      color:
        props.variant === 'branded'
          ? (resolvedTextColor.value ?? theme.value.colors.primaryForeground)
          : (resolvedTextColor.value ?? theme.value.colors.mutedForeground),
      flex: props.variant === 'simple' ? (props.centerText ? 160 : 120) : undefined,
      fontWeight:
        props.variant === 'branded' ? theme.value.primitives.fontWeights.medium : undefined,
      textAlign: 'right',
    }),
  );

  const contactCenterStyle = computed<Style>(() =>
    mergePdfStyles(textBase(), {
      fontSize: theme.value.primitives.typography.xs - 1,
      marginTop: spacing.value[0.5],
      textAlign: 'center',
    }),
  );

  const detailedPageNumberStyle = computed<Style>(() =>
    mergePdfStyles(textBase(), {
      borderTopColor: colors.value.border,
      borderTopWidth: spacing.value[0.5],
      paddingTop: spacing.value[2],
      textAlign: 'center',
    }),
  );

  const threeColumnLeft = computed<Style>(() => ({ flex: 1, flexDirection: 'column' }));
  const threeColumnCenter = computed<Style>(() => ({
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  }));
  const threeColumnRight = computed<Style>(() => ({
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'column',
  }));
  const detailedTopRow = computed<Style>(() => ({
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.value[2],
  }));
  const detailedLeft = computed<Style>(() => ({ flex: 1, flexDirection: 'column' }));
  const detailedRight = computed<Style>(() => ({
    alignItems: 'flex-end',
    flexDirection: 'column',
  }));
</script>

<template>
  <component
    :is="isFixed ? Fixed : View"
    :position="isFixed ? 'Footer' : undefined"
    :wrap="isFixed ? undefined : !noWrap"
    :style="containerStyle"
  >
    <template v-if="variant === 'branded' || variant === 'minimal'">
      <Text
        v-if="leftText"
        :style="leftStyle"
        >{{ leftText }}</Text
      >
      <Text
        v-if="rightText"
        :style="rightStyle"
        >{{ rightText }}</Text
      >
    </template>

    <template v-else-if="variant === 'centered'">
      <Text
        v-if="leftText"
        :style="centerStyle"
        >{{ leftText }}</Text
      >
      <Text
        v-if="rightText"
        :style="centerStyle"
        >{{ rightText }}</Text
      >
    </template>

    <template v-else-if="variant === 'three-column'">
      <View :style="threeColumnLeft">
        <Text
          v-if="leftText"
          :style="leftStyle"
          >{{ leftText }}</Text
        >
        <Text
          v-if="address"
          :style="textBase()"
          >{{ address }}</Text
        >
      </View>
      <View :style="threeColumnCenter">
        <Text
          v-if="phone"
          :style="contactCenterStyle"
          >{{ phone }}</Text
        >
        <Text
          v-if="email"
          :style="contactCenterStyle"
          >{{ email }}</Text
        >
        <Text
          v-if="website"
          :style="contactCenterStyle"
          >{{ website }}</Text
        >
      </View>
      <View :style="threeColumnRight">
        <Text
          v-if="rightText"
          :style="rightStyle"
          >{{ rightText }}</Text
        >
      </View>
    </template>

    <template v-else-if="variant === 'detailed'">
      <View :style="detailedTopRow">
        <View :style="detailedLeft">
          <Text
            v-if="leftText"
            :style="leftStyle"
            >{{ leftText }}</Text
          >
          <Text
            v-if="address"
            :style="textBase()"
            >{{ address }}</Text
          >
        </View>
        <View :style="detailedRight">
          <Text
            v-if="phone"
            :style="rightStyle"
            >Phone: {{ phone }}</Text
          >
          <Text
            v-if="email"
            :style="rightStyle"
            >Email: {{ email }}</Text
          >
          <Text
            v-if="website"
            :style="rightStyle"
            >Web: {{ website }}</Text
          >
        </View>
      </View>
      <Text
        v-if="rightText"
        :style="detailedPageNumberStyle"
        >{{ rightText }}</Text
      >
    </template>

    <template v-else>
      <Text
        v-if="leftText"
        :style="leftStyle"
        >{{ leftText }}</Text
      >
      <Text
        v-if="centerText"
        :style="centerStyle"
        >{{ centerText }}</Text
      >
      <Text
        v-if="rightText"
        :style="rightStyle"
        >{{ rightText }}</Text
      >
    </template>
  </component>
</template>
