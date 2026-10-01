<script setup lang="ts">
  import type { ListItem, ListVariant } from '../../forme/components/list.types.ts';
  import type { Style } from '../lib/styles.ts';
  import { computed } from 'vue';
  import { usePdfcnTheme } from '../../forme/lib/theme.ts';
  import { View } from '../lib/primitives.ts';
  import { mergePdfStyles } from '../lib/styles.ts';
  import PdfListItems from './PdfListItems.vue';

  const props = withDefaults(
    defineProps<{
      items: ListItem[];
      variant?: ListVariant;
      gap?: 'xs' | 'sm' | 'md';
      noWrap?: boolean;
      style?: Style | undefined;
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
    <PdfListItems
      :items="items"
      :variant="variant"
      :gap="gap"
      :no-wrap="noWrap"
      :level="0"
    />
  </View>
</template>
