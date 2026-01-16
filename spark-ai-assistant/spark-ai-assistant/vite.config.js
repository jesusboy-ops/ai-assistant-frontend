import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://ai-assistant-backend-oqpp.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('📤 Proxying Request:', req.method, req.url);
            console.log('📤 Target:', 'https://ai-assistant-backend-oqpp.onrender.com' + req.url);
            
            // Ensure proper headers are set
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('User-Agent', 'Spark-AI-Assistant/1.0');
            
            if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
              proxyReq.setHeader('Content-Type', 'application/json');
            }
            
            // Set origin to match the backend domain for CORS
            proxyReq.setHeader('Origin', 'https://ai-assistant-backend-oqpp.onrender.com');
            
            // Add any auth headers from the original request
            if (req.headers.authorization) {
              proxyReq.setHeader('Authorization', req.headers.authorization);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📥 Proxy Response:', proxyRes.statusCode, req.url);
            if (proxyRes.statusCode >= 400) {
              console.log('❌ Proxy Response Error:', proxyRes.statusCode, proxyRes.statusMessage);
            }
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 4173,
    host: true
  }
})
