// src/api/client.js
import axios from 'axios';
import { showToast } from '../utils/globalToast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 150000,
});

/* -------------------------------------------------------
   CSRF 쿠키 읽기 함수
-------------------------------------------------------- */
function readCookie(name) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop()) : '';
}

/* -------------------------------------------------------
   REQUEST 인터셉터
-------------------------------------------------------- */
api.interceptors.request.use(
  (config) => {
    // 백엔드가 Authorization 헤더 금지 → 항상 제거
    delete config.headers['Authorization'];

    // CSRF 자동 첨부
    const csrf = readCookie('csrf_token');
    if (csrf) config.headers['X-CSRF-Token'] = csrf;

    config.headers['Accept'] = 'application/json';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------------------------------------
   RESPONSE 인터셉터
-------------------------------------------------------- */
api.interceptors.response.use(
  // ① 정상 응답 → 단순 반환 (Toast 없음!)
  (res) => res,

  // ② 에러 응답 처리
  (error) => {
    // --- 1) 진짜 네트워크 오류(서버 다운, 프록시 불가 등) ---
    if (error.message === 'Network Error') {
      showToast("네트워크 오류 또는 서버 무응답입니다.");
      return Promise.reject({
        status: 0,
        message: "네트워크 오류 또는 서버 무응답입니다.",
      });
    }

    // error.response 없는 경우 → axios 내부/DevTools replay 등
    // 이런 경우는 Toast 표시하면 안 됨
    if (!error.response) {
      return Promise.reject(error);
    }

    // --- 2) 서버가 에러 response(4xx/5xx)를 준 경우 ---
    const { status, data } = error.response;
    const message = data?.message || "요청 처리 중 오류 발생";

    // 서버가 정상적으로 에러를 보낸 경우만 Toast
    if (status >= 400) {
      showToast(message);
    }

    return Promise.reject({
      status,
      message,
      data,
    });
  }
);

export default api;