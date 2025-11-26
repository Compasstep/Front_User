import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { requestPresignedUrl, uploadToS3 } from "../../api/s3";
import api from "../../api/client";
import { showToast } from "../../utils/globalToast";

function Unreleased() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newFiles = files.map((file) => ({
      id: file.name + Date.now(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      status: "ready",
      progress: 0,
      fileObject: file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (fileId) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
  };

  /* ------------------------------------------------------
     🔥 전체 업로드 + 메타 저장 + postId 생성
  ------------------------------------------------------ */
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      showToast("업로드할 파일을 선택해주세요.");
      return;
    }

    const file = uploadedFiles[0].fileObject;
    const title = file.name.replace(/\.[^/.]+$/, "");

    try {
      setIsUploading(true);

      /* 1) Presigned URL 요청 */
      const { presignedUrl, fileKey } = await requestPresignedUrl(file, {
        fileType: "song", // 반드시 song
      });

      if (!presignedUrl || !fileKey) throw new Error("presigned URL 생성 실패");

      /* 2) S3 업로드 */
      await uploadToS3(presignedUrl, file);

      /* 3) 노래 메타데이터 저장 → songId 생성 */
      const storeRes = await api.post("/song/files/store", {
        title,
        fileKey,
      });

      const songId = storeRes?.data?.result?.content_id;
      if (!songId) throw new Error("songId 생성 실패");

      /* 4) 게시글 생성 → postId 생성 */
      const postRes = await api.post("/user/mypage/posts", {
        songId,
      });

      const postId = postRes?.data?.result?.postId;
      if (!postId) throw new Error("postId 생성 실패");

      /* 5) 결과 페이지 이동 */
      navigate(`/analysis/unreleased/result?postId=${postId}`);
    } catch (err) {
      console.error("[Unreleased Upload Error]", err);
      showToast("업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <LoadingSpinner
        title="UPLOADING"
        time="지인 평가 링크 생성 중..."
      />
    );
  }

  return (
    <PageContainer>
      <PageTitle>미발매 곡 평가받기</PageTitle>
      <PageSubtitle>음악을 업로드하면 평가 링크가 생성됩니다</PageSubtitle>

      <UploadPanel>

        <FileDropZone onClick={handleChooseFile}>
          <p>Choose a file or drag & drop it here</p>
          <small>Only MP3 50MB 이하 파일 지원</small>
          <BrowseButton>Browse File</BrowseButton>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="audio/*"
            multiple={false}
            style={{ display: "none" }}
          />
        </FileDropZone>

        <FileList>
          {uploadedFiles.map((file) => (
            <FileItem key={file.id}>
              <FileIcon>🎵</FileIcon>
              <FileInfo>
                <FileName>{file.name}</FileName>
                <FileMeta>
                  {file.size} • {file.status}
                </FileMeta>
              </FileInfo>
              <DeleteButton onClick={() => handleDeleteFile(file.id)}>
                🗑️
              </DeleteButton>
            </FileItem>
          ))}
        </FileList>

        <UploadButton onClick={handleUpload}>Upload</UploadButton>
      </UploadPanel>
    </PageContainer>
  );
}

/* ===========================
   개선된 스타일 (완전 업그레이드 버전)
   =========================== */

const PageContainer = styled.div`
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1d2123;
  min-height: 100vh;
  color: #fff;
`;

const PageTitle = styled.h1`
  font-family: "Anton", sans-serif;
  font-size: 3.4rem;
  color: #fff;
  margin-bottom: 8px;
`;

const PageSubtitle = styled.p`
  font-family: "Quicksand", sans-serif;
  color: #cfcfcf;
  margin-bottom: 40px;
  font-size: 1rem;
`;

const UploadPanel = styled.div`
  background-color: #f8fafc;
  color: #1d2123;
  border-radius: 22px;
  padding: 32px;
  width: 100%;
  max-width: 620px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

const FileDropZone = styled.div`
  border: 2px dashed rgba(150, 160, 180, 0.4);
  border-radius: 14px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  background: #ffffff;
  transition: 0.25s ease;

  &:hover {
    background: #f3f6ff;
    border-color: #8fa8ff;
  }

  p {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 6px;
  }
  small {
    color: #8b94a5;
    display: block;
    margin-bottom: 16px;
  }
`;

const BrowseButton = styled.button`
  background-color: #eef1f5;
  color: #495057;
  border: 1px solid #dde2ec;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s ease;

  &:hover {
    background-color: #e5e8ed;
  }
`;

const FileList = styled.div`
  margin-top: 10px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 6px;
  border-bottom: 1px solid #e6e8eb;

  &:last-child {
    border-bottom: none;
  }
`;

const FileIcon = styled.div`
  font-size: 26px;
`;

const FileInfo = styled.div`
  flex-grow: 1;
`;

const FileName = styled.p`
  font-weight: 600;
  margin-bottom: 3px;
`;

const FileMeta = styled.small`
  color: #7d8696;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  font-size: 18px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.6;
  }
`;

const UploadButton = styled.button`
  background-color: #3b82f6;
  color: white;
  width: 100%;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 16px 0;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 8px 18px rgba(59,130,246,0.3);
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:active {
    transform: scale(0.97);
  }
`;

export default Unreleased;