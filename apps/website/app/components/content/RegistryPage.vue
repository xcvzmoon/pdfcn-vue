<script setup lang="ts">
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import { Badge } from '@/components/ui/badge';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { blockDocs } from '@/data/blocks';
  import { componentDocs } from '@/data/components';

  const siteOrigin = useRequestURL().origin;
  const namespaceCode = `{
  "registries": {
    "@pdfcn-vue": "${siteOrigin}/r/{name}.json"
  }
}`;

  const installExamples = [
    'npx shadcn-vue@latest add @pdfcn-vue/pdfcn-core',
    'npx shadcn-vue@latest add @pdfcn-vue/theme-minimal',
    'npx shadcn-vue@latest add @pdfcn-vue/invoice-minimal',
  ];

  const categories = [
    {
      name: 'pdfcn-core',
      type: 'lib',
      description: 'Theme types, resolve-color, style helpers, default professional theme.',
    },
    {
      name: 'theme-provider',
      type: 'component',
      description: 'PdfcnThemeProvider for provide/inject theming.',
    },
    {
      name: 'theme-*',
      type: 'lib',
      description:
        'Nine presets: professional, modern, minimal, executive, corporate, elegant, vivid, forest, blueprint.',
    },
    {
      name: 'block-shared',
      type: 'lib',
      description: 'Formatters and ReportLayout shared by report and invoice blocks.',
    },
  ];
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-3">
      <h1
        class="doc-title"
        data-toc-id="registry"
        data-toc-title="Registry"
        data-toc-level="2"
      >
        Registry
      </h1>
      <p class="max-w-2xl text-muted-foreground">
        Every installable item is valid shadcn-vue registry JSON, built from the import graph in
        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
          >packages/registry</code
        >.
      </p>
    </header>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="namespace"
        data-toc-title="Namespace"
        data-toc-level="2"
      >
        Namespace
      </h2>
      <CodeBlock
        :code="namespaceCode"
        language="json"
        title="components.json"
      />
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="commands"
        data-toc-title="Install commands"
        data-toc-level="2"
      >
        Install commands
      </h2>
      <div class="flex flex-col gap-2">
        <CodeBlock
          v-for="command in installExamples"
          :key="command"
          :code="command"
          language="bash"
          title="Terminal"
        />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="core-items"
        data-toc-title="Core items"
        data-toc-level="2"
      >
        Core items
      </h2>
      <div class="overflow-x-auto border-y border-border">
        <Table class="min-w-[560px] table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead class="w-[28%] font-mono text-[10px] tracking-wider uppercase"
                >Item</TableHead
              >
              <TableHead class="w-[18%] font-mono text-[10px] tracking-wider uppercase"
                >Type</TableHead
              >
              <TableHead class="font-mono text-[10px] tracking-wider uppercase"
                >Description</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="item in categories"
              :key="item.name"
              class="odd:bg-muted/30 hover:bg-muted/70"
            >
              <TableCell
                class="align-top font-mono text-xs font-medium break-words whitespace-normal"
                >{{ item.name }}</TableCell
              >
              <TableCell>
                <Badge
                  variant="outline"
                  class="font-mono text-[10px]"
                  >{{ item.type }}</Badge
                >
              </TableCell>
              <TableCell
                class="align-top text-xs leading-6 whitespace-normal text-muted-foreground"
                >{{ item.description }}</TableCell
              >
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="catalog"
        data-toc-title="Catalog size"
        data-toc-level="2"
      >
        Catalog size
      </h2>
      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">{{ componentDocs.length }} components</CardTitle>
            <CardDescription>Primitives, layout, data, and page chrome.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle class="text-base">{{ blockDocs.length }} blocks</CardTitle>
            <CardDescription
              >Invoices, reports, ops, comms, and education templates.</CardDescription
            >
          </CardHeader>
        </Card>
      </div>
      <p class="text-sm text-muted-foreground">
        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
          >registryDependencies</code
        >
        are derived from real imports, so installing a block pulls tables, chrome, and theme helpers
        for you.
      </p>
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="hosting"
        data-toc-title="Hosting"
        data-toc-level="2"
      >
        Hosting
      </h2>
      <Card>
        <CardContent class="flex flex-col gap-2 pt-4 text-sm text-muted-foreground">
          <p>
            Serve <code class="font-mono text-xs text-foreground">/r/*.json</code> as
            <code class="font-mono text-xs text-foreground">application/json</code> and allow CORS
            for browser clients. This repo ships
            <code class="font-mono text-xs text-foreground">apps/website/public/_headers</code> for
            Cloudflare Pages.
          </p>
          <p>
            Build with
            <code class="font-mono text-xs text-foreground">vp run registry:build</code>
            and optionally set
            <code class="font-mono text-xs text-foreground">PDFCN_VUE_REGISTRY_BASE</code>
            so dependency URLs match production.
          </p>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
