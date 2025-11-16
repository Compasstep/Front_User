// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,        // ★ JWT/Refresh/CSRF 쿠키 포함
  timeout: 150000,              // 유튜브 분석 대기 고려
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
    // ① Authorization 헤더는 항상 제거 (백엔드가 금지)
    delete config.headers['Authorization'];

    // ② CSRF 자동 부착
    const csrf = readCookie('csrf_token');
    if (csrf) {
      config.headers['X-CSRF-Token'] = csrf;
    }

    // ③ 공통 헤더
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
  (res) => res, // 정상 응답 그대로 반환
  (error) => {
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: '네트워크 오류 또는 서버 무응답입니다.',
      });
    }

    const { status, data } = error.response;

    return Promise.reject({
      status,
      message: data?.message || '요청 처리 중 오류 발생',
      data,
    });
  }
);

export default api;