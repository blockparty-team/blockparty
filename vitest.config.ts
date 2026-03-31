import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use one environment for the whole workspace to avoid brittle path-based rules.
    environment: 'jsdom',
    globals: true,
    include: ['**/*.{test,spec}.ts'],
  },
});
