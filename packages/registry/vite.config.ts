import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite-plus';

function pdfVuePlugin() {
  return vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('forme-'),
      },
    },
  });
}

export default defineConfig({
  plugins: [pdfVuePlugin()],
  pack: {
    plugins: [pdfVuePlugin()],
    entry: {
      index: 'src/index.ts',
      forme: 'src/forme/index.ts',
    },
    dts: true,
  },
});
