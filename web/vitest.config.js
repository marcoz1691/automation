import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.js'],
    coverage: { provider: 'v8', include: ['js/checkout.js'], reporter: ['text', 'json-summary'] },
  },
});
