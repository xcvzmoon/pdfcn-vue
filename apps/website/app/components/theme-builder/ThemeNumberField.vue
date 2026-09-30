<script setup lang="ts">
  defineProps<{
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    token: string;
  }>();
  const emit = defineEmits<{ change: [value: number] }>();

  function update(event: Event): void {
    if (event.target instanceof HTMLInputElement) emit('change', event.target.valueAsNumber);
  }
</script>

<template>
  <label
    class="number-field flex items-center justify-between gap-4 border-b border-border px-0 py-3.5 text-[12px] [&_input]:w-20 [&_input]:border [&_input]:border-border [&_input]:bg-transparent [&_input]:px-2 [&_input]:py-[7px] [&_input]:font-mono [&_input]:text-[11px] [&_small]:font-mono [&_small]:text-[8px] [&_small]:text-muted-foreground [&_span]:flex [&_span]:flex-col [&_span]:gap-0.5"
    ><span
      >{{ label }}<small>{{ unit ?? 'pt' }}</small></span
    ><input
      :value="value"
      :min="min"
      :max="max"
      :step="step ?? 1"
      :aria-label="label"
      :name="token"
      type="number"
      @input="update"
  /></label>
</template>
