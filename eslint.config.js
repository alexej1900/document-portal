import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['**/dist', '**/build', '**/coverage', '**/storybook-static']),
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        },
    },
    {
        // API и конфиги в корне работают в Node
        files: ['apps/api/**', '*.{js,ts}'],
        languageOptions: { globals: { ...globals.node } },
    },
    {
        // Фронт работает в браузере и использует React
        files: ['apps/web/**/*.{ts,tsx}'],
        languageOptions: { globals: { ...globals.browser } },
        extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    },
    eslintConfigPrettier, // всегда последним
]);
