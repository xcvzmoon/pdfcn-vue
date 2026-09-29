<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { PageHeaderVariant } from './page-chrome.types.ts';
import { Fixed, Text, View } from '@formepdf/vue';
import { computed } from 'vue';
import { resolveColor } from '../lib/resolve-color.ts';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string | undefined;
    rightText?: string | undefined;
    rightSubText?: string | undefined;
    variant?: PageHeaderVariant;
    background?: string | undefined;
    titleColor?: string | undefined;
    marginBottom?: number | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
    fixed?: boolean;
    noWrap?: boolean;
    style?: Style | undefined;
  }>(),
  { fixed: false, noWrap: true, variant: 'simple' },
);

const theme = usePdfcnTheme();
const spacing = computed(() => theme.value.primitives.spacing);
const colors = computed(() => theme.value.colors);

const marginBottom = computed(() => props.marginBottom ?? theme.value.spacing.sectionGap);

const containerBase = computed<Style>(() =>
  mergePdfStyles(
    {
      marginBottom: marginBottom.value,
    },
    props.background
      ? { backgroundColor: resolveColor(props.background, colors.value) }
      : undefined,
    props.style,
  ),
);

const titleStyle = computed<Style>(() => {
  const current = theme.value;
  return mergePdfStyles({
    color: props.titleColor
      ? resolveColor(props.titleColor, current.colors)
      : props.variant === 'branded'
        ? current.colors.primaryForeground
        : current.colors.foreground,
    fontFamily: current.typography.heading.fontFamily,
    fontSize: current.typography.heading.fontSize.h3,
    fontWeight: current.primitives.fontWeights.bold,
    lineHeight: current.typography.heading.lineHeight,
    marginBottom: 0,
    marginTop: 0,
    textAlign: props.variant === 'centered' || props.variant === 'branded' ? 'center' : 'left',
  });
});

const subtitleStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color:
      props.variant === 'branded'
        ? current.colors.primaryForeground
        : current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.typography.body.fontSize,
    lineHeight: current.typography.body.lineHeight,
    marginBottom: 0,
    marginTop: current.primitives.spacing[1],
    textAlign: props.variant === 'centered' ? 'center' : 'left',
  };
});

const rightTextStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.foreground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.typography.body.fontSize,
    fontWeight: current.primitives.fontWeights.medium,
    marginBottom: 0,
    marginTop: 0,
    textAlign: 'right',
  };
});

const rightSubTextStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    marginBottom: 0,
    marginTop: current.primitives.spacing[1],
    textAlign: 'right',
  };
});

const contactInfoStyle = computed<Style>(() => {
  const current = theme.value;
  return {
    color: current.colors.mutedForeground,
    fontFamily: current.typography.body.fontFamily,
    fontSize: current.primitives.typography.xs,
    marginBottom: 0,
    marginTop: current.primitives.spacing[0.5],
    textAlign: 'right',
  };
});

const variantContainerStyle = computed<Style>(() => {
  const s = spacing.value;
  const c = colors.value;
  const current = theme.value;
  const borders = {
    borderBottomColor: c.border,
    borderBottomWidth: s[0.5],
  };

  if (props.variant === 'branded') {
    return mergePdfStyles(containerBase.value, {
      alignItems: 'center',
      backgroundColor: props.background ? resolveColor(props.background, c) : c.primary,
      borderRadius: current.primitives.borderRadius.sm,
      flexDirection: 'column',
      padding: s[6],
    });
  }
  if (props.variant === 'centered') {
    return mergePdfStyles(containerBase.value, borders, {
      alignItems: 'center',
      flexDirection: 'column',
      paddingBottom: s[4],
    });
  }
  if (props.variant === 'minimal') {
    return mergePdfStyles(containerBase.value, {
      alignItems: 'center',
      borderBottomColor: c.primary,
      borderBottomWidth: s[1],
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: s[3],
    });
  }
  if (props.variant === 'logo-left') {
    return mergePdfStyles(containerBase.value, borders, {
      alignItems: 'center',
      flexDirection: 'row',
      paddingBottom: s[4],
    });
  }
  if (props.variant === 'logo-right') {
    return mergePdfStyles(containerBase.value, borders, {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: s[4],
    });
  }
  if (props.variant === 'two-column') {
    return mergePdfStyles(containerBase.value, borders, {
      alignItems: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: s[4],
    });
  }
  return mergePdfStyles(containerBase.value, borders, {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: s[4],
  });
});

