<script setup lang="ts">
  import { Toaster } from 'vue-sonner';
</script>

<template>
  <div>
    <a
      class="skip-link fixed -top-15 left-4 z-[100] bg-accent px-5 py-3 text-accent-foreground [&:focus]:top-3"
      href="#main-content"
      >Skip to content</a
    >
    <TheHeader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <TheFooter />
    <Toaster />
  </div>
</template>
