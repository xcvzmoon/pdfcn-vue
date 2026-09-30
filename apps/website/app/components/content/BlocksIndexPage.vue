<script setup lang="ts">
  import type { BlockDoc } from '@/data/blocks';
  import { computed, ref } from 'vue';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Input } from '@/components/ui/input';
  import { blockCategories, blockDocs } from '@/data/blocks';

  const query = ref<string>('');
  const activeCategory = ref<string>('all');

  const filtered = computed<BlockDoc[]>(() => {
    const q = query.value.trim().toLowerCase();
    return blockDocs.filter((item) => {
      const matchesCategory =
        activeCategory.value === 'all' || item.category === activeCategory.value;
      const matchesQuery =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.slug.includes(q);
      return matchesCategory && matchesQuery;
    });
  });
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col gap-3">
      <h1 class="doc-title">Blocks</h1>
      <p class="max-w-2xl text-muted-foreground">
        Install a complete document as a Vue file. Each block includes sample data to replace with
        your own.
      </p>
    </header>

    <div class="flex flex-col gap-4 border-y border-border py-5">
      <Input
        v-model="query"
        type="search"
        placeholder="Search blocks…"
        class="w-full sm:max-w-sm"
        aria-label="Search blocks"
      />
      <div
        class="flex flex-wrap items-center gap-1.5"
        aria-label="Filter blocks by category"
      >
        <Button
          :variant="activeCategory === 'all' ? 'secondary' : 'ghost'"
          size="sm"
          @click="activeCategory = 'all'"
        >
          All
        </Button>

        <Button
          v-for="category in blockCategories"
          :key="category.id"
          :variant="activeCategory === category.id ? 'secondary' : 'ghost'"
          size="sm"
          @click="activeCategory = category.id"
        >
          {{ category.label }}
        </Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="item in filtered"
        :key="item.slug"
        :to="`/docs/blocks/${item.slug}`"
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
      No blocks match your filters.
    </p>
  </div>
</template>
