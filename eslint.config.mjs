import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import angularEslintTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import jsonc from 'eslint-plugin-jsonc';
import globals from 'globals';
import angularSignalPlugin from './eslint-plugin-angular-signal/index.js';

/** @type {import('eslint').ESLint.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@angular-eslint': angularEslintPlugin,
      'angular-signal': angularSignalPlugin,
    },
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...angularEslintPlugin.configs.recommended.rules,
      'angular-signal/require-inputsignal-type': 'error',
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
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        jasmine: 'readonly',
        spyOn: 'readonly',
        fail: 'readonly',
        console: 'readonly'
      }
    }
  },
  // Schematics-specific configurations
  {
    files: ['projects/*/schematics/**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        jasmine: 'readonly',
        spyOn: 'readonly',
        fail: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        require: 'readonly'
      }
    },
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
    languageOptions: {
      globals: globals.node
    }
  },
  {
    ignores: [
        '.angular/**',
        '.github/**',
        '.git/**',
        '.vscode/**',
        'dist/**',
        'node_modules/**',
        'projects/my-lib/schematics/dist/**',
        'angular.json',
        'package.json',
        'package-lock.json',
        'tsconfig.json'
    ],
  },
];
