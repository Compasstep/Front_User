// src/api/client.js
import axios from 'axios';
import useUserStore from '../store/userStore';

// 선택 콜백(옵션)
let onUnauthorized = null;
let onCsrfToken = null;
export const setOnUnauthorized = (fn) => { onUnauthorized = fn; };
export const setOnCsrfToken = (fn) => { onCsrfToken = fn; };

// ─────────────────────────────────────────────────────────────
// axios 인스턴스
// ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,          // 쿠키(JWT/리프레시/CSRF) 포함
  timeout: 150000,                // 유튜브 분석 대기 고려
});

// ★ CSRF: “있으면 보내는” 전략
api.defaults.xsrfCookieName = 'csrf_token';
api.defaults.xsrfHeaderName = 'X-CSRF-Token';

function readCookie(name) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop()) : '';
}

// 취소 에러 판별(환경별 케이스 흡수)
function isCanceled(error) {
  return (
    axios.isCancel?.(error) ||
    error?.code === 'ERR_CANCELED' ||
    error?.message === 'canceled' ||
    error?.name === 'CanceledError' ||
    error?.cause?.name === 'CanceledError' ||
    error?.config?.signal?.aborted === true
  );
}

// ── Request 인터셉터
api.interceptors.request.use(
  (config) => {
    // Bearer(상태관리에서 쓰는 경우만)
    const accessToken = useUserStore.getState().accessToken;
    if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

    // CSRF: 쿠키/스토리지 중 있는 값만 첨부 (없으면 안 보냄)
    const csrf =
      readCookie('csrf_token') ||
      sessionStorage.getItem('csrfToken') ||
      localStorage.getItem('csrfToken');
    if (csrf) config.headers['X-CSRF-Token'] = csrf;

    // 기본 헤더
    if (!config.headers['Accept']) config.headers['Accept'] = 'application/json';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response 인터셉터
api.interceptors.response.use(
  (res) => {
    // 서버가 헤더/바디로 새 CSRF 토큰을 줄 수도 있음 → 보관 콜백
    const h = res.headers || {};
    const token =
      h['x-csrf-token'] ||
      h['x-xsrf-token'] ||
      res.data?.csrfToken ||
      res.data?.result?.csrfToken;
    if (token && typeof onCsrfToken === 'function') onCsrfToken(token);
    return res;
  },
  async (error) => {
    // 취소는 그대로
    if (isCanceled(error)) return Promise.reject(error);

    // 무응답/네트워크
    if (!error?.response) {
      return Promise.reject({
        status: 0,
        message: '네트워크 오류 또는 서버 무응답입니다.',
        data: null,
        _wrapped: 'no-response',
      });
    }

    const { status, data } = error.response;
    const url = String(error.config?.url || '');
    const isAuthEndpoint = url.includes('/user/auth/');

    if (status === 401) {
      if (!isAuthEndpoint && typeof onUnauthorized === 'function') {
        try { onUnauthorized(error); } catch {}
      }
      return Promise.reject({
        status,
        message: data?.message || '인증이 필요합니다.',
        data,
      });
    }

    const msg =
      data?.message ||
      data?.error ||
      (status >= 500 ? '서버 오류가 발생했습니다.' : '요청을 처리할 수 없습니다.');

    return Promise.reject({ status, message: msg, data });
  }
);

export default api;
