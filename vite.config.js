// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 간단 쿠키 파서
function parseCookie(header = '') {
  return header.split(';').reduce((acc, part) => {
    const [k, ...rest] = part.trim().split('=');
    if (!k) return acc;
    acc[k] = decodeURIComponent(rest.join('=') || '');
    return acc;
  }, {});
}

export default defineConfig({
  base: '/user/',
  plugins: [
    react(),
    {
      name: 'csrf-injector',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {

          // 추가된 리다이렉트 로직
          if (req.url === '/user') {
            res.statusCode = 301;
            res.setHeader('Location', '/user/');
            return res.end();
          }
          // 끝

          if (req.url && req.url.startsWith('/api')) {
            const cookies = parseCookie(req.headers.cookie || '');
            if (!req.headers['x-csrf-token'] && cookies['csrf_token']) {
              req.headers['x-csrf-token'] = cookies['csrf_token'];
            }
          }

          next();
        });
      },
    },
  ],
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
      '/posts': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
