import axios from 'axios';

// 쿠키에서 특정 값을 읽어오는 헬퍼 함수
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};


// Axios 인스턴스 생성
const apiClient = axios.create({
  // 나중에 백엔드 서버 주소를 여기에 입력합니다.
  // 예: baseURL: 'http://localhost:8080/api'
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',

  // 쿠키를 주고받기 위한 설정 (CSRF 토큰을 쿠키로 받는 경우 필수)
  withCredentials: true,
});


// --- 요청 인터셉터 ---
// 모든 API 요청이 서버로 전송되기 전에 이 코드가 먼저 실행됩니다.
apiClient.interceptors.request.use(
  (config) => {
    // 1. 백엔드에서 CSRF 토큰을 어떤 이름의 쿠키로 주는지 확인해야 합니다.
    //    보통 'XSRF-TOKEN' 또는 'csrftoken' 이라는 이름을 많이 사용합니다.
    const csrfToken = getCookie('XSRF-TOKEN');

    // 2. CSRF 토큰이 존재하면, 모든 요청의 헤더에 'X-CSRF-TOKEN'을 추가합니다.
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

export default apiClient;