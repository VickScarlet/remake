import { defineConfig } from 'eslint/config'
import parser from '@typescript-eslint/parser'
import plugin from '@typescript-eslint/eslint-plugin'

export default defineConfig([
    {
        ignores: ['dist/**', 'node_modules/**'],
        files: ['**/*.{js,jsx,ts,tsx}'],
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        // @ts-ignore
        plugins: { '@typescript-eslint': plugin },
    },
])
