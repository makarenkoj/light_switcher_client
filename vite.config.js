import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()], // Залишаємо плагін
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Залишаємо alias
    },
  },
  server: {
    port: 3000, // Залишаємо налаштування сервера
  },
});