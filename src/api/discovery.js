// src/api/discoveryApi.js
import api from './client'; // baseURL, 쿠키/CSRF 인터셉터 이미 설정되어 있어야 합니다.

/**
 * 키워드 기반 탐색
 * @param {string} query - 검색어
 * @returns {Promise<Array<{videoId:string,title:string,channelName:string,thumbnailUrl:string,youtubeUrl:string}>>}
 */
export async function searchByKeyword(query) {
  const { data } = await api.post('/api/user/discovery/keyword', { query });
  // 백엔드 응답 형태: { code, message, result: [...] }
  return data.result ?? [];
}
