<template>
  <aside
    class="acknowledgement grid grid-cols-[1fr_3fr] gap-6 border-t border-border px-0 pt-6 pb-12 *:first:text-muted-foreground *:last:max-w-[56ch] *:last:text-[12px] *:last:leading-[1.7] *:last:text-muted-foreground max-[760px]:grid-cols-1 max-[760px]:gap-2"
  >
    <p class="eyebrow font-mono text-[10px] leading-[1.6] tracking-[0.12em] uppercase">
      Acknowledgement
    </p>

    <p>
      This project draws on
      <NuxtLink
        href="https://www.pdfcn.dev/"
        target="_blank"
        rel="noreferrer"
        class="text-foreground underline underline-offset-[3px]"
      >
        pdfcn
      </NuxtLink>
      by Aniket Pawar. The Vue components here render PDFs with Forme.
    </p>
  </aside>
</template>
