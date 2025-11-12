import api from './axios';

// 예: 공개 목록
export const fetchPublicItems = async (page = 0, size = 10) => {
  const { data } = await api.get('/items', { params: { page, size } });
  return data; // { content, totalElements, ... }
};

// 예: 보호 리소스
export const fetchPrivateDashboard = async () => {
  const { data } = await api.get('/dashboard'); // 401 → 인터셉터가 처리
  return data;
};

// 예: 이미지(바이너리) 받기
export const fetchImageBlob = async (imageId) => {
  const res = await api.get(`/files/${imageId}`, { responseType: 'blob' });
  return res.data; // Blob
};

// 예: 파일 업로드
export const uploadFile = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/files', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
