import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const dataSplitRule = {
    test: /[\\/]packages[\\/]data[\\/]|@remake\/data/,
    priority: 40,
    name(id: string) {
        const name = id.split(/[\/\\]/).pop()!
        const baseName = name.substring(0, name.lastIndexOf('.'))
        if (baseName && baseName !== 'index') return `data-${baseName}`
        return null
    },
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: { tsconfigPaths: true },
    define: { 'import.meta.env.VITE_CHANNEL': '"bili"' },
    base: './',
    build: {
        outDir: 'dist/bili/remake',
        chunkSizeWarningLimit: 1500,
        rolldownOptions: {
            output: {
                codeSplitting: {
                    minSize: 1024,
                    groups: [dataSplitRule],
                },
            },
        },
    },
})
