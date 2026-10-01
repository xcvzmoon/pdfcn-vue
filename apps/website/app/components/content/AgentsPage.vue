<script setup lang="ts">
  import CodeBlock from '@/components/docs/CodeBlock.vue';

  const siteOrigin = useRequestURL().origin;
  const namespaceCode = `{
  "registries": {
    "@pdfcn-vue": "${siteOrigin}/r/{name}.json"
  }
}`;
  const installCode = `npx shadcn-vue@latest add @pdfcn-vue/text
npx shadcn-vue@latest add @pdfcn-vue/invoice-minimal`;
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-col gap-3">
      <h1
        class="doc-title"
        data-toc-id="agents"
        data-toc-title="Agent discovery"
        data-toc-level="2"
      >
        Agent discovery
      </h1>

      <p class="max-w-2xl text-muted-foreground">
        Give a coding agent the
        <a
          class="underline"
          href="/llms.txt"
          >llms.txt index</a
        >
        to find the guides and registry endpoints. Registry JSON contains the source files an agent
        needs to inspect before installing components.
      </p>
    </header>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="catalog"
        data-toc-title="Read the catalog"
        data-toc-level="2"
      >
        Read the catalog
      </h2>

      <p class="text-sm leading-7 text-muted-foreground">
        Fetch
        <a
          class="underline"
          href="/r/index.json"
          >/r/index.json</a
        >
        for item names, types, descriptions, and categories. Fetch /r/{name}.json for an item's
        files, npm dependencies, and registryDependencies. The catalog is discovery metadata; the
        individual item payloads contain the installable source.
      </p>

      <p class="text-sm leading-7 text-muted-foreground">
        Start with
        <a
          class="underline"
          href="/r/text.json"
          >text.json</a
        >
        for a primitive or
        <a
          class="underline"
          href="/r/invoice-minimal.json"
          >invoice-minimal.json</a
        >
        for a document block. Inspect the files and dependency graph, then choose only the items
        your document needs. shadcn-vue installs the required registry dependencies with each item.
      </p>
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="install"
        data-toc-title="Install through shadcn-vue"
        data-toc-level="2"
      >
        Install through shadcn-vue
      </h2>

      <p class="text-sm leading-7 text-muted-foreground">
        In a Vue project with shadcn-vue initialized, add the namespace to components.json. Keep the
        existing configuration and registries. This example uses the host serving this page.
      </p>

      <CodeBlock
        :code="namespaceCode"
        language="json"
        title="components.json"
      />
      <CodeBlock
        :code="installCode"
        language="bash"
        title="Terminal"
      />

      <p class="text-sm leading-7 text-muted-foreground">
        The CLI copies source into your project. Review the resulting changes and run your project's
        checks. The
        <NuxtLink
          class="underline"
          to="/docs/registry"
          >registry guide</NuxtLink
        >
        explains target paths and hosting.
      </p>
    </section>

    <section class="flex flex-col gap-3">
      <h2
        class="text-xl font-semibold tracking-tight"
        data-toc-id="render"
        data-toc-title="Choose a rendering path"
        data-toc-level="2"
      >
        Choose a rendering path
      </h2>

      <p class="text-sm leading-7 text-muted-foreground">
        PDF components use Forme's document tree and theme tokens. Follow the
        <NuxtLink
          class="underline"
          to="/docs/rendering"
          >rendering guide</NuxtLink
        >
        for browser or Node PDF output and the
        <NuxtLink
          class="underline"
          to="/docs/nuxt"
          >Nuxt guide</NuxtLink
        >
        for compiler configuration and client boundaries. Use the
        <NuxtLink
          class="underline"
          to="/docs/takumi"
          >Takumi guide</NuxtLink
        >
        for HTML-based PDF rendering. For PDF requirements, read the
        <NuxtLink
          class="underline"
          to="/docs/pdf-standards"
          >PDF standards</NuxtLink
        >
        and
        <NuxtLink
          class="underline"
          to="/docs/fillable-forms"
          >fillable forms</NuxtLink
        >
        guides before choosing document options.
      </p>
    </section>
  </div>
</template>
