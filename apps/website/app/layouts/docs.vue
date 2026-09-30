<script setup lang="ts">
  import { ArrowUpRightIcon, ChevronDownIcon } from '@lucide/vue';
  import { blockDocs } from '@/data/blocks';
  import { componentDocs, componentCategories } from '@/data/components';
  import { docsNav } from '@/data/navigation';

  const route = useRoute();
  const navigationOpen = ref<boolean>(false);
  const currentTitle = computed<string>(() => {
    const component = componentDocs.find(({ slug }) => route.path === `/docs/components/${slug}`);
    const block = blockDocs.find(({ slug }) => route.path === `/docs/blocks/${slug}`);
    if (component) return component.title;
    if (block) return block.title;
    for (const section of docsNav) {
      const item = section.items.find(({ href }) => href === route.path);
      if (item) return item.title;
    }
    return 'Documentation';
  });
  watch(
    () => route.path,
    () => {
      navigationOpen.value = false;
    },
  );
</script>

<template>
  <div
    class="site-width docs-shell mx-auto grid w-[min(100%_-_80px,_1440px)] grid-cols-[224px_minmax(0,_1fr)] gap-16 max-[1100px]:grid-cols-[200px_minmax(0,_1fr)] max-[1100px]:gap-8 max-[760px]:block max-[760px]:w-[calc(100%_-_32px)]"
  >
    <button
      :aria-expanded="navigationOpen"
      class="docs-mobile-trigger hidden max-[760px]:flex max-[760px]:w-full max-[760px]:justify-between max-[760px]:gap-4 max-[760px]:border-b max-[760px]:border-border max-[760px]:px-0 max-[760px]:py-4.5"
      aria-controls="docs-navigation"
      @click="navigationOpen = !navigationOpen"
    >
      <span class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase"
        >Documentation / {{ currentTitle }}</span
      ><ChevronDownIcon :size="16" />
    </button>
    <aside
      :class="{ 'navigation-open': navigationOpen }"
      id="docs-navigation"
      class="docs-sidebar sticky top-[77px] max-h-[calc(100dvh_-_77px)] [scrollbar-width:thin] overflow-y-auto border-r border-border pt-8 pr-5 pb-10 pl-0 max-[760px]:static max-[760px]:hidden max-[760px]:max-h-[65vh] max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:border-border max-[760px]:px-2 max-[760px]:py-6 max-[760px]:[&.navigation-open]:block"
    >
      <nav aria-label="Documentation navigation">
        <div
          v-for="section in docsNav"
          :key="section.label"
          class="nav-section mb-6 flex flex-col gap-0.5 [&_a]:min-h-9 [&_a]:px-3.5 [&_a]:py-[9px] [&_a]:text-[12px] [&_a.selected]:bg-accent [&_a.selected]:font-medium [&_a.selected]:text-accent-foreground [&_a:hover]:bg-muted [&_h2]:mb-[9px] [&_h2]:text-[9px] [&_h2]:text-muted-foreground"
        >
          <h2 class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase">
            {{ section.label }}
          </h2>
          <NuxtLink
            v-for="item in section.items"
            :key="item.href"
            :to="item.href"
            :class="{ selected: route.path === item.href }"
            :aria-current="route.path === item.href ? 'page' : undefined"
            >{{ item.title }}</NuxtLink
          >
        </div>
        <div
          v-for="category in componentCategories"
          :key="category.id"
          class="nav-section mb-6 flex flex-col gap-0.5 [&_a]:min-h-9 [&_a]:px-3.5 [&_a]:py-[9px] [&_a]:text-[12px] [&_a.selected]:bg-accent [&_a.selected]:font-medium [&_a.selected]:text-accent-foreground [&_a:hover]:bg-muted [&_h2]:mb-[9px] [&_h2]:text-[9px] [&_h2]:text-muted-foreground"
        >
          <h2 class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase">
            {{ category.label }}
          </h2>
          <NuxtLink
            v-for="item in componentDocs.filter((entry) => entry.category === category.id)"
            :key="item.slug"
            :to="`/docs/components/${item.slug}`"
            :class="{ selected: route.path === `/docs/components/${item.slug}` }"
            :aria-current="route.path === `/docs/components/${item.slug}` ? 'page' : undefined"
            >{{ item.title }}</NuxtLink
          >
        </div>
        <div
          class="nav-section mb-6 flex flex-col gap-0.5 [&_a]:min-h-9 [&_a]:px-3.5 [&_a]:py-[9px] [&_a]:text-[12px] [&_a.selected]:bg-accent [&_a.selected]:font-medium [&_a.selected]:text-accent-foreground [&_a:hover]:bg-muted [&_h2]:mb-[9px] [&_h2]:text-[9px] [&_h2]:text-muted-foreground"
        >
          <h2 class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase">
            Document blocks
          </h2>
          <NuxtLink
            v-for="item in blockDocs"
            :key="item.slug"
            :to="`/docs/blocks/${item.slug}`"
            :class="{ selected: route.path === `/docs/blocks/${item.slug}` }"
            :aria-current="route.path === `/docs/blocks/${item.slug}` ? 'page' : undefined"
            >{{ item.title }}</NuxtLink
          >
        </div>
      </nav>
      <a
        class="sidebar-source eyebrow flex items-center gap-2.5 font-mono text-[8px] leading-[1.6] tracking-[0.12em] uppercase"
        href="https://github.com/xcvzmoon/pdfcn-vue"
        target="_blank"
        rel="noreferrer"
        >Contribute on GitHub<ArrowUpRightIcon :size="13"
      /></a>
    </aside>
    <main
      id="main-content"
      class="docs-main max-w-225 min-w-0 pt-8 pb-16 max-[760px]:pt-6"
    >
      <div
        class="docs-breadcrumb eyebrow mb-8 flex gap-3 font-mono text-[9px] leading-[1.6] tracking-[0.12em] text-muted-foreground uppercase max-[760px]:mb-6 [&_>_:last-child]:text-foreground"
      >
        <NuxtLink to="/docs">Docs</NuxtLink><span>/</span><span>{{ currentTitle }}</span>
      </div>
      <article
        class="docs-article min-w-0 [&_>_div_>_header]:border-b [&_>_div_>_header]:border-border [&_>_div_>_header]:pb-8 [&_a:not([role='button'])]:underline-offset-[4px] [&_h1]:text-[clamp(2.5rem,_4vw,_3.8rem)] [&_h1]:leading-[1.08] [&_h1]:font-medium [&_h1]:tracking-[-0.04em] [&_h2]:[scroll-margin-top:100px] [&_h2]:tracking-[-0.025em] [&_pre]:[tab-size:2]"
      >
        <slot />
      </article>
      <div
        class="docs-endnote mt-12 flex items-center justify-between gap-5 border-t border-border pt-5 max-[760px]:flex-wrap [&_a]:flex [&_a]:items-center [&_a]:gap-2.5 [&_a]:text-[11px] [&_p]:text-[8px] [&_p]:text-muted-foreground"
      >
        <p class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase">
          Edit the theme tokens
        </p>
        <NuxtLink to="/theme-builder"
          >Try the theme builder<ArrowUpRightIcon :size="14"
        /></NuxtLink>
      </div>
    </main>
  </div>
</template>
