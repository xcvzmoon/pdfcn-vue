<script setup lang="ts">
  import type { ThemeColorKey } from '@/composables/useThemeBuilder';
  import { ArrowUpRightIcon, DownloadIcon, RotateCcwIcon } from '@lucide/vue';
  import { themePresets } from '#registry/themes';
  import CodeBlock from '@/components/docs/CodeBlock.vue';
  import CopyButton from '@/components/docs/CopyButton.vue';
  import ComponentGalleryDocument from '@/components/pdf/demos/ComponentGalleryDocument.vue';
  import LivePdfPreview from '@/components/pdf/LivePdfPreview.vue';
  import ThemeColorField from '@/components/theme-builder/ThemeColorField.vue';
  import ThemeNumberField from '@/components/theme-builder/ThemeNumberField.vue';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import { themeNames, useThemeBuilder } from '@/composables/useThemeBuilder';

  const colorFields: { key: ThemeColorKey; label: string }[] = [
    { key: 'primary', label: 'Primary' },
    { key: 'primaryForeground', label: 'On primary' },
    { key: 'foreground', label: 'Foreground' },
    { key: 'background', label: 'Background' },
    { key: 'muted', label: 'Muted' },
    { key: 'mutedForeground', label: 'Muted foreground' },
    { key: 'border', label: 'Border' },
    { key: 'accent', label: 'Accent' },
    { key: 'destructive', label: 'Destructive' },
    { key: 'success', label: 'Success' },
    { key: 'warning', label: 'Warning' },
    { key: 'info', label: 'Info' },
  ];
  const fonts = ['Helvetica', 'Times-Roman', 'Courier'];
  const {
    selectedName,
    draft,
    exportName,
    feedback,
    exportValid,
    exportCode,
    choosePreset,
    reset,
    setColor,
    setNumber,
    downloadTheme,
  } = useThemeBuilder();
</script>

