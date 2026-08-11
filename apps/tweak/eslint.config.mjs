import angular from 'angular-eslint';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import baseConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  ...baseConfig,
  ...angular.configs.tsRecommended.map((c) => ({ ...c, files: ['**/*.ts'] })),
  { files: ['**/*.ts'], processor: angular.processInlineTemplates },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/component-class-suffix': [
        'error',
        {
          suffixes: ['Page', 'Component'],
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  ...angular.configs.templateRecommended.map((c) => ({
    ...c,
    files: ['**/*.html'],
  })),
  {
    files: ['**/*.html'],
    rules: {},
  },
];
