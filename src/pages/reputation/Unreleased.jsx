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

  const handleChooseFile = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newFiles = files.map((file) => ({
      id: file.name + Date.now(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      fileObject: file,
    }));

    setUploadedFiles(newFiles);
  };

  const handleDeleteFile = (fileId) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      showToast("업로드할 파일을 선택해주세요.");
      return;
    }

    const file = uploadedFiles[0].fileObject;
    const title = file.name.replace(/\.[^/.]+$/, "");

    try {
      setIsUploading(true);

      const { presignedUrl, fileKey } = await requestPresignedUrl(file, {
        fileType: "song",
      });

      await uploadToS3(presignedUrl, file);

      const storeRes = await api.post("/song/files/store", {
        title,
        fileKey,
      });
      const songId = storeRes?.data?.result?.content_id;

      const postRes = await api.post("/user/mypage/posts", {
        songId,
      });
      const postId = postRes?.data?.result?.postId;

      navigate(`/analysis/unreleased/result?postId=${postId}`);
    } catch (err) {
      console.error("Upload Error:", err);
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
    <Wrapper>
      <Container>
        <UploadPanel>
          <Title>🎧 미발매 곡 평가 🎧</Title>
          <Subtitle>음악을 업로드하면 지인에게 공유할 평가 링크가 생성됩니다.</Subtitle>

          <FileUploaderBox>
            <FileUploader onClick={handleChooseFile}>
              <p>Choose a file or drag & drop it here</p>
              <small>Only MP3 (50MB 이하)</small>
              <UploadButton>Browse File</UploadButton>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/*"
                style={{ display: "none" }}
              />
            </FileUploader>
          </FileUploaderBox>

          <FileList>
            {uploadedFiles.map((file) => (
              <FileItem key={file.id}>
                <FileInfo>
                  <FileIcon>🎵</FileIcon>
                  <div>
                    <FileName>{file.name}</FileName>
                    <FileMeta>{file.size}</FileMeta>
                  </div>
                </FileInfo>
                <DeleteButton onClick={() => handleDeleteFile(file.id)}>🗑️</DeleteButton>
              </FileItem>
            ))}
          </FileList>

          <AnalyzeButton onClick={handleUpload}>
            Upload
          </AnalyzeButton>
        </UploadPanel>
      </Container>
    </Wrapper>
  );
}

export default Unreleased;

/* ====================== Styled Components ====================== */

const Wrapper = styled.div`
  background: #1d2123;
  min-height: 100vh;
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  color: #fff;

  &, * {
    font-family: "Quicksand", sans-serif;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UploadPanel = styled.div`
  background-color: #f8fafc;
  color: #1d2123;
  border-radius: 22px;
  padding: 32px;
  width: 100%;
  box-shadow: 0 18px 40px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

const Title = styled.h1`
  font-family: "Inter", sans-serif; 
  font-size: 2.2rem;
  text-align: center;
  color: #1d2123;
  margin-top: 6px;
`;

const Subtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  color: #8e8e8e;
  text-align: center;
  margin-top: -12px;
`;

const FileUploaderBox = styled.div`
  background: #fff;
  padding: 14px;
  border-radius: 14px;
`;

const FileUploader = styled.div`
  border: 2px dashed rgba(150, 160, 180, 0.4);
  border-radius: 14px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    background: #f3f6ff;
    border-color: #8fa8ff;
  }

  p {
    font-weight: 600;
    font-size: 1rem;
  }

  small {
    color: #8b94a5;
    display: block;
    margin-bottom: 16px;
  }
`;

const UploadButton = styled.button`
  background-color: #eef1f5;
  color: #495057;
  border: 1px solid #dde2ec;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;

  &:hover {
    background-color: #e5e8ed;
  }
`;

const FileList = styled.div`
  margin-top: 10px;
`;

const FileItem = styled.div`
  background: #ffffff;
  border: 1px solid #e6e8eb;
  border-radius: 10px;
  padding: 14px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const FileInfo = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

const FileIcon = styled.div`
  font-size: 24px;
`;

const FileName = styled.p`
  font-weight: 600;
  margin-bottom: 4px;
`;

const FileMeta = styled.small`
  color: #8b94a5;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #adb5bd;
  transition: 0.2s;

  &:hover {
    opacity: 0.6;
  }
`;

const AnalyzeButton = styled.button`
  width: 100%;
  padding: 16px 0;
  background-color: #3b82f6;
  color: white;
  border-radius: 12px;
  border: none;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 8px 18px rgba(59,130,246,0.3);

  &:hover {
    background-color: #2563eb;
  }

  &:active {
    transform: scale(0.97);
  }
`;
