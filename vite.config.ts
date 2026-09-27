import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 8094,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    allowedHosts: true
  },
  plugins: [
    {
      name: 'transform-ts-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (id.includes('/tasks/') && id.endsWith('.test.ts')) {
          return transformWithOxc(code, id, {
            lang: 'tsx'
          });
        }
      }
    },
    react()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['@testing-library/jest-dom/vitest'],
    onConsoleLog(log) {
      process.stdout.write(log + '\n');
      return true;
    },
    include: [
      'tasks/**/*.test.{ts,tsx}',
      'src/**/*.test.{ts,tsx}'
    ]
  }
});
