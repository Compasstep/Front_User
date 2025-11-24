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
  &, * {
    font-family: "Quicksand", sans-serif;
  }
`;

const Container = styled.div`
  display: flex;
  padding: 40px;
`;

const Panel = styled.div`
  background-color: #eef1f7;
  color: #1d2123;
  padding: 30px;
  border-radius: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const UploadPanel = styled(Panel)``;

const Title = styled.h1`
  font-weight: bold;
  margin-bottom: 20px;
`;

const FileUploaderBox = styled.div`
  background: #fff;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const FileUploader = styled.div`
  border: 2px dashed #dde2ec;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
`;

const UploadButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  border-radius: 8px;
  background: #e9ecef;
  border: none;
  cursor: pointer;
`;

const FileList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const FileItem = styled.div`
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileInfo = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const FileIcon = styled.div`
  background: #e9ecef;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
`;

const FileName = styled.p`
  font-weight: bold;
`;

const FileMeta = styled.small`
  color: #868e96;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const AnalyzeButton = styled.button`
  margin-top: 20px;
  padding: 15px;
  background: #4285f4;
  color: white;
  border-radius: 8px;
  border: none;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background: #357ae8;
  }
`;