// src/api/userApi.js
import api from './client';

/**
 * 공통: 서버 응답이 { code, message, result } 형태일 때 result만 반환
 */
function unwrap(data) {
  if (data && typeof data === 'object' && 'result' in data) return data.result;
  return data;
}

/**
 * 로그인
 * @param {{loginId:string, password:string}} credentials
 * 서버 스펙에 따라 필드명(loginId/email/username 등)을 맞춰주세요.
 */
export async function login(credentials) {
  const { data } = await api.post('/api/user/auth/login', credentials);
  return unwrap(data);
}

/**
 * 로그아웃 (세션/쿠키 정리)
 */
export async function logout() {
  const { data } = await api.post('/api/user/auth/logout', {});
  return unwrap(data);
}

/**
 * 회원 탈퇴
 */
export async function signout() {
  const { data } = await api.delete('/api/user/auth/signout');
  return unwrap(data);
}

/**
 * 업로드용 presigned URL 생성
 * @param {{fileType:string, contentType:string, fileSize:number, originalFileName:string}} payload
 * @returns {{ presignedUrl:string, fileKey:string }}
 */
export async function createPresignedUrl(payload) {
  const { data } = await api.post('/api/user/files/url', payload);
  return unwrap(data); // { presignedUrl, fileKey }
}

/**
 * 다운로드용 presigned URL 생성
 * @param {{fileKey:string, originalFileName:string}} payload
 * @returns {{ presignedUrl:string }}
 */
export async function createDownloadUrl(payload) {
  const { data } = await api.post('/api/user/files/download', payload);
  return unwrap(data); // { presignedUrl }
}

/**
 * (옵션) S3에 실제 업로드(직접 PUT)
 * axios보다 fetch가 간단합니다. 실패 시 에러 throw.
 * @param {string} presignedUrl
 * @param {File|Blob} file
 * @param {string} contentType
 */
export async function uploadToS3(presignedUrl, file, contentType = 'application/octet-stream') {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`S3 업로드 실패: ${res.status} ${text}`);
  }
  return true;
}

/**
 * (옵션) YouTube 링크 조회: /api/user/youtube-link?title=..&artist=..
 * 스웨거에 있으므로 필요하면 사용하세요.
 */
export async function getYoutubeLink(params /* { title, artist } */) {
  const { data } = await api.get('/api/user/youtube-link', { params });
  return unwrap(data); // { title, artist, url }
}

/**
 * (옵션) 최신곡 장르별 랭킹: /api/user/rankings?genre=&market=&limit=
 */
export async function getRankings(params /* { genre, market, limit } */) {
  const { data } = await api.get('/api/user/rankings', { params });
  return unwrap(data); // [{ rank, songTitle, artistName, albumImageUrl }, ...]
}

export default {
  login,
  logout,
  signout,
  createPresignedUrl,
  createDownloadUrl,
  uploadToS3,
  getYoutubeLink,
  getRankings,
};
