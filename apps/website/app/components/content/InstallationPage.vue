<script setup lang="ts">
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Separator } from '@/components/ui/separator';

  const siteOrigin = useRequestURL().origin;
  const registryConfig = `{
  "registries": {
    "@pdfcn-vue": "${siteOrigin}/r/{name}.json"
  }
}`;

  const installCommands = `# Theme tokens and helpers
npx shadcn-vue@latest add @pdfcn-vue/pdfcn-core

# Optional theme preset (professional is the default)
npx shadcn-vue@latest add @pdfcn-vue/theme-minimal

# Components
npx shadcn-vue@latest add @pdfcn-vue/text @pdfcn-vue/heading @pdfcn-vue/stack

# Full document (installs its dependencies)
npx shadcn-vue@latest add @pdfcn-vue/invoice-minimal`;

  const usageCode = [
    '<script setup lang="ts">',
    "import PdfcnThemeProvider from '@/components/pdf/PdfcnThemeProvider.vue';",
    "import Text from '@/components/pdf/Text.vue';",
    "import Heading from '@/components/pdf/Heading.vue';",
    "import { Document, Page } from '@formepdf/vue';",
    "import { minimalTheme } from '@/lib/pdfcn/themes/minimal';",
    '\u003c/script>',
    '',
    '<template>',
    '  <PdfcnThemeProvider :theme="minimalTheme">',
    '    <Document title="Hello pdfcn-vue">',
    '      <Page :margin="56">',
    '        <Heading :level="2">Invoice</Heading>',
    '        <Text>Prepared for Acme Studio.</Text>',
    '      </Page>',
    '    </Document>',
    '  </PdfcnThemeProvider>',
    '</template>',
  ].join('\n');
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-3">
      <h1
        class="doc-title"
        data-toc-id="install"
        data-toc-title="Installation"
        data-toc-level="2"
      >
        Installation
      </h1>
      <p class="max-w-2xl text-muted-foreground">
        The shadcn-vue CLI copies pdfcn-vue source files into your repository. Start by adding the
        registry namespace.
      </p>
    </header>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="prerequisites"
        data-toc-title="Prerequisites"
        data-toc-level="2"
      >
        Prerequisites
      </h2>
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Toolchain</CardTitle>
          <CardDescription>
            Vue 3.4+, Vite, Tailwind CSS v4, and shadcn-vue configured in your app.
          </CardDescription>
        </CardHeader>
        <CardContent class="text-sm text-muted-foreground">
          Install Forme packages when the CLI asks, or add them up front:
          <code class="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
            >@formepdf/vue</code
          >
          and
          <code class="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
            >@formepdf/core</code
          >.
        </CardContent>
      </Card>
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="namespace"
        data-toc-title="Register namespace"
        data-toc-level="2"
      >
        Register the namespace
      </h2>
      <p class="text-sm text-muted-foreground">
        Point
        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
          >@pdfcn-vue</code
        >
        at your hosted
        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">/r</code>
        directory in <code class="font-mono text-xs text-foreground">components.json</code>.
      </p>
      <CodeBlock
        :code="registryConfig"
        language="json"
        title="components.json"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="install-items"
        data-toc-title="Install items"
        data-toc-level="2"
      >
        Install items
      </h2>
      <CodeBlock
        :code="installCommands"
        language="bash"
        title="Terminal"
      />
      <Alert>
        <AlertTitle>Flat namespace</AlertTitle>
        <AlertDescription>
          Forme is the only v1 engine, so item names omit an engine segment.
        </AlertDescription>
      </Alert>
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="compose"
        data-toc-title="Compose a document"
        data-toc-level="2"
      >
        Compose a document
      </h2>
      <CodeBlock
        :code="usageCode"
        language="vue"
        title="App.vue"
      />
    </section>

    <Separator />

    <p class="text-sm text-muted-foreground">
      Next:
      <NuxtLink
        class="font-medium text-foreground underline-offset-4 hover:underline"
        to="/docs/theming"
        >Theming</NuxtLink
      >
      ·
      <NuxtLink
        class="font-medium text-foreground underline-offset-4 hover:underline"
        to="/docs/components"
      >
        Components
      </NuxtLink>
    </p>
  </div>
</template>
