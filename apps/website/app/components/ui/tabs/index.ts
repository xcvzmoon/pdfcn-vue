import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export { default as Tabs } from './Tabs.vue';
export { default as TabsContent } from './TabsContent.vue';
export { default as TabsList } from './TabsList.vue';
export { default as TabsTrigger } from './TabsTrigger.vue';

export const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'gap-1 bg-muted p-1',
        line: 'h-10 gap-2 border-b border-border bg-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export type TabsListVariants = VariantProps<typeof tabsListVariants>;
