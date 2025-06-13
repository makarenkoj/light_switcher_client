import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()], // Залишаємо плагін
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@mui/material/styles': '@mui/material/styles/index.js',
    },
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    css: true,
  },
});
