import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@ui': fileURLToPath(new URL('./src/shared/components/ui', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
        '@composables': fileURLToPath(new URL('./src/composables', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET || 'http://localhost:8080',
          changeOrigin: true,
        },
        '/naver-api': {
          target: 'https://naveropenapi.apigw.ntruss.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/naver-api/, '')
        }
      }
    }
  }
})
