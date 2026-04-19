import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    server: {
        port: 3000,
        proxy: {
            // 代理到後端流程引擎服務
            '/workflow': {
                target: 'http://localhost:9090',
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: 'dist',
        chunkSizeWarningLimit: 2000
    }
})
