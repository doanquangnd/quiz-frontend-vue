import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://java-quiz.test',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://java-quiz.test',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
  css: {
    preprocessorOptions: {
        scss: {
            // Ẩn deprecation warnings từ dependencies (Bootstrap, Soft UI Dashboard)
            quietDeps: true,
            // Tắt các loại deprecation warnings cụ thể
            silenceDeprecations: [
                'import',           // @import deprecated
                'global-builtin',   // Global functions deprecated
                'color-functions',  // darken(), lighten() deprecated
                'slash-div',        // / division deprecated
                'function-units',   // Function units deprecated
                'abs-percent',      // abs() with percent deprecated
                'legacy-js-api',    // Legacy JavaScript API deprecated
            ],
        },
    },
},
})


