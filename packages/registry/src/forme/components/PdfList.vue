<script setup lang="ts">
import type { Style } from '@formepdf/vue';
import type { ListItem, ListVariant } from './list.types.ts';
import { View } from '@formepdf/vue';
import { computed } from 'vue';
import { mergePdfStyles } from '../lib/styles.ts';
import { usePdfcnTheme } from '../lib/theme.ts';
import PdfListItems from './PdfListItems.vue';

const props = withDefaults(
  defineProps<{
    items: ListItem[];
    variant?: ListVariant;
    gap?: 'xs' | 'sm' | 'md';
    noWrap?: boolean;
    style?: Style;
  }>(),
  { variant: 'bullet', gap: 'sm' },
);

const theme = usePdfcnTheme();
const containerStyle = computed<Style>(() =>
  mergePdfStyles(
    {
      flexDirection: 'column',
      marginBottom: theme.value.spacing.componentGap,
      width: '100%',
    },
    props.style,
  ),
);
</script>

<template>
  <View :style="containerStyle">
    <PdfListItems :items="items" :variant="variant" :gap="gap" :no-wrap="noWrap" :level="0" />
  </View>
</template>
