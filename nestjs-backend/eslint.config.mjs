// @ts-check
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  stylistic.configs.customize({
    rules: {
      'stylistic/quotes': ['error', 'single'],
      'stylistic/semi': ['error', 'always'],
      'stylistic/trailing-comma': ['error', 'all'],
      'stylistic/indent': ['error', 2],
      'stylistic/object-curly-spacing': ['error', 'always'],
      'stylistic/array-bracket-spacing': ['error', 'never'],
      'stylistic/comma-dangle': ['error', 'always-multiline'],
    },
  }),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);
