// src/api/client.js
import axios from 'axios';

// ===== 콜백 훅(필요 시 외부에서 주입) =====
let onUnauthorized = null;
export const setOnUnauthorized = (fn) => { onUnauthorized = fn; };

// ===== axios 인스턴스 =====
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 1500000,
});

// --- CSRF 기본값 (Spring Security 표준) ---
api.defaults.xsrfCookieName = 'XSRF-TOKEN';
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// --- 쿠키에서 CSRF 읽어 수동 세팅(혹시 자동 세팅이 누락될 때 대비) ---
function getCookie(name) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

api.interceptors.request.use((config) => {
  // 동일 출처 프록시(/api) 사용 중이면 withCredentials만으로 충분하지만,
  // 혹시 누락될 때 대비해 수동으로 헤더 보강
  if (!config.headers['X-XSRF-TOKEN']) {
    const csrf = getCookie('XSRF-TOKEN');
    if (csrf) config.headers['X-XSRF-TOKEN'] = csrf;
  }
  // JSON 명시 (일부 환경에서 필요)
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// --- 응답 에러 공통 처리 ---
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;

    // 401: 토큰 만료/무효 → 리다이렉트 또는 콜백
    if (status === 401) {
      if (typeof onUnauthorized === 'function') {
        try { await onUnauthorized(error); } catch {}
      }
    }

    // 419/403: CSRF 이슈일 수 있음 → 안내 메시지를 올려주거나, 필요 시 CSRF 재발급 핑
    return Promise.reject(error);
  }
);

export default api;
