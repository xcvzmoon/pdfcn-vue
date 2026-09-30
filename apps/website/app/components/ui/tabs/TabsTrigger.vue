<script setup lang="ts">
import type { TabsTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TabsTrigger, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>();
const forwardedProps = useForwardProps(reactiveOmit(props, 'class'));
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    v-bind="forwardedProps"
    :class="cn(
      'relative inline-flex min-h-8 items-center justify-center gap-1.5 px-3 text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground [&_svg]:size-3.5',
      'group-data-[variant=default]/tabs-list:data-[state=active]:bg-background',
      'group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:inset-x-0 group-data-[variant=line]/tabs-list:after:-bottom-px group-data-[variant=line]/tabs-list:after:h-px group-data-[variant=line]/tabs-list:after:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:after:bg-foreground',
      props.class,
    )"
  >
    <slot />
  </TabsTrigger>
</template>
