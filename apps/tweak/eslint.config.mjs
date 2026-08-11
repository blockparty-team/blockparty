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
      // User-directed migration skip for this duplicate app; keep workspace lint-passing without editing source in this step.
      '@nx/enforce-module-boundaries': 'off',
      // Newly enabled by the ESLint v9 Angular recommended presets; this app was not enforcing it before the upgrade.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      // Newly enabled by the updated Angular recommended presets; this app was not enforcing it before the upgrade.
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      // Newly enabled by the updated typescript-eslint recommended presets; this app was not enforcing it before the upgrade.
      '@typescript-eslint/no-empty-function': 'off',
      // Newly enabled by the ESLint v9 recommended set; this app was not enforcing it before the upgrade.
      'no-extra-boolean-cast': 'off',
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