const leftColumnStyle = computed<Style>(() => ({ flex: 1, flexDirection: 'column' }));
const rightColumnStyle = computed<Style>(() => ({
  alignItems: 'flex-end',
  flexDirection: 'column',
}));

const showRight = computed(() => props.rightText !== undefined || props.rightSubText !== undefined);
const showContact = computed(
  () => props.address !== undefined || props.phone !== undefined || props.email !== undefined,
);

const logoContainerStyle = computed<Style>(() => ({
  flexShrink: 0,
  height: 48,
  marginRight: spacing.value[4],
  width: 48,
}));
const logoRightContainerStyle = computed<Style>(() => ({
  flexShrink: 0,
  height: 48,
  marginLeft: spacing.value[4],
  width: 48,
}));
const logoContentStyle = computed<Style>(() => ({
  flex: 1,
  flexDirection: 'column',
  paddingLeft: spacing.value[4],
}));
</script>

<template>
  <component
    :is="fixed ? Fixed : View"
    :position="fixed ? 'Header' : undefined"
    :wrap="fixed ? undefined : !noWrap"
    :style="variantContainerStyle"
  >
    <template v-if="variant === 'branded' || variant === 'centered'">
      <Text :style="titleStyle">{{ title }}</Text>
      <Text v-if="subtitle" :style="subtitleStyle">{{ subtitle }}</Text>
    </template>
    <template v-else-if="variant === 'logo-left'">
      <View v-if="$slots.logo" :style="logoContainerStyle"><slot name="logo" /></View>
      <View :style="logoContentStyle">
        <Text :style="titleStyle">{{ title }}</Text>
        <Text v-if="subtitle" :style="subtitleStyle">{{ subtitle }}</Text>
      </View>
      <View v-if="showRight" :style="rightColumnStyle">
        <Text v-if="rightText" :style="rightTextStyle">{{ rightText }}</Text>
        <Text v-if="rightSubText" :style="rightSubTextStyle">{{ rightSubText }}</Text>
      </View>
    </template>
    <template v-else-if="variant === 'logo-right'">
      <View :style="leftColumnStyle">
        <Text :style="titleStyle">{{ title }}</Text>
        <Text v-if="subtitle" :style="subtitleStyle">{{ subtitle }}</Text>
      </View>
      <View v-if="$slots.logo" :style="logoRightContainerStyle"><slot name="logo" /></View>
    </template>
    <template v-else-if="variant === 'two-column'">
      <View :style="leftColumnStyle">
        <Text :style="titleStyle">{{ title }}</Text>
        <Text v-if="subtitle" :style="subtitleStyle">{{ subtitle }}</Text>
      </View>
      <View v-if="showContact" :style="rightColumnStyle">
        <Text v-if="address" :style="contactInfoStyle">{{ address }}</Text>
        <Text v-if="phone" :style="contactInfoStyle">{{ phone }}</Text>
        <Text v-if="email" :style="contactInfoStyle">{{ email }}</Text>
      </View>
    </template>
    <template v-else>
      <View :style="leftColumnStyle">
        <Text :style="titleStyle">{{ title }}</Text>
        <Text v-if="subtitle" :style="subtitleStyle">{{ subtitle }}</Text>
      </View>
      <View v-if="showRight" :style="rightColumnStyle">
        <Text v-if="rightText" :style="rightTextStyle">{{ rightText }}</Text>
        <Text v-if="rightSubText" :style="rightSubTextStyle">{{ rightSubText }}</Text>
      </View>
    </template>
  </component>
</template>
