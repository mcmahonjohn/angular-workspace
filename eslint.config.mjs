import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import angularEslintTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import jsonc from 'eslint-plugin-jsonc';
import globals from 'globals';

import angularSignalPlugin from './eslint-plugin-angular-signal/index.js';

/** @type {import('eslint').ESLint.Config[]} */
export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.cypress,
        ...globals.jasmine,
        ...globals.node,
        cy: true,
      },
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.mjs', '**/*.spec.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@angular-eslint': angularEslintPlugin,
      'angular-signal': angularSignalPlugin.plugin,
    },
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...angularEslintPlugin.configs.recommended.rules,
      ...angularSignalPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularEslintTemplatePlugin,
    },
    languageOptions: {
      parser: (await import('@angular-eslint/template-parser')).default,
    },
    rules: {
      ...angularEslintTemplatePlugin.configs.recommended.rules,
    },
  },
  ...jsonc.configs['flat/recommended-with-jsonc'],
  // Schematics-specific configurations
  {
    files: ['projects/*/schematics/**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_|^options$|^runner$|^mockContext$|^mockTree$|^taskDeps$|^error$'
      }],
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_|^options$|^runner$|^mockContext$|^mockTree$|^taskDeps$|^error$'
      }]
    }
  },
  {
    files: ['projects/*/schematics/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_|^context$',
        varsIgnorePattern: '^_|^options$|^runner$|^mockContext$|^mockTree$|^taskDeps$',
        caughtErrorsIgnorePattern: '^_|^error$'
      }],
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_|^context$',
        varsIgnorePattern: '^_|^options$|^runner$|^mockContext$|^mockTree$|^taskDeps$',
        caughtErrorsIgnorePattern: '^_|^error$'
      }]
    }
  },
  {
    files: ['projects/*/schematics/**/*.js'],
  },
  {
    ignores: [
        '.angular/**',
        '.github/**',
        '.git/**',
        '.vscode/**',
        'coverage/**',
        'dist/**',
        'eslint-plugin-angular-signal/dist/**',
        'nestjs-backend/**',
        'node_modules/**',
        'projects/my-lib/dist/**',
        'projects/my-lib/schematics/dist/**',
        'angular.json',
        'package.json',
        'package-lock.json',
        'tsconfig.json'
    ],
  },
];
