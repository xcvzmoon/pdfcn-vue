<script setup lang="ts">
  import type { Style } from '@formepdf/vue';
  import { View } from '@formepdf/vue';
  import { computed } from 'vue';

  const props = defineProps<{
    variant: 'solid' | 'dashed' | 'dotted';
    color: string;
    thickness: number;
  }>();

  const lineStyle = computed<Style>(() => ({
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: props.variant === 'dotted' ? 'space-between' : 'flex-start',
    gap: props.variant === 'dotted' ? 3 : 4,
    minHeight: Math.max(props.thickness, 2),
  }));
  const segmentStyle = computed<Style>(() => ({
    backgroundColor: props.color,
    borderRadius: props.variant === 'dotted' ? props.thickness / 2 : 0,
    flexGrow: props.variant === 'dotted' ? 0 : 1,
    flexShrink: 0,
    height: props.thickness,
    width: props.variant === 'dotted' ? props.thickness : 0,
  }));
</script>

<template>
  <View :style="lineStyle">
    <View
      v-for="index in variant === 'solid' ? 1 : 24"
      :key="index"
      :style="segmentStyle"
    />
  </View>
</template>
