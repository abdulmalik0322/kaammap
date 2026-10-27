import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    // mongodb-memory-server downloads/starts a real mongod — allow time.
    testTimeout: 60000,
    hookTimeout: 180000,
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
  },
});
