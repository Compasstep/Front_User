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
      <PageTitle>YOUR REPUTATION</PageTitle>
      <PageSubtitle>지인에게 내 곡을 평가받으세요</PageSubtitle>

      <UploadPanel>
        <UploaderHeader>
          <div>
            <h3>Upload files</h3>
            <p>Select and upload the files of your choice</p>
          </div>
          <CloseButton>&times;</CloseButton>
        </UploaderHeader>

        <FileDropZone onClick={handleChooseFile}>
          <p>Choose a file or drag & drop it here</p>
          <small>MP3, WAV, M4A 등 50MB 이하 파일 지원</small>
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

/* ------------ styled-components -------------- */

const PageContainer = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-family: "Anton", sans-serif;
  font-size: 3rem;
  color: #fff;
`;

const PageSubtitle = styled.p`
  font-family: "Quicksand", sans-serif;
  color: #aaa;
  margin-bottom: 30px;
`;

const UploadPanel = styled.div`
  background-color: #fff;
  color: #1d2123;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 600px;
`;

const UploaderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  h3 {
    font-weight: bold;
    font-size: 18px;
  }
  p {
    color: #868e96;
    font-size: 14px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #adb5bd;
  cursor: pointer;
`;

const FileDropZone = styled.div`
  border: 2px dashed #dde2ec;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 20px;

  p {
    font-weight: bold;
  }
  small {
    color: #868e96;
    display: block;
    margin: 5px 0 15px;
  }
`;

const BrowseButton = styled.button`
  background-color: #f1f3f5;
  color: #495057;
  border: 1px solid #dde2ec;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
`;

const FileList = styled.div`
  margin-bottom: 20px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const FileIcon = styled.div`
  font-size: 24px;
`;

const FileInfo = styled.div`
  flex-grow: 1;
`;

const FileName = styled.p`
  font-weight: bold;
`;

const FileMeta = styled.small`
  color: #868e96;
  margin: 3px 0;
  display: block;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  font-size: 18px;
`;

const UploadButton = styled.button`
  background-color: #4285f4;
  color: white;
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  padding: 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #357ae8;
  }
`;

export default Unreleased;