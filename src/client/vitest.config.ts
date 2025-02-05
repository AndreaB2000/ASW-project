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
        'cypress/**',
        'src/main.ts',
        'src/assets/**',
        'src/router/index.ts',
        'src/components/icons/**',
        'src/views/AboutView.vue',
        'src/views/HomeView.vue',
        'env.d.ts',
      ],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        reporter: ['text', 'lcov'],
        reportsDirectory: 'coverage',
        exclude: [
          ...configDefaults.exclude,
          'cypress/**',
          'src/main.ts',
          'src/assets/**',
          'src/router/index.ts',
          'src/components/icons/**',
          'src/views/AboutView.vue',
          'src/views/HomeView.vue',
          'env.d.ts',
        ],
      },
    },
  }),
);
