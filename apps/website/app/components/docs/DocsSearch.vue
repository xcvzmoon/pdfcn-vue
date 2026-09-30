<script setup lang="ts">
  import { SearchIcon } from '@lucide/vue';
  import { useEventListener } from '@vueuse/core';
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
  import { blockDocs } from '@/data/blocks';
  import { componentDocs } from '@/data/components';

  const entries = [
    { title: 'Introduction', href: '/docs', description: 'Meet the Vue PDF component library' },
    {
      title: 'Installation',
      href: '/docs/installation',
      description: 'Set up the registry and create a document',
    },
    {
      title: 'Rendering PDFs',
      href: '/docs/rendering',
      description: 'Browser and Nuxt server rendering',
    },
    {
      title: 'Nuxt integration',
      href: '/docs/nuxt',
      description: 'Vue compiler setup, client previews, and PDF API routes',
    },
    {
      title: 'Registry',
      href: '/docs/registry',
      description: 'Install and distribute source components',
    },
    { title: 'Theming', href: '/docs/theming', description: 'Colors, typography, and page layout' },
    {
      title: 'Theme builder',
      href: '/theme-builder',
      description: 'Customize and export a PDF theme',
    },
    ...componentDocs.map(({ title, slug, description }) => ({
      title,
      href: `/docs/components/${slug}`,
      description,
    })),
    ...blockDocs.map(({ title, slug, description }) => ({
      title,
      href: `/docs/blocks/${slug}`,
      description,
    })),
  ];
  const open = ref<boolean>(false);
  const query = ref<string>('');
  const results = computed<typeof entries>(() => {
    const search = query.value.trim().toLowerCase();
    return entries
      .filter(({ title, description }) => `${title} ${description}`.toLowerCase().includes(search))
      .slice(0, 12);
  });

  function close(): void {
    open.value = false;
  }
  function openSearch(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      open.value = !open.value;
    }
  }

  useEventListener('keydown', openSearch);
  watch(open, () => {
    query.value = '';
  });
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="search-trigger flex items-center gap-2.25 pe-1 text-[11px] font-normal max-[1100px]:border-0 max-[1100px]:p-2.5 max-[1100px]:[&_>_span]:hidden"
        aria-label="Search documentation"
      >
        <SearchIcon :size="15" />
        <span>Search docs</span>
        <span
          class="search-shortcut ml-3 inline-flex gap-0.75"
          aria-hidden="true"
        >
          <kbd
            class="inline-flex h-5.5 min-w-5 items-center justify-center border border-b-2 border-border bg-muted px-1 py-0 font-mono text-[9px] text-muted-foreground"
            >⌘</kbd
          >
          <kbd
            class="inline-flex h-5.5 min-w-5 items-center justify-center border border-b-2 border-border bg-muted px-1 py-0 font-mono text-[9px] text-muted-foreground"
            >K</kbd
          >
        </span>
      </Button>
    </DialogTrigger>
    <DialogContent
      class="search-dialog gap-0 overflow-hidden p-0 sm:max-w-150"
      :show-close-button="false"
    >
      <div
        class="search-title flex items-center justify-between border-b border-border px-5 py-4 [&_button]:font-mono [&_button]:text-[10px] [&_button]:text-muted-foreground"
      >
        <DialogTitle class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase"
          >Documentation index</DialogTitle
        >
        <DialogClose aria-label="Close search">Esc / close</DialogClose>
      </div>
      <DialogDescription class="sr-only"
        >Search guides, components, and document blocks. Use Tab to navigate results and Enter to
        open one.</DialogDescription
      >
      <label class="search-input-wrap flex gap-3 border-b border-border p-5"
        ><SearchIcon :size="20" /><input
          v-model="query"
          class="search-input w-full min-w-0 bg-transparent text-[18px] outline-none"
          placeholder="What are you building?"
          aria-label="Search guides, components, and blocks"
          autofocus
      /></label>
      <div
        class="search-results max-h-[48vh] overflow-y-auto [&_a]:flex [&_a]:flex-col [&_a]:gap-[3px] [&_a]:border-b [&_a]:border-border [&_a]:px-5 [&_a]:py-3.5 [&_a:focus-visible]:bg-accent [&_a:focus-visible]:text-accent-foreground [&_a:focus-visible]:[outline-offset:-3px] [&_a:hover]:bg-accent [&_a:hover]:text-accent-foreground [&_a:hover]:[outline-offset:-3px] [&_span]:text-[11px] [&_span]:opacity-[0.7] [&_strong]:text-[14px] [&_strong]:font-medium"
      >
        <NuxtLink
          v-for="entry in results"
          :key="entry.href"
          :to="entry.href"
          @click="close"
          ><strong>{{ entry.title }}</strong
          ><span>{{ entry.description }}</span></NuxtLink
        >
        <p
          v-if="!results.length"
          class="empty-results p-6 text-[13px]"
          role="status"
        >
          No results for “{{ query }}”. Try a component name or “rendering”.
        </p>
      </div>
      <p
        class="search-hint eyebrow px-5 py-3 font-mono text-[8px] leading-[1.6] tracking-[0.12em] text-muted-foreground uppercase"
      >
        Tab to navigate / Enter to open / Esc to close
      </p>
    </DialogContent>
  </Dialog>
</template>
