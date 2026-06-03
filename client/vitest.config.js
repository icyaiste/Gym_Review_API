import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',  // default for frontend unit tests
    setupFiles: ['./src/test/setup.ts'],
    env: {
      NODE_ENV: 'test', // ensures Bearer test-token bypass works
    },
  },
});