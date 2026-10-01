<script setup lang="ts">
  import { ArrowUpRightIcon, MenuIcon, MoonIcon, SunIcon, XIcon } from '@lucide/vue';
  import GithubIcon from '@/components/GithubIcon.vue';
  import { Button } from '@/components/ui/button';

  const links = [
    { path: '/docs', label: 'Documentation' },
    { path: '/docs/components', label: 'Components' },
    { path: '/docs/blocks', label: 'Blocks' },
    { path: '/theme-builder', label: 'Theme builder' },
  ];
  const colorMode = useColorMode();
  const route = useRoute();
  const menuOpen = ref<boolean>(false);
  const isDark = computed<boolean>(() => colorMode.value === 'dark');

  function toggleTheme(): void {
    colorMode.preference = isDark.value ? 'light' : 'dark';
  }

  watch(
    () => route.path,
    () => {
      menuOpen.value = false;
    },
  );
</script>

<template>
  <header class="site-header sticky top-0 z-[30] border-b border-border bg-background">
    <div
      class="site-width header-inner mx-auto flex min-h-19 w-[min(100%_-_80px,_1440px)] items-center gap-8 max-[1100px]:gap-4.5 max-[900px]:min-h-16 max-[760px]:w-[calc(100%_-_32px)]"
    >
      <NuxtLink
        class="wordmark flex items-center gap-3 text-[20px] font-semibold tracking-[-0.04em] whitespace-nowrap"
        to="/"
        aria-label="pdfcn-vue home"
      >
        <span
          >pdfcn<span
            class="brand-suffix text-[15px] font-normal tracking-[-0.04em] text-muted-foreground"
          >
            / vue</span
          ></span
        >
      </NuxtLink>

      <nav
        class="desktop-nav ml-3 flex gap-1 text-[12px] max-[1100px]:ml-0 max-[1100px]:gap-4 max-[900px]:hidden [&_a]:inline-flex [&_a]:items-center [&_a]:px-3 [&_a]:py-2.5 [&_a]:transition-colors [&_a]:duration-150 [&_a:hover]:underline [&_a:hover]:underline-offset-[7px]"
        aria-label="Main navigation"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          :class="{ 'underline underline-offset-[7px]': route.path === link.path }"
          >{{ link.label }}</NuxtLink
        >
      </nav>

      <div class="header-actions ml-auto flex items-center gap-2">
        <DocsSearch />
        <ClientOnly>
          <Button
            :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
            size="icon"
            variant="ghost"
            @click="toggleTheme"
          >
            <MoonIcon v-if="isDark" />
            <SunIcon v-else />
          </Button>
        </ClientOnly>
        <a
          class="github-link flex items-center gap-1 p-2.5 max-[420px]:hidden"
          href="https://github.com/xcvzmoon/pdfcn-vue"
          target="_blank"
          rel="noreferrer"
          aria-label="Source on GitHub"
          ><GithubIcon class="size-[18px]"
        /></a>
        <Button
          :aria-expanded="menuOpen"
          :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'"
          class="mobile-toggle hidden max-[900px]:inline-flex"
          size="icon"
          variant="ghost"
          aria-controls="mobile-navigation"
          @click="menuOpen = !menuOpen"
        >
          <XIcon v-if="menuOpen" />
          <MenuIcon v-else />
        </Button>
      </div>
    </div>

    <nav
      v-if="menuOpen"
      id="mobile-navigation"
      class="site-width mobile-nav mx-auto grid w-[min(100%_-_80px,_1440px)] pb-5 max-[760px]:w-[calc(100%_-_32px)] [&_a]:flex [&_a]:justify-between [&_a]:border-t [&_a]:border-border [&_a]:px-0 [&_a]:py-4 [&_a]:text-[14px]"
      aria-label="Mobile navigation"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        >{{ link.label }}<ArrowUpRightIcon :size="16"
      /></NuxtLink>
    </nav>
  </header>
</template>
