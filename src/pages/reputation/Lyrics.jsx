import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { requestPresignedUrl, uploadToS3 } from "../../api/s3";
import api from "../../api/client";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { showToast } from "../../utils/globalToast";

function Lyrics() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChooseFile = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id: file.name + Date.now(),
      name: file.name.replace(/\.txt$/, ""),
      size: `${(file.size / 1024).toFixed(1)} KB`,
      fileObject: file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      showToast("TXT 파일을 업로드해주세요.");
      return;
    }

    const file = uploadedFiles[0].fileObject;
    const title = uploadedFiles[0].name;

    try {
      setLoading(true);

      const { presignedUrl, fileKey } = await requestPresignedUrl(file, {
        fileType: "lyrics",
      });

      await uploadToS3(presignedUrl, file);

      const metaRes = await api.post("/lyrics/files/store", {
        title,
        fileKey,
      });

      const lyricsId = metaRes?.data?.result?.content_id;

      await api.post("/user/analyze/lyrics", { lyricsId });

      // 🔥 분석 완료 → 결과 페이지로 이동
      navigate(`/analysis/lyrics/result/${lyricsId}`);
    } catch (err) {
      console.error(err);
      showToast("가사 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        title="LYRICS"
        time="AI가 가사를 분석하고 있습니다..."
      />
    );
  }

  return (
    <Wrapper>
      <Container>
        <UploadPanel>
          <Title>💬 가사 데이터 입력</Title>

          <FileUploaderBox>
            <FileUploader onClick={handleChooseFile}>
              <p>Upload TXT files only (.txt up to 50MB)</p>
              <UploadButton>Choose TXT File</UploadButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt"
                style={{ display: "none" }}
              />
            </FileUploader>
          </FileUploaderBox>

          <FileList>
            {uploadedFiles.map((file) => (
              <FileItem key={file.id}>
                <FileInfo>
                  <FileIcon>TXT</FileIcon>
                  <div>
                    <FileName>{file.name}</FileName>
                    <FileMeta>{file.size}</FileMeta>
                  </div>
                </FileInfo>
                <DeleteButton onClick={() => handleDeleteFile(file.id)}>
                  🗑️
                </DeleteButton>
              </FileItem>
            ))}
          </FileList>

          <AnalyzeButton disabled={loading} onClick={handleAnalysis}>
            Analyze & get Vocal Guide
          </AnalyzeButton>
        </UploadPanel>
      </Container>
    </Wrapper>
  );
}

export default Lyrics;

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
  font-family: "Anton", sans-serif;
  font-size: 2.2rem;
  color: #1d2123;
  margin-top: 6px;
  margin-bottom: 10px;
  text-align: center;
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
  background: #ffffff;
  transition: 0.25s ease;

  &:hover {
    background: #f3f6ff;
    border-color: #8fa8ff;
  }

  p {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #444;
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
  transition: background 0.2s ease;

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
  background: #eef1f5;
  padding: 10px 12px;
  border-radius: 6px;
  font-weight: bold;
  color: #495057;
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
  color: #adb5bd;
  cursor: pointer;
  font-size: 18px;

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
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:active {
    transform: scale(0.97);
  }
`;
