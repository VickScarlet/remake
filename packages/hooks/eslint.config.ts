import { defineConfig } from 'eslint/config'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import defaultConfig from '../../eslint.config.ts'

export default defineConfig([
    defaultConfig,
    {
        ...react.configs.flat.recommended!,
        settings: { react: { version: '19' } },
    },
    react.configs.flat['jsx-runtime']!,
    reactHooks.configs.flat.recommended,
])
