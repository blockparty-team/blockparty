import { dirname } from 'path';
import { fileURLToPath } from 'url';
import baseConfig from '../../../../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  ...baseConfig,
  ...nx.configs['flat/angular'],
  {
    files: ['**/*.ts'],
    rules: {
      // User-directed migration skip for this duplicate page library; keep workspace lint-passing without editing source in this step.
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'lib',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.json'],
    rules: {
      // User-directed migration skip for this duplicate page library; keep workspace lint-passing without editing source in this step.
      '@nx/dependency-checks': 'off',
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
