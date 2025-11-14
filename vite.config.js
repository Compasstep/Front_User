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
  plugins: [
    react(),
    {
      name: 'csrf-injector',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            const cookies = parseCookie(req.headers.cookie || '');

            // ✔ Authorization은 건드리지 않음 (중요)
            // ✔ CSRF만 부족하면 보강
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
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
});
