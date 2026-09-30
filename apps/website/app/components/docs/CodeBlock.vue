<script setup lang="ts">
  import { codeToHtml } from 'shiki/bundle/web';
  import CopyButton from './CopyButton.vue';

  const props = withDefaults(
    defineProps<{
      code: string;
      language?: 'vue' | 'ts' | 'json' | 'bash';
      title?: string;
    }>(),
    {
      language: 'vue',
      title: '',
    },
  );

  const colorMode = useColorMode();
  const codeTheme = computed<'github-dark' | 'github-light'>(() =>
    colorMode.value === 'dark' ? 'github-dark' : 'github-light',
  );
  const { data: highlighted } = await useAsyncData(
    `code-${useId()}`,
    () => codeToHtml(props.code, { lang: props.language, theme: codeTheme.value }),
    { watch: [() => props.code, () => props.language, codeTheme] },
  );
</script>

<template>
  <div
    class="code-block min-w-0 overflow-hidden border border-border bg-card text-foreground [&_>_pre]:m-0 [&_>_pre]:w-max [&_>_pre]:min-w-full [&_>_pre]:overflow-x-auto [&_>_pre]:bg-card! [&_>_pre]:px-5 [&_>_pre]:py-4.5 [&_>_pre]:font-mono [&_>_pre]:text-[12px] [&_>_pre]:leading-[1.7]"
  >
    <div
      class="code-header flex min-h-10 items-center justify-between gap-3 border-b border-border bg-muted px-3.5 py-[7px] [&_p]:overflow-hidden [&_p]:text-[11px] [&_p]:[text-overflow:ellipsis] [&_p]:whitespace-nowrap [&_p]:text-muted-foreground"
    >
      <p>{{ title || language }}</p>
      <CopyButton
        :code="code"
        :copy-key="title || language"
        label="Copy"
      />
    </div>
    <div
      v-if="highlighted"
      class="highlighted-code overflow-x-auto font-mono text-[12px] leading-[1.7] [&_code]:[font-family:inherit] [&_pre]:m-0 [&_pre]:w-max [&_pre]:min-w-full [&_pre]:bg-card! [&_pre]:px-5 [&_pre]:py-4.5"
      v-html="highlighted"
    />
    <pre v-else><code>{{ code }}</code></pre>
  </div>
</template>
