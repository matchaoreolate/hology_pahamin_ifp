import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Builds the standalone, self-contained presentation runtime used by the
// "Media Interaktif Offline" export. Output is a single HTML file (JS + CSS
// + fonts inlined) written into public/export so the main app build copies
// it as a static asset, fetchable at runtime via `/export/index.html`.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    outDir: 'public/export',
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, 'export-runtime.html'),
    },
  },
})
