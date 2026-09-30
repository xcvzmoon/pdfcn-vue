<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import type { SignatureSigner, SignatureVariant } from './signature.types.ts';
  import { Text, View } from '@formepdf/vue';
  import { computed } from 'vue';
  import { mergePdfStyles } from '../lib/styles.ts';
  import { usePdfcnTheme } from '../lib/theme.ts';

  const props = withDefaults(
    defineProps<{
      variant?: SignatureVariant;
      label?: string | undefined;
      name?: string | undefined;
      title?: string | undefined;
      date?: string | undefined;
      signers?: [SignatureSigner, SignatureSigner];
      style?: Style | undefined;
    }>(),
    { label: 'Signature', variant: 'single' },
  );

  const theme = usePdfcnTheme();

  const containerStyle = computed<Style>(() =>
    mergePdfStyles(
      {
        marginBottom: theme.value.spacing.componentGap,
        marginTop: theme.value.spacing.sectionGap,
      },
      props.style,
    ),
  );

  const blockStyle = computed<Style>(() => ({ flex: 1, minWidth: 140 }));

  const lineStyle = computed<Style>(() => ({
    borderBottomColor: theme.value.colors.foreground,
    borderBottomWidth: 1,
    marginBottom: theme.value.primitives.spacing[1],
    minHeight: theme.value.primitives.spacing[6],
  }));

  const labelStyle = computed<Style>(() => ({
    color: theme.value.colors.mutedForeground,
    fontFamily: theme.value.typography.body.fontFamily,
    fontSize: theme.value.primitives.typography.sm,
    marginBottom: theme.value.primitives.spacing[1],
    marginTop: 0,
  }));

  const nameStyle = computed<Style>(() => ({
    color: theme.value.colors.foreground,
    fontFamily: theme.value.typography.body.fontFamily,
    fontSize: theme.value.typography.body.fontSize,
    fontWeight: theme.value.primitives.fontWeights.semibold,
    marginBottom: 0,
    marginTop: 0,
  }));

  const titleStyle = computed<Style>(() => ({
    color: theme.value.colors.mutedForeground,
    fontFamily: theme.value.typography.body.fontFamily,
    fontSize: theme.value.primitives.typography.sm,
    marginBottom: 0,
    marginTop: 0,
  }));

  const dateStyle = computed<Style>(() => ({
    color: theme.value.colors.mutedForeground,
    fontFamily: theme.value.typography.body.fontFamily,
    fontSize: theme.value.primitives.typography.xs,
    marginBottom: 0,
    marginTop: 1,
  }));

  const doubleRowStyle = computed<Style>(() => ({
    flexDirection: 'row',
    gap: theme.value.primitives.spacing[8],
    justifyContent: 'space-between',
  }));

  const inlineRowStyle = computed<Style>(() => ({
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.value.primitives.spacing[3],
  }));

  const inlineLineStyle = computed<Style>(() => ({
    borderBottomColor: theme.value.colors.foreground,
    borderBottomWidth: 1,
    height: theme.value.primitives.spacing[5],
    minWidth: 120,
    paddingHorizontal: theme.value.primitives.spacing[2],
  }));

  const inlineLabelStyle = computed<Style>(() => ({
    color: theme.value.colors.mutedForeground,
    fontFamily: theme.value.typography.body.fontFamily,
    fontSize: theme.value.primitives.typography.sm,
    marginBottom: 0,
    marginTop: 0,
  }));

  const inlineNameStyle = computed<Style>(() => ({
    color: theme.value.colors.foreground,
    fontFamily: theme.value.typography.body.fontFamily,
    fontSize: theme.value.typography.body.fontSize,
    marginBottom: 0,
    marginTop: 0,
  }));

  const defaultSigners = computed<[SignatureSigner, SignatureSigner]>(
    () =>
      props.signers ?? [
        {
          date: props.date ?? '',
          label: 'Authorized by',
          name: props.name ?? '',
          title: props.title ?? '',
        },
        { date: '', label: 'Approved by', name: '', title: '' },
      ],
  );
</script>

<template>
  <View
    :wrap="false"
    :style="containerStyle"
  >
    <View
      v-if="variant === 'inline'"
      :style="inlineRowStyle"
    >
      <Text :style="inlineLabelStyle">{{ `${label}:` }}</Text>
      <View :style="inlineLineStyle" />
      <Text
        v-if="name"
        :style="inlineNameStyle"
        >{{ name }}</Text
      >
    </View>

    <View
      v-else-if="variant === 'double'"
      :style="doubleRowStyle"
    >
      <View
        v-for="(signer, index) in defaultSigners"
        :key="index"
        :style="blockStyle"
      >
        <Text
          v-if="signer.label"
          :style="labelStyle"
          >{{ signer.label }}</Text
        >
        <View :style="lineStyle" />
        <Text
          v-if="signer.name"
          :style="nameStyle"
          >{{ signer.name }}</Text
        >
        <Text
          v-if="signer.title"
          :style="titleStyle"
          >{{ signer.title }}</Text
        >
        <Text
          v-if="signer.date"
          :style="dateStyle"
          >{{ signer.date }}</Text
        >
      </View>
    </View>

    <View
      v-else
      :style="blockStyle"
    >
      <Text :style="labelStyle">{{ label }}</Text>
      <View :style="lineStyle" />
      <Text
        v-if="name"
        :style="nameStyle"
        >{{ name }}</Text
      >
      <Text
        v-if="title"
        :style="titleStyle"
        >{{ title }}</Text
      >
      <Text
        v-if="date"
        :style="dateStyle"
        >{{ date }}</Text
      >
    </View>
  </View>
</template>
