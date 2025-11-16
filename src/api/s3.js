// src/api/s3.js
import api from "./client";

/**
 * Presigned URL 요청 (image / song / lyrics 공통)
 *
 * @param {File} file - 업로드할 파일 객체
 * @param {Object} extra - { fileType: "image" | "song" | "lyrics" }
 */
export async function requestPresignedUrl(file, extra = {}) {
  const body = {
    fileType: extra.fileType || "image",  // 기본값 유지 (기존 코드와 동일)
    contentType: file.type,
    fileSize: file.size,
    originalFileName: file.name,
  };

  // ⭐ 백엔드 API 명세: /api/user/files/url
  const res = await api.post("/user/files/url", body);
  return res?.data?.result; 
  // → { presignedURL: "...", fileKey: "..." }
}

/**
 * Presigned URL을 이용해 S3에 직접 업로드
 *
 * @param {string} presignedUrl - 서버가 발급한 S3 업로드 URL
 * @param {File} file - 업로드할 파일
 */
export async function uploadToS3(presignedUrl, file) {
  await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
}
