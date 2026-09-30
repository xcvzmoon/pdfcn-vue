import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2026-09-30',
  devtools: { enabled: false },
  alias: {
    '#registry': fileURLToPath(new URL('../../packages/registry/src', import.meta.url)),
  },
  vue: {
    compilerOptions: { isCustomElement: (tag) => tag.startsWith('forme-') },
  },
  vite: { plugins: [tailwindcss()] },
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/color-mode', 'shadcn-nuxt'],
  colorMode: { classSuffix: '', preference: 'dark' },
  shadcn: { prefix: '', componentDir: '~/components/ui' },
  app: {
    head: {
      title: 'pdfcn-vue — Documents, by design.',
      meta: [
        {
          name: 'description',
          content:
            'Composable PDF components for Vue and Nuxt. Own your source, build with Forme, and make every document your own.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  routeRules: { '/r/**': { headers: { 'Access-Control-Allow-Origin': '*' } } },
});
