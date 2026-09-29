import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('forme-'),
        },
      },
    }),
  ],
  pack: {
    entry: {
      index: 'src/index.ts',
      forme: 'src/forme/index.ts',
    },
    dts: true,
  },
});
