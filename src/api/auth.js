// src/api/auth.js
import api from './client';

// Google ID 토큰으로 로그인 (서버가 쿠키에 세션/JWT를 심어줌)
export const loginWithGoogleIdToken = async (idToken) => {
  const { data } = await api.post('/user/auth/google', { idToken });
  return data;
};

// 로그아웃 (서버가 인증/리프레시 쿠키 삭제)
export const logout = async () => {
  const { data } = await api.post('/user/auth/logout');
  return data;
};

// 내 프로필 조회 (인증 필요)
export const getMyProfile = async () => {
  const { data } = await api.get('/user/me');
  return data; // { id, email, name, roles, ... }
};
