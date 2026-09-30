<script setup lang="ts">
  import * as v from 'valibot';

  const props = defineProps<{ label: string; value: string; token: string }>();
  const emit = defineEmits<{ change: [value: string] }>();
  const text = ref<string>(props.value);
  const valid = computed<boolean>(
    () => v.safeParse(v.pipe(v.string(), v.regex(/^#[\da-f]{6}$/i)), text.value).success,
  );

  function update(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    text.value = event.target.value;
    if (valid.value) emit('change', text.value);
  }

  watch(
    () => props.value,
    (value) => {
      text.value = value;
    },
  );
</script>

<template>
  <div
    class="color-field relative grid grid-cols-[1fr_118px] gap-3 border-b border-border px-0 py-3"
  >
    <label
      :for="`color-${token}`"
      class="color-label flex flex-col gap-0.5 text-[12px] [&_span]:text-[8px] [&_span]:tracking-[0.03em] [&_span]:text-muted-foreground [&_span]:normal-case"
      >{{ label
      }}<span class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase">{{
        token
      }}</span></label
    >
    <div class="color-inputs flex h-8 items-center border border-border">
      <input
        :id="`color-${token}`"
        :value="value"
        :aria-label="`Choose ${label} color`"
        type="color"
        class="color-swatch h-7.5 w-7 cursor-pointer bg-transparent p-[3px] [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
        @input="update"
      /><input
        :value="text"
        :aria-invalid="!valid"
        :aria-label="`${label} hex value`"
        :aria-describedby="!valid ? `error-${token}` : undefined"
        class="color-hex w-[85px] min-w-0 bg-transparent px-1.5 py-[5px] font-mono text-[10px]"
        spellcheck="false"
        maxlength="7"
        @input="update"
      />
    </div>
    <p
      v-if="!valid"
      :id="`error-${token}`"
      class="color-error col-span-full text-[10px] text-destructive"
    >
      Use a six-digit hex color.
    </p>
  </div>
</template>
