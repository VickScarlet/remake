import { defineConfig } from 'eslint/config'
// @ts-ignore
import preact from 'eslint-config-preact'
import defaultConfig from '../../eslint.config.ts'

export default defineConfig([
    defaultConfig,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: { ...preact.plugins },
        rules: { ...preact.rules },
        settings: { ...preact.settings },
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest',
            parserOptions: {
                ...preact.parserOptions,
                ecmaFeatures: {
                    jsx: true,
                    ...preact.parserOptions?.ecmaFeatures,
                },
            },
        },
    },
])
