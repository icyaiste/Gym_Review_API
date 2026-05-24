import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',  // default for frontend unit tests
    setupFiles: ['./src/test/setup.ts'],
    environmentMatchGlobs: [
      ['tests/integration/**', 'node'],   // backend tests run in Node
    ],
    env: {
      NODE_ENV: 'test', // ensures Bearer test-token bypass works
    },
  },
});