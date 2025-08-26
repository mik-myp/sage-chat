import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://apis.iflow.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'https://apis.iflow.cn');
          });
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Headers'] =
              'Authorization, Content-Type';
            proxyRes.headers['Access-Control-Allow-Methods'] =
              'GET, POST, OPTIONS';
          });
        }
      }
    }
  },

  plugins: [
    react(),
    tailwindcss(),
    // 开发环境优化
    inspect(),
    // 生产环境优化
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
