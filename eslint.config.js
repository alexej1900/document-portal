import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['**/dist', '**/build', '**/coverage', '**/storybook-static']),
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        languageOptions: { globals: { ...globals.node } },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        },
    },
    eslintConfigPrettier, // всегда последним
]);
