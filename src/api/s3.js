// src/api/s3.js
import api from "./client";

/**
 * 1) 프론트 → 백엔드 : Presigned URL 발급 요청
 *    백엔드 DTO 구조:
 *    {
 *      "fileType": "profile",
 *      "contentType": "image/png",
 *      "fileSize": 12345,
 *      "originalFileName": "xxx.png"
 *    }
 */
export async function requestPresignedUrl(file) {
  const body = {
    fileType: "image",           // 폴더명: profile/{uuid}_{파일명}
    contentType: file.type,        // image/png
    fileSize: file.size,           // 바이트 크기
    originalFileName: file.name,   // 원본 파일명
  };

  const res = await api.post("/user/files/url", body);
  return res?.data?.result;  // { presignedUrl, fileUrl }
}

/**
 * 2) S3에 PUT 업로드
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
