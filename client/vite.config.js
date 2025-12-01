import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        // Binary 데이터 처리를 위한 설정
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // PDF 요청의 경우 buffer로 처리
            if (req.url.includes('/pdf/')) {
              proxyReq.setHeader('Accept', 'application/pdf');
            }
          });
        }
      }
    }
  }
});