<template>
  <div class="builder mb-16 border border-border max-[760px]:mb-10">
    <div
      class="preset-strip flex items-center gap-6 border-b border-border px-6 py-5 max-[1000px]:flex-col max-[1000px]:items-start max-[1000px]:gap-3 max-[760px]:p-4 [&_>_.eyebrow]:text-[9px] [&_>_.eyebrow]:whitespace-nowrap [&_>_.eyebrow]:text-muted-foreground"
    >
      <span class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase"
        >Starting point</span
      >
      <div
        class="preset-buttons flex flex-wrap gap-1 [&_button]:gap-1.5 [&_button]:text-[10px] [&_button]:capitalize [&_button_>_span]:h-2 [&_button_>_span]:w-2 [&_button_>_span]:[border:1px_solid_rgb(0_0_0_/_0.15)]"
      >
        <Button
          v-for="name in themeNames"
          :key="name"
          :aria-pressed="selectedName === name"
          :variant="selectedName === name ? 'secondary' : 'ghost'"
          size="sm"
          @click="choosePreset(name)"
        >
          <span :style="{ background: themePresets[name].colors.primary }" />{{ name }}
        </Button>
      </div>
    </div>
    <div
      class="builder-workspace grid grid-cols-[320px_minmax(0,_1fr)] max-[1000px]:grid-cols-[280px_minmax(0,_1fr)] max-[760px]:grid-cols-1"
    >
      <aside
        class="builder-controls border-r border-border px-6 py-4 max-[1000px]:p-4 max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:border-border"
      >
        <div
          class="controls-heading mb-4 flex items-center justify-between gap-3 [&_>_.eyebrow]:text-[9px]"
        >
          <span class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase"
            >01 / Customize</span
          ><Button
            size="sm"
            variant="ghost"
            @click="reset"
            ><RotateCcwIcon data-icon="inline-start" />Reset</Button
          >
        </div>
        <Tabs default-value="colors"
          ><TabsList
            variant="line"
            class="control-tabs flex w-full border-b border-border bg-transparent [&_button]:text-[10px] [&_button]:shadow-none"
            ><TabsTrigger value="colors">Colors</TabsTrigger
            ><TabsTrigger value="type">Typography</TabsTrigger
            ><TabsTrigger value="layout">Layout</TabsTrigger></TabsList
          ><TabsContent value="colors"
            ><ThemeColorField
              v-for="field in colorFields"
              :key="`${selectedName}-${field.key}`"
              :label="field.label"
              :value="draft.colors[field.key]"
              :token="field.key"
              @change="setColor(field.key, $event)" /></TabsContent
          ><TabsContent value="type"
            ><label
              class="select-field flex flex-col gap-2.5 border-b border-border py-3.5 text-[12px]"
              ><span>Body font</span
              ><Select v-model="draft.typography.body.fontFamily">
                <SelectTrigger class="w-full"><SelectValue /></SelectTrigger>
                <SelectContent
                  ><SelectGroup>
                    <SelectItem
                      v-if="!fonts.includes(draft.typography.body.fontFamily)"
                      :value="draft.typography.body.fontFamily"
                    >
                      {{ draft.typography.body.fontFamily }} (preset)
                    </SelectItem>
                    <SelectItem
                      v-for="font in fonts"
                      :key="font"
                      :value="font"
                    >
                      {{ font }}
                    </SelectItem></SelectGroup
                  ></SelectContent
                >
              </Select></label
            ><label
              class="select-field flex flex-col gap-2.5 border-b border-border py-3.5 text-[12px]"
              ><span>Heading font</span
              ><Select v-model="draft.typography.heading.fontFamily">
                <SelectTrigger class="w-full"><SelectValue /></SelectTrigger>
                <SelectContent
                  ><SelectGroup>
                    <SelectItem
                      v-if="!fonts.includes(draft.typography.heading.fontFamily)"
                      :value="draft.typography.heading.fontFamily"
                    >
                      {{ draft.typography.heading.fontFamily }} (preset)
                    </SelectItem>
                    <SelectItem
                      v-for="font in fonts"
                      :key="font"
                      :value="font"
                    >
                      {{ font }}
                    </SelectItem></SelectGroup
                  ></SelectContent
                >
              </Select></label
            ><ThemeNumberField
              :value="draft.typography.body.fontSize"
              :min="6"
              :max="72"
              label="Body size"
              token="bodySize"
              @change="setNumber('bodySize', $event)"
            /><ThemeNumberField
              :value="draft.typography.heading.fontSize.h1"
              :min="6"
              :max="72"
              label="Heading size"
              token="headingSize"
              @change="setNumber('headingSize', $event)"
            /><ThemeNumberField
              :value="draft.typography.body.lineHeight"
              :min="1"
              :max="2.5"
              :step="0.05"
              label="Body line height"
              unit="ratio"
              token="lineHeight"
              @change="setNumber('lineHeight', $event)"
            />
            <p class="control-note mt-3 text-[10px] leading-[1.7] text-muted-foreground">
              Custom font names are preserved in exports. Register matching font files with Forme in
              your app. The preview uses the renderer's available fonts.
            </p></TabsContent
          ><TabsContent value="layout"
            ><label
              class="select-field flex flex-col gap-2.5 border-b border-border py-3.5 text-[12px]"
              ><span>Paper size</span
              ><Select v-model="draft.page.size">
                <SelectTrigger class="w-full"><SelectValue /></SelectTrigger>
                <SelectContent
                  ><SelectGroup>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="LETTER">Letter</SelectItem>
                    <SelectItem value="LEGAL">Legal</SelectItem>
                  </SelectGroup></SelectContent
                >
              </Select></label
            ><label
              class="select-field flex flex-col gap-2.5 border-b border-border py-3.5 text-[12px]"
              ><span>Orientation</span
              ><Select v-model="draft.page.orientation">
                <SelectTrigger class="w-full"><SelectValue /></SelectTrigger>
                <SelectContent
                  ><SelectGroup>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectGroup></SelectContent
                >
              </Select></label
            ><ThemeNumberField
              :value="draft.spacing.sectionGap"
              :min="0"
              :max="120"
              label="Section gap"
              token="sectionGap"
              @change="setNumber('sectionGap', $event)" /><ThemeNumberField
              :value="draft.spacing.paragraphGap"
              :min="0"
              :max="120"
              label="Paragraph gap"
              token="paragraphGap"
              @change="setNumber('paragraphGap', $event)" /><ThemeNumberField
              :value="draft.spacing.componentGap"
              :min="0"
              :max="120"
              label="Component gap"
              token="componentGap"
              @change="setNumber('componentGap', $event)" /><ThemeNumberField
              v-for="side in ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'] as const"
              :key="side"
              :value="draft.spacing.page[side]"
              :min="0"
              :max="120"
              :label="side.replace('margin', '') + ' margin'"
              :token="side"
              @change="setNumber(side, $event)" /></TabsContent
        ></Tabs>
        <div class="export-name mt-6 flex flex-col gap-2 [&_input]:font-mono [&_input]:text-[11px]">
          <label
            for="export-name"
            class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase"
            >Export name</label
          ><Input
            v-model="exportName"
            :aria-invalid="!exportValid"
            id="export-name"
            aria-describedby="export-name-help"
            spellcheck="false"
          />
          <p
            v-if="!exportValid"
            id="export-name-help"
            class="control-note mt-3 text-[10px] leading-[1.7] text-muted-foreground"
          >
            Enter a valid JavaScript variable name.
          </p>
        </div>
        <p
          class="feedback mt-3 min-h-6 text-[10px] text-muted-foreground"
          role="status"
        >
          {{ feedback }}
        </p>
      </aside>
      <div
        class="builder-preview min-w-0 [&_.rounded-xl]:rounded-none [&_.rounded-xl]:border-0 [&_.rounded-xl]:shadow-none [&_>_[data-slot='tabs']]:gap-0"
      >
        <Tabs default-value="preview"
          ><div
            class="preview-heading flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3"
          >
            <TabsList
              variant="line"
              class="preview-tabs bg-transparent [&_button]:text-[10px] [&_button]:shadow-none"
              ><TabsTrigger value="preview">02 / Live document</TabsTrigger
              ><TabsTrigger value="code">Theme source</TabsTrigger></TabsList
            >
            <div class="export-actions flex gap-2 [&_button]:text-[10px]">
              <CopyButton
                :code="exportCode"
                label="Copy theme"
              /><Button
                :disabled="!exportValid"
                size="sm"
                variant="outline"
                @click="downloadTheme"
                ><DownloadIcon data-icon="inline-start" />Export .ts</Button
              >
            </div>
          </div>
          <TabsContent
            value="preview"
            class="m-0"
            ><ClientOnly
              ><LivePdfPreview
                :document="ComponentGalleryDocument"
                :document-props="{ theme: draft }"
                title="PDF preview"
                description="Changes to the theme render here."
                download-name="custom-theme-preview.pdf"
              /><template #fallback
                ><div
                  class="builder-loading grid-stage grid min-h-160 place-items-center bg-muted [background-image:linear-gradient(var(--border)_1px,_transparent_1px),_linear-gradient(90deg,_var(--border)_1px,_transparent_1px)] bg-size-[32px_32px] text-[12px]"
                  role="status"
                >
                  Loading the PDF renderer…
                </div></template
              ></ClientOnly
            ></TabsContent
          ><TabsContent
            value="code"
            class="m-0"
            ><CodeBlock
              :code="exportCode"
              title="custom-theme.ts"
              language="ts" /></TabsContent
        ></Tabs>
        <div
          class="builder-help flex flex-wrap justify-between gap-3 border-t border-border px-5 py-4 [&_.eyebrow]:text-[8px] [&_a]:flex [&_a]:items-center [&_a]:gap-2 [&_a]:text-[10px]"
        >
          <span class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase"
            >Export as a TypeScript object</span
          ><NuxtLink to="/docs/theming"
            >Learn about theme tokens<ArrowUpRightIcon :size="13"
          /></NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
