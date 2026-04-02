import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/** 与 foreign-trade 后端同时本地开发时设为 http://localhost:8001，并把 tracker API 跑在 8001 */
const trackerApiProxy = process.env.TRACKER_API_PROXY || 'http://localhost:8000'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          echarts: ['echarts'],
          vue: ['vue'],
        }
      }
    }
  },
  server: {
    port: 3210,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: trackerApiProxy,
        changeOrigin: true,
      },
    },
  }
})
