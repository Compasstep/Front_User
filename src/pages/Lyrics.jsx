// src/pages/reputation/Lyrics.jsx

import { useState, useRef } from 'react';
import styled from 'styled-components';

function Lyrics() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: file.name + Date.now(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      fileObject: file,
    }));
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleDeleteFile = (fileId) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  const handleAnalysis = () => {
    if (uploadedFiles.length === 0) {
      alert('분석할 파일을 업로드해주세요.');
      return;
    }
    alert(`${uploadedFiles.length}개의 파일에 대한 가사 분석을 시작합니다.`);
  };

  return (
    <LyricsPageWrapper>
      <Container>
        {/* --- 왼쪽: 파일 업로드 영역 --- */}
        <UploadPanel>
          <Title>Your Lyrics Here</Title>
          <FileUploaderBox>
            <FileUploader onClick={handleChooseFile}>
              <p>Upload TXT files only (.txt up to 50MB)</p>
              <UploadButton>Choose TXT File</UploadButton>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept=".txt" style={{ display: 'none' }} />
            </FileUploader>
          </FileUploaderBox>
          <FileList>
            {uploadedFiles.map((file) => (
              <FileItem key={file.id}>
                <FileInfo>
                  <FileIcon>TXT</FileIcon>
                  <div>
                    <FileName>{file.name}</FileName>
                    <FileMeta>{file.size} • Completed</FileMeta>
                  </div>
                </FileInfo>
                <DeleteButton onClick={() => handleDeleteFile(file.id)}>🗑️</DeleteButton>
              </FileItem>
            ))}
          </FileList>
          <AnalyzeButton onClick={handleAnalysis}>Analyze & get Vocal Guide</AnalyzeButton>
        </UploadPanel>

        {/* --- 오른쪽: 분석 결과 영역 --- */}
        <ResultPanel>
          <Title>Analysis Result</Title>
          <ResultBox>
            <h3>Sentiment Breakdown</h3>
          </ResultBox>
          <ResultBox>
            <h3>AI Vocal Guide</h3>
            <p>AI 보컬 가이드가 여기에 표시됩니다.</p>
          </ResultBox>
        </ResultPanel>
      </Container>
    </LyricsPageWrapper>
  );
}

// --- styled-components ---

const LyricsPageWrapper = styled.div`
  &, h1, h2, h3, h4, h5, h6, p, button, small, div {
    font-family: 'Quicksand', sans-serif;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 40px;
  padding: 40px;
  height: calc(100vh - 70px);
`;

const Panel = styled.div`
  background-color: #EEF1F7;
  color: #1D2123;
  border-radius: 16px;
  padding: 30px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const UploadPanel = styled(Panel)``;
const ResultPanel = styled(Panel)``;

const Title = styled.h1`
  font-weight: bold;
  margin-bottom: 20px;
`;

const FileUploaderBox = styled.div`
  background-color: #FFF;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const FileUploader = styled.div`
  border: 2px dashed #DDE2EC;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  p {
    color: #868e96;
    margin-bottom: 15px;
  }
`;

const UploadButton = styled.button`
  background-color: #F1F3F5;
  color: #495057;
  border: 1px solid #DDE2EC;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
`;

const FileList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FileIcon = styled.div`
  background-color: #E9ECEF;
  color: #495057;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
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
  color: #ADB5BD;
  cursor: pointer;
  font-size: 18px;
`;

const AnalyzeButton = styled.button`
  background-color: #4285F4;
  color: white;
  font-size: 18px;
  padding: 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background-color: #357ae8;
  }
`;

const ResultBox = styled.div`
  background-color: #FFF;
  border: 1px solid #E9ECEF;
  color: #1D2123;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  flex-grow: 1;
  h3 {
    font-weight: bold;
    margin-bottom: 15px;
  }
  p {
    color: #868e96;
  }
`;

export default Lyrics;