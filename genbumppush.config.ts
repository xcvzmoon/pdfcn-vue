import { defineConfig } from 'genbumppush';

export default defineConfig({
  release: 'patch',
  hooks: {
    before: 'vp run validate',
  },
});
