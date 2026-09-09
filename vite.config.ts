/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8094,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    allowedHosts: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    include: ['tasks/**/*.test.{ts,tsx}']
  }
});
