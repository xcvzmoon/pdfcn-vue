# @pdfcn-vue/registry

Vue source for the pdfcn registry. The package exposes `@pdfcn-vue/registry` and `@pdfcn-vue/registry/forme` as built module entrypoints. Registry item JSON and public hosting are later phases of the port, so the package remains private for now.

`src/forme/SmokeDocument.vue` is the Foundation render fixture. The docs app imports it through `@/registry/...`, while the Node smoke test loads the same SFC through Vite.

## PDF themes

The nine presets and `defaultPrimitives` are plain objects in `src/themes/`. Their values are PDF points and hex colors, independent of the docs site's shadcn-vue CSS variables.

Wrap a document with `PdfcnThemeProvider` to select a preset. Components below it read the theme through `usePdfcnTheme()`, which returns a computed ref. Without a provider, components use `professionalTheme`. Each serialized document gets its own Vue context, so concurrent renders can use different themes.

```vue
<script setup lang="ts">
import { forestTheme } from '@pdfcn-vue/registry';
import { PdfcnThemeProvider } from '@pdfcn-vue/registry/forme';
import ReportDocument from './ReportDocument.vue';
</script>

<template>
  <PdfcnThemeProvider :theme="forestTheme">
    <ReportDocument />
  </PdfcnThemeProvider>
</template>
```

The presets retain upstream font family names. Register any nonstandard family used by your chosen preset with Forme before rendering the PDF.

Build the module entrypoints:

```bash
vp -C packages/registry run build
```

Check the Node PDF render:

```bash
vp test packages/registry/tests/render-document.test.ts
```
