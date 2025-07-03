// vite.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/app.ts',
        'src/libs/**',
        'src/routers/**',
        'src/validators/**',
        'src/database/**',
      ], // プロジェクト構造に合わせて調整
    },
  },
});
