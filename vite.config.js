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
      name: 'auth-header-injector',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          // /api로 향하는 요청만 처리
          if (req.url && req.url.startsWith('/api')) {
            const cookies = parseCookie(req.headers.cookie || '');
            const at = cookies['access_token'];
            if (at) {
              // ★ 여기서 Authorization 헤더를 강제 주입
              req.headers['authorization'] = `Bearer ${at}`;
            }
            // X-CSRF-Token은 이미 axios에서 추가하지만, 혹시 없으면 보강
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
