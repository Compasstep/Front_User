// src/pages/reputation/Lyrics.jsx

import { useState, useRef } from 'react';
import styled from 'styled-components';
import { requestPresignedUrl, uploadToS3 } from '../../api/s3';
import api from '../../api/client';

function Lyrics() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  /* ---------------------------- 파일 선택 ---------------------------- */
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

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  /* ---------------------------- 분석 실행 ---------------------------- */
  const handleAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      alert('분석할 가사 파일을 업로드해주세요.');
      return;
    }

    const file = uploadedFiles[0].fileObject; // 단일 파일 분석 기준
    setLoading(true);

    try {
      /* -----------------------------------------------------------
       1) presigned URL 발급 요청
      ----------------------------------------------------------- */
      const presigned = await requestPresignedUrl(file, {
        fileType: "lyrics",
      });

      if (!presigned?.presignedURL || !presigned?.fileKey) {
        alert("Presigned URL 발급 실패");
        return;
      }

      /* -----------------------------------------------------------
       2) S3 업로드 수행
      ----------------------------------------------------------- */
      await uploadToS3(presigned.presignedURL, file);

      /* -----------------------------------------------------------
       3) DB에 가사 파일 metadata 저장 (lyricsId 반환)
      ----------------------------------------------------------- */
      const metaRes = await api.post("/lyrics/files/store", {
        title: file.name.replace(".txt", ""),
        fileKey: presigned.fileKey,
      });

      const lyricsId = metaRes?.data?.result?.content_id;
      if (!lyricsId) {
        alert("가사 파일 저장 실패 (lyricsId 없음)");
        return;
      }

      /* -----------------------------------------------------------
       4) 분석 요청 API 호출
      ----------------------------------------------------------- */
      const analysisRes = await api.post("/user/analyze/lyrics", {
        lyricsId: lyricsId,
      });

      setAnalysisResult(analysisRes?.data?.result);
      alert("가사 분석이 완료되었습니다.");

    } catch (err) {
      console.error(err);
      alert("가사 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LyricsPageWrapper>
      <Container>
        {/* ---------------- 좌측: 파일 업로드 패널 ---------------- */}
        <UploadPanel>
          <Title>Your Lyrics Here</Title>

          <FileUploaderBox>
            <FileUploader onClick={handleChooseFile}>
              <p>Upload TXT files only (.txt up to 50MB)</p>
              <UploadButton>Choose TXT File</UploadButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
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
                    <FileMeta>{file.size} • Uploaded</FileMeta>
                  </div>
                </FileInfo>
                <DeleteButton onClick={() => handleDeleteFile(file.id)}>
                  🗑️
                </DeleteButton>
              </FileItem>
            ))}
          </FileList>

          <AnalyzeButton disabled={loading} onClick={handleAnalysis}>
            {loading ? "Analyzing..." : "Analyze & get Vocal Guide"}
          </AnalyzeButton>
        </UploadPanel>

        {/* ---------------- 우측: 분석 결과 패널 ---------------- */}
        <ResultPanel>
          <Title>Analysis Result</Title>

          <ResultBox>
            <h3>Sentiment Breakdown</h3>
            {analysisResult ? (
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(analysisResult.analysisData, null, 2)}
              </pre>
            ) : (
              <p>분석 결과가 여기에 표시됩니다.</p>
            )}
          </ResultBox>

          <ResultBox>
            <h3>AI Vocal Guide</h3>
            <p>라인별 코칭은 위 JSON 데이터 안에 포함되어 있습니다.</p>
          </ResultBox>
        </ResultPanel>
      </Container>
    </LyricsPageWrapper>
  );
}


/* ---------------------------- styled-components ---------------------------- */

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

  &:disabled {
    background-color: #9cbff9;
    cursor: not-allowed;
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
`;

export default Lyrics;
