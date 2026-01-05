import { defineConfig } from 'eslint/config'
import tseslint from '@electron-toolkit/eslint-config-ts'
import eslintPluginSvelte from 'eslint-plugin-svelte'

/**
 * @typedef {import('eslint/rules').ESLintRules} ESRules
 * @typedef {{ [K in keyof ESRules as `@typescript-eslint/${K}`]: ESRules[K] }} TSRules
 * @type TSRules
 * */
const tsRules = {
  "@typescript-eslint/no-unused-vars": [
    'error',
    {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
    },
  ],
};

export default defineConfig(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  tseslint.configs.recommended,
  eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
  {
    files: ['**/*.{tsx,svelte}'],
    rules: {
      'svelte/no-unused-svelte-ignore': 'off',
    }
  },
  {
    files: [
      '**/*.ts',
    ],
    rules: tsRules,
  },
)
