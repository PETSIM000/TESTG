import { defineConfig } from 'vitest/config';
export default defineConfig({
  define: { __BUILD__: JSON.stringify('test'), __BUILD_MSG__: JSON.stringify('') },
  test: { include: ['tests/unit/**/*.test.js'], environment: 'node' },
});
