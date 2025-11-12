// src/api/client.js
import axios from 'axios';

// 선택 콜백
let onUnauthorized = null;
let onCsrfToken = null;
export const setOnUnauthorized = (fn) => { onUnauthorized = fn; };
export const setOnCsrfToken   = (fn) => { onCsrfToken = fn; };

// ─────────────────────────────────────────────────────────────
// axios 인스턴스
// ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,      // 쿠키 포함 (JWT/리프레시/CSRF)
  timeout: 150000,
});

// 스프링/커스텀 양쪽 모두 대응
api.defaults.xsrfCookieName = 'XSRF-TOKEN';     // 스프링 기본
api.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';   // 스프링 기본

// 우리 서버가 'csrf_token'을 쓰는 경우도 같이 지원
function readCookie(name) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop()) : '';
}
function getCsrfToken() {
  // 우선순위: 쿠키들 → sessionStorage → localStorage
  return (
    readCookie('XSRF-TOKEN') ||
    readCookie('csrf_token') ||
    sessionStorage.getItem('csrfToken') ||
    localStorage.getItem('csrfToken') ||
    ''
  );
}
function saveCsrfToken(token) {
  if (!token) return;
  // 헤더 전파용 임시 저장 (쿠키는 서버가 Set-Cookie로 내리는 게 원칙이지만
  // 프론트 전파를 위해 스토리지에도 넣어둔다)
  sessionStorage.setItem('csrfToken', token);
  // 서버가 커스텀 이름을 기대하는 경우를 위해 비 HttpOnly 쿠키도 세팅
  // (개발용; 배포는 서버 Set-Cookie 권장)
  document.cookie = `csrf_token=${encodeURIComponent(token)}; Path=/`;
  // 스프링 기본 이름도 같이 세팅
  document.cookie = `XSRF-TOKEN=${encodeURIComponent(token)}; Path=/`;
}

function isCanceled(error) {
  return (
    axios.isCancel?.(error) ||
    error?.code === 'ERR_CANCELED' ||
    error?.name === 'CanceledError' ||
    error?.config?.signal?.aborted === true
  );
}

// ─────────────────────────────────────────────────────────────
// Request 인터셉터
// ─────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Authorization 헤더는 사용하지 않음(쿠키 인증 전략)
    // CSRF: 존재하면 양쪽 헤더 키로 동시 전송
    const csrf = getCsrfToken();
    if (csrf) {
      // 스프링 기본
      config.headers['X-CSRF-TOKEN'] = csrf;
      // 커스텀(서버가 이 이름을 읽는 경우를 대비)
      config.headers['X-CSRF-Token'] = csrf;
      // 일부 미들웨어가 찾는 키
      config.headers['X-XSRF-TOKEN'] = csrf;
    }

    if (!config.headers['Accept']) {
      config.headers['Accept'] = 'application/json';
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────
// Response 인터셉터
// ─────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => {
    // 서버가 새 CSRF를 내려줄 수 있으니 모두 탐색
    const h = res.headers || {};
    const token =
      h['x-csrf-token'] ||
      h['x-xsrf-token'] ||
      res.data?.csrfToken ||
      res.data?.result?.csrfToken;
    if (token) {
      saveCsrfToken(token);
      if (typeof onCsrfToken === 'function') {
        try { onCsrfToken(token); } catch {}
      }
    }
    return res;
  },
  async (error) => {
    if (isCanceled(error)) return Promise.reject(error);

    const resp = error?.response;
    if (!resp) {
      return Promise.reject({
        status: 0,
        message: '네트워크 오류 또는 서버 무응답입니다.',
        data: null,
        _wrapped: 'no-response',
      });
    }

    const { status, data } = resp;
    const url = String(error.config?.url || '');
    const isAuthEndpoint = url.includes('/user/auth/');

    if (status === 401) {
      // 토큰 만료/부재: 재로그인 유도
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