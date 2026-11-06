import { defineConfig } from 'vite';
import { buildMeta } from './scripts/build-meta.js';

export default defineConfig({
  base: './',
  plugins: [buildMeta()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    emptyOutDir: true,
    rollupOptions: { input: { main: 'index.html', charte: 'charte.html', rangs: 'rangs.html' } },
  },
  server: { port: 5178, strictPort: true },
  preview: { port: 5178, strictPort: true },
});
