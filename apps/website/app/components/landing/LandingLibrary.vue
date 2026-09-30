<script setup lang="ts">
  import { ArrowUpRightIcon, BracesIcon, FileStackIcon, PaletteIcon } from '@lucide/vue';
  import { themePresets } from '#registry/themes';

  const themes = Object.entries(themePresets);
  const features = [
    {
      title: 'Assemble a document.',
      description:
        'Add headings, tables, charts, headers, and footers. Each component has typed props and a reference page.',
      icon: BracesIcon,
      href: '/docs/components',
      link: 'Explore components',
    },
    {
      title: 'Use a complete template.',
      description:
        'Install an invoice, report, shipping label, or agenda with its sample data. Then replace the data and edit the Vue file.',
      icon: FileStackIcon,
      href: '/docs/blocks',
      link: 'Browse document blocks',
    },
  ];
</script>

<template>
  <section class="ruled-section library-section border-t border-foreground py-16 max-[760px]:py-10">
    <div
      class="library-heading grid grid-cols-[2fr_1fr] items-start gap-6 pb-12 max-[1000px]:grid-cols-[2fr_1fr] max-[760px]:grid-cols-1 max-[760px]:gap-5 max-[760px]:pb-8 [&_.section-title]:text-[clamp(2.5rem,4vw,4rem)]"
    >
      <h2
        class="section-title text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] font-medium tracking-[-0.04em]"
      >
        Start with a part<br />or a whole document.
      </h2>
      <p
        class="library-intro self-end text-[13px] leading-[1.8] text-muted-foreground max-[1000px]:col-auto max-[760px]:col-auto"
      >
        Registry installs place the Vue files in your project. You can edit them there.
      </p>
    </div>
    <div class="library-rows">
      <NuxtLink
        v-for="feature in features"
        :key="feature.href"
        :to="feature.href"
        class="library-row grid grid-cols-[70px_1fr_230px] items-center gap-5 border-t border-border px-5 py-8 transition-colors duration-160 max-[1000px]:grid-cols-[35px_1fr] max-[760px]:gap-3.5 [&:hover]:bg-muted"
        ><component
          :is="feature.icon"
          :size="24"
          class="row-icon" />
        <div
          class="row-content [&_h3]:mb-2 [&_h3]:text-[25px] [&_h3]:font-medium [&_h3]:tracking-[-0.04em] max-[760px]:[&_h3]:text-[22px] [&_p]:max-w-135 [&_p]:text-[13px] [&_p]:leading-[1.7] [&_p]:text-muted-foreground"
        >
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
        <span
          class="row-link flex items-center justify-end gap-6 text-[12px] max-[1000px]:col-start-2 max-[1000px]:justify-start"
          >{{ feature.link }}<ArrowUpRightIcon :size="18" /></span
      ></NuxtLink>
    </div>
    <div
      class="theme-feature mt-8 grid grid-cols-[1fr_1.4fr] border border-border max-[760px]:grid-cols-1"
    >
      <div
        class="theme-copy flex flex-col items-start gap-5.5 p-10 max-[1000px]:p-7 [&_h3]:text-[clamp(3rem,4vw,4.5rem)] [&_h3]:leading-none [&_h3]:font-medium [&_h3]:tracking-[-0.04em] [&_p]:max-w-80 [&_p]:text-[13px] [&_p]:leading-[1.8] [&_p]:text-muted-foreground"
      >
        <PaletteIcon :size="24" />
        <h3>Set the type,<br />color, and spacing.</h3>
        <p>
          Choose one of nine presets, adjust its tokens against a live PDF, and export the theme as
          TypeScript.
        </p>
        <NuxtLink
          class="action-link inline-flex min-h-12 items-center justify-between gap-6 border border-foreground px-5 py-3 text-[13px] font-medium transition-colors duration-160 [&:hover]:bg-accent [&:hover]:text-accent-foreground"
          to="/theme-builder"
          >Open the theme builder<ArrowUpRightIcon :size="17"
        /></NuxtLink>
      </div>
      <div
        class="theme-grid grid grid-cols-3 gap-5 border-l border-border bg-muted p-8 max-[1000px]:gap-3.5 max-[1000px]:p-6 max-[760px]:gap-4 max-[760px]:border-t max-[760px]:border-l-0 max-[760px]:border-border max-[760px]:p-5 max-[380px]:gap-2.5 max-[380px]:p-3.5"
      >
        <NuxtLink
          v-for="[name, theme] in themes"
          :key="name"
          :to="{ path: '/theme-builder', query: { preset: name } }"
          class="theme-sample min-w-0 [&:hover_.mini-document]:[outline:1px_solid_var(--border)] [&:hover_.mini-document]:outline-offset-[3px]"
          ><div
            :style="{
              backgroundColor: theme.colors.background,
              color: theme.colors.foreground,
              '--sample-accent': theme.colors.primary,
            }"
            class="mini-document flex aspect-[1.16] flex-col p-4 shadow-[2px_2px_0_rgb(0_0_0/0.07)] [border:1px_solid_#d0d2c8] max-[380px]:p-2.5"
          >
            <span
              :style="{ fontFamily: theme.typography.heading.fontFamily }"
              class="mini-title text-[38px] leading-none tracking-[-0.04em] max-[380px]:text-[30px] [&_>_span]:text-(--sample-accent)"
              >Aa<span>.</span></span
            ><span
              class="mini-line mt-2.5 block h-0.5 w-[80%] bg-current opacity-[0.2] [&.short]:mt-1.25 [&.short]:w-[55%]"
            /><span
              class="mini-line short mt-2.5 block h-0.5 w-[80%] bg-current opacity-[0.2] [&.short]:mt-1.25 [&.short]:w-[55%]"
            /><span class="mini-block mt-auto block h-3 [background:var(--sample-accent)]" />
          </div>
          <span
            class="eyebrow theme-name mt-2 flex items-center justify-between font-mono text-[8px] leading-[1.6] tracking-[0.12em] uppercase"
            >{{ name }}<ArrowUpRightIcon :size="11" /></span
        ></NuxtLink>
      </div>
    </div>
  </section>
</template>
