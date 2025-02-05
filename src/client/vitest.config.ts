import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [
        ...configDefaults.exclude,
        'e2e/**',
        'src/main.ts',
        'src/assets/**',
        'src/router/index.ts',
        'src/components/icons/**',
      ],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        reporter: ['text', 'lcov'],
        reportsDirectory: 'coverage',
        exclude: [
          ...configDefaults.exclude,
          'e2e/**',
          'src/main.ts',
          'src/assets/**',
          'src/router/index.ts',
          'src/components/icons/**',
        ],
      },
    },
  }),
);
