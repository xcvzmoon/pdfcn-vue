<script setup lang="ts">
  import { ArrowUpRightIcon } from '@lucide/vue';
  import CodeBlock from '@/components/docs/CodeBlock.vue';

  const steps = [
    {
      number: '01',
      title: 'Install a component.',
      detail:
        'Add the registry to components.json. The shadcn-vue CLI brings in the component and its dependencies.',
    },
    {
      number: '02',
      title: 'Pass your data.',
      detail:
        'The CLI writes a Vue file into your project. Bind your data and edit the markup or theme as needed.',
    },
    {
      number: '03',
      title: 'Render the PDF.',
      detail:
        'Render with Forme in the browser or on your server. Download a PDF or return it from a Nuxt endpoint.',
    },
  ];
  const command = 'pnpm dlx shadcn-vue@latest add @pdfcn-vue/invoice-minimal';
</script>

<template>
  <section
    class="ruled-section workflow-section border-t border-foreground py-16 max-[760px]:py-10"
  >
    <div
      class="workflow-heading mb-10 grid grid-cols-[2fr_1fr] items-end gap-6 max-[1000px]:grid-cols-[2fr_1fr] max-[760px]:grid-cols-1 max-[760px]:gap-5 [&_h2]:text-[clamp(2.5rem,4vw,4rem)]"
    >
      <h2
        class="section-title text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] font-medium tracking-[-0.04em]"
      >
        Install, edit,<br />render.
      </h2>
      <NuxtLink
        class="text-link flex items-center gap-3 text-[12px] max-[1000px]:col-auto max-[760px]:col-auto"
        to="/docs/installation"
        >Read the installation guide<ArrowUpRightIcon :size="17"
      /></NuxtLink>
    </div>
    <div class="workflow-steps grid grid-cols-3 border-y border-border max-[760px]:grid-cols-1">
      <div
        v-for="step in steps"
        :key="step.number"
        class="workflow-step flex gap-6 border-r border-border p-7 last:border-r-0 max-[1000px]:gap-3 max-[1000px]:p-5 max-[760px]:gap-6 max-[760px]:border-r-0 max-[760px]:border-b max-[760px]:border-border max-[760px]:px-0 max-[760px]:py-6 max-[760px]:last:border-b-0 [&_.eyebrow]:pt-1 [&_.eyebrow]:whitespace-nowrap [&_.eyebrow]:text-muted-foreground [&_h3]:mb-3 [&_h3]:text-[19px] [&_h3]:font-medium [&_h3]:tracking-[-0.04em] [&_p]:text-[12px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground"
      >
        <span class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase"
          >{{ step.number }} /</span
        >
        <div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.detail }}</p>
        </div>
      </div>
    </div>
    <CodeBlock
      class="terminal mt-8"
      :code="command"
      language="bash"
      title="Terminal / After registry setup"
    />
  </section>
  <section
    class="closing-section mb-16 border border-border bg-muted px-12 pt-11 pb-6 text-foreground max-[760px]:mb-10 max-[760px]:px-6 max-[760px]:pt-7 max-[760px]:pb-5"
  >
    <div
      class="closing-row flex items-end justify-between gap-8 px-0 pt-7.5 pb-10 max-[760px]:flex-col max-[760px]:items-start [&_.action-link]:min-w-55 [&_.action-link]:border-foreground [&_.action-link]:text-foreground [&_.action-link:hover]:bg-foreground [&_.action-link:hover]:text-background"
    >
      <h2
        class="section-title text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] font-medium tracking-[-0.04em]"
      >
        Start with an invoice.<br />Change everything else.
      </h2>
      <NuxtLink
        class="action-link inline-flex min-h-12 items-center justify-between gap-6 border border-foreground px-5 py-3 text-[13px] font-medium transition-colors duration-160 [&:hover]:bg-accent [&:hover]:text-accent-foreground"
        to="/docs/installation"
        >Build your first PDF<ArrowUpRightIcon :size="20"
      /></NuxtLink>
    </div>
    <div
      class="closing-rule flex justify-between border-t border-border pt-3.5 font-mono text-[8px] tracking-widest"
    >
      <span>PDFCN / VUE</span><span>VUE COMPONENTS FOR PDFS</span>
    </div>
  </section>
</template>
