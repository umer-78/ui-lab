/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// Served from https://umer-78.github.io/ui-lab/, so production assets need that
// prefix; local development stays on "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ui-lab/' : '/',
  plugins: [react(), tailwindcss()],
  // three.js (the header's 3D scene) is its own chunk, loaded after first paint; it is bigger than Vite's default warning size
  build: { chunkSizeWarningLimit: 600 },
  // "@/" is the import root 21st.dev and shadcn-style components expect.
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
}));
