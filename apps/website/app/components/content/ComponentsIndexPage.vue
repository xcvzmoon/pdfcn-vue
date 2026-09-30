<script setup lang="ts">
  import type { ComponentDoc } from '@/data/components';
  import { computed, ref } from 'vue';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Input } from '@/components/ui/input';
  import { componentCategories, componentDocs } from '@/data/components';

  const query = ref<string>('');
  const activeCategory = ref<string>('all');

  const filtered = computed<ComponentDoc[]>(() => {
    const q = query.value.trim().toLowerCase();
    return componentDocs.filter((item) => {
      const matchesCategory =
        activeCategory.value === 'all' || item.category === activeCategory.value;
      const matchesQuery =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  });

  function setCategory(id: string): void {
    activeCategory.value = id;
  }
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col gap-3">
      <h1 class="doc-title">Components</h1>
      <p class="max-w-2xl text-muted-foreground">
        Install individual PDF components with
        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          @pdfcn-vue/&lt;name&gt; </code
        >.
      </p>
    </header>

    <div class="flex flex-col gap-4 border-y border-border py-5">
      <Input
        v-model="query"
        type="search"
        placeholder="Search components…"
        class="w-full sm:max-w-sm"
        aria-label="Search components"
      />

      <div
        class="flex flex-wrap items-center gap-1.5"
        aria-label="Filter components by category"
      >
        <Button
          :variant="activeCategory === 'all' ? 'secondary' : 'ghost'"
          size="sm"
          @click="setCategory('all')"
        >
          All
        </Button>

        <Button
          v-for="category in componentCategories"
          :key="category.id"
          :variant="activeCategory === category.id ? 'secondary' : 'ghost'"
          size="sm"
          @click="setCategory(category.id)"
        >
          {{ category.label }}
        </Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="item in filtered"
        :key="item.slug"
        :to="`/docs/components/${item.slug}`"
        class="group rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Card class="h-full transition-colors group-hover:border-foreground/25">
          <CardHeader>
            <div class="flex items-start justify-between gap-2">
              <CardTitle class="text-base">{{ item.title }}</CardTitle>
              <Badge
                variant="secondary"
                class="shrink-0 text-[10px]"
              >
                {{ item.category }}
              </Badge>
            </div>
            <CardDescription class="line-clamp-3">{{ item.description }}</CardDescription>
            <p class="font-mono text-[11px] text-muted-foreground">@pdfcn-vue/{{ item.install }}</p>
          </CardHeader>
        </Card>
      </NuxtLink>
    </div>

    <p
      v-if="filtered.length === 0"
      class="text-sm text-muted-foreground"
    >
      No components match your filters.
    </p>
  </div>
</template>
