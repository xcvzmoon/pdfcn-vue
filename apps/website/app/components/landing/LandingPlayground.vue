<script setup lang="ts">
  import type { BlockDoc } from '@/data/blocks';
  import { ArrowUpRightIcon, CodeIcon, FileTextIcon } from '@lucide/vue';
  import BlockPreview from '@/components/docs/BlockPreview.vue';
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import { blockDocs } from '@/data/blocks';

  const templates = blockDocs.filter(({ slug }) =>
    ['invoice-corporate', 'invoice-minimal', 'report-financial'].includes(slug),
  );
  const selectedSlug = ref<string>('invoice-corporate');
  const selected = computed<BlockDoc | undefined>(
    () => templates.find(({ slug }) => slug === selectedSlug.value) ?? templates[0],
  );
  const source = computed<string>(() =>
    selected.value
      ? [
          '<script setup lang="ts">',
          `import ${selected.value.componentName} from '@/components/pdf/blocks/${selected.value.slug}/${selected.value.componentName}.vue'`,
          `import { ${selected.value.sampleExport} } from '@/components/pdf/blocks/${selected.value.slug}/${selected.value.slug}.sample'`,
          '\u003c/script>',
          '',
          '<template>',
          `  <${selected.value.componentName} :data="${selected.value.sampleExport}" />`,
          '</template>',
        ].join('\n')
      : '',
  );
</script>

<template>
  <section
    id="playground"
    class="playground-section [scroll-margin-top:90px] py-18 max-[760px]:py-10"
  >
    <div
      class="section-heading mb-9 flex items-end justify-between gap-8 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-5"
    >
      <div>
        <h2
          class="section-title text-[clamp(2.4rem,_4.4vw,_4.5rem)] leading-[1.02] font-medium tracking-[-0.04em]"
        >
          The source and<br />the PDF.
        </h2>
      </div>
      <p
        class="section-description max-w-77.5 pb-[5px] text-[13px] leading-[1.8] text-muted-foreground"
      >
        Pick a template to inspect its Vue source and rendered PDF. The examples use sample data.
      </p>
    </div>
    <div
      class="playground-shell border border-border [&_.rounded-xl]:rounded-none [&_.rounded-xl]:border-0 [&_.rounded-xl]:shadow-none"
    >
      <div
        class="playground-toolbar flex items-center justify-between gap-4 border-b border-border px-5 py-4 max-[760px]:flex-col max-[760px]:items-start"
      >
        <div class="file-name flex items-center gap-2.5 font-mono text-[11px]">
          <span class="file-indicator h-2 w-2 border border-border bg-accent" /><span
            >{{ selected?.componentName }}.vue</span
          >
        </div>
        <div
          class="template-picker flex items-center gap-3.5 max-[760px]:w-full max-[760px]:[&_[data-slot='select-trigger']]:min-w-0 max-[760px]:[&_[data-slot='select-trigger']]:flex-1"
        >
          <span
            id="template-label"
            class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase"
            >Template</span
          >
          <Select v-model="selectedSlug">
            <SelectTrigger
              aria-label="Choose document template"
              size="sm"
            >
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="item in templates"
                  :key="item.slug"
                  :value="item.slug"
                >
                  {{ item.title }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs
        default-value="preview"
        class="playground-tabs gap-0"
      >
        <TabsList
          variant="line"
          class="playground-tablist h-11 w-full justify-start border-b border-border bg-background px-4 py-1.5 [&_button]:flex-none [&_button]:gap-[7px] [&_button]:px-3.5 [&_button]:text-[11px] [&_button]:shadow-none"
          ><TabsTrigger value="preview"><FileTextIcon :size="14" />Preview</TabsTrigger
          ><TabsTrigger value="code"><CodeIcon :size="14" />Source code</TabsTrigger></TabsList
        >
        <TabsContent
          value="preview"
          class="m-0"
          ><ClientOnly
            ><BlockPreview
              v-if="selected"
              :key="selected.slug"
              :slug="selected.slug"
              :component-name="selected.componentName"
              :sample-export="selected.sampleExport"
              :download-name="selected.install"
            /><template #fallback
              ><div
                class="preview-loading grid-stage grid min-h-150 place-items-center bg-muted [background-image:linear-gradient(var(--border)_1px,_transparent_1px),_linear-gradient(90deg,_var(--border)_1px,_transparent_1px)] bg-size-[32px_32px] text-[12px]"
                role="status"
              >
                Loading the document renderer…
              </div></template
            ></ClientOnly
          ></TabsContent
        >
        <TabsContent
          value="code"
          class="m-0"
          ><CodeBlock
            :code="source"
            title="Your Vue component"
            language="vue"
        /></TabsContent>
      </Tabs>
      <div
        class="playground-bottom eyebrow flex justify-between gap-4 border-t border-border px-5 py-3.5 font-mono text-[9px] leading-[1.6] tracking-[0.12em] uppercase max-[760px]:flex-wrap [&_a]:flex [&_a]:items-center [&_a]:gap-2.5"
      >
        <span>Vue SFC → Forme → PDF</span
        ><NuxtLink :to="`/docs/blocks/${selectedSlug}`"
          >View the block reference<ArrowUpRightIcon :size="14"
        /></NuxtLink>
      </div>
    </div>
  </section>
</template>
