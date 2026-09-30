<script setup lang="ts">
  import { CheckIcon, CopyIcon } from '@lucide/vue';
  import { Button } from '@/components/ui/button';
  import { useCopyText } from '@/composables/useCopyText';

  const props = withDefaults(
    defineProps<{
      code: string;
      label?: string;
      copyKey?: string;
    }>(),
    {
      label: 'Copy',
      copyKey: '',
    },
  );

  const { copiedKey, copyText } = useCopyText();
  const key = computed<string>(() => props.copyKey || props.code.slice(0, 64));
</script>

<template>
  <Button
    variant="ghost"
    size="sm"
    class="h-8 gap-1.5 text-xs text-muted-foreground"
    :aria-label="copiedKey === key ? 'Copied' : label"
    @click="copyText(code, key)"
  >
    <CheckIcon
      v-if="copiedKey === key"
      data-icon="inline-start"
    />
    <CopyIcon
      v-else
      data-icon="inline-start"
    />
    {{ copiedKey === key ? 'Copied' : label }}
  </Button>
</template>
