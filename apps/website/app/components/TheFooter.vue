<template>
  <footer
    class="site-width footer mx-auto w-[min(100%_-_80px,_1440px)] border-t border-border px-0 pt-10 pb-6 max-[760px]:w-[calc(100%_-_32px)]"
  >
    <div
      class="footer-top flex items-center justify-between gap-6 max-[600px]:flex-col max-[600px]:items-start"
    >
      <NuxtLink
        class="footer-brand flex flex-col gap-3 text-[32px] font-medium tracking-[-0.04em] [&_span]:text-muted-foreground"
        to="/"
        >pdfcn / vue<span
          class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase"
          >Vue components for PDFs</span
        ></NuxtLink
      >
      <div
        class="footer-links flex gap-8 text-[12px] max-[600px]:flex-wrap max-[600px]:gap-6 [&_a]:flex [&_a]:items-center [&_a]:gap-[5px]"
      >
        <NuxtLink to="/docs">Documentation</NuxtLink>
        <NuxtLink to="/theme-builder">Theme builder</NuxtLink>
        <a
          href="https://github.com/xcvzmoon/pdfcn-vue"
          target="_blank"
          rel="noreferrer"
          class="hover:underline hover:underline-offset-[4px]"
          >GitHub</a
        >
      </div>
    </div>

    <div
      class="footer-bottom eyebrow mt-10 flex items-center justify-between gap-6 border-t border-border pt-5 font-mono text-[9px] leading-[1.6] tracking-[0.12em] text-muted-foreground uppercase max-[600px]:flex-col max-[600px]:items-start"
    >
      <p>
        Built by
        <a
          href="https://github.com/xcvzmoon"
          class="hover:underline hover:underline-offset-[4px]"
          >xcvzmoon</a
        >.
      </p>
    </div>
  </footer>
</template>
