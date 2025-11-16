import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { requestPresignedUrl, uploadToS3 } from "../../api/s3";
import api from "../../api/client";

function Lyrics() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // 🔥 URL 파라미터 기반 상세 조회 모드
  const [searchParams] = useSearchParams();
  const existingId = searchParams.get("analysisId");

  /* ==========================
     🔥 상세조회 자동 로딩
  ========================== */
  useEffect(() => {
    if (!existingId) return;

    (async () => {
      try {
        setLoading(true);

        const res = await api.get(`/user/mypage/lyrics-analyses/${existingId}`);
        const result = res.data.result;

        // 파일명 표시
        setUploadedFiles([
          {
            id: existingId,
            name: result.lyricsTitle || "가사",
            size: "",
            fileObject: null,
          },
        ]);

        // 분석 결과 표시
        setAnalysisData(result.analysisResult?.analysisData || []);
        setSelectedIndex(null);
      } catch {
        alert("가사 분석 결과를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [existingId]);

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
      alert("TXT 파일을 업로드해주세요.");
      return;
    }

    const file = uploadedFiles[0].fileObject;
    const title = uploadedFiles[0].name;

    try {
      setLoading(true);
      setAnalysisData(null);
      setSelectedIndex(null);

      const { presignedUrl, fileKey } = await requestPresignedUrl(file, {
        fileType: "lyrics",
      });

      await uploadToS3(presignedUrl, file);

      const metaRes = await api.post("/lyrics/files/store", {
        title,
        fileKey,
      });

      const lyricsId = metaRes?.data?.result?.content_id;

      const aiRes = await api.post("/user/analyze/lyrics", {
        lyricsId,
      });

      setAnalysisData(aiRes.data.result.analysisData);
    } catch (err) {
      console.error(err);
      alert("가사 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPart =
    selectedIndex !== null ? analysisData[selectedIndex] : null;

  return (
    <Wrapper>
      <Container>
        {/* Left Panel */}
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
            {loading ? "Analyzing..." : "Analyze & get Vocal Guide"}
          </AnalyzeButton>
        </UploadPanel>

        {/* Right Panel */}
        <ResultPanel>
          <Title>📊 AI 분석하기</Title>

          <ResultBox>
            <h3>🎼 가사</h3>

            {analysisData ? (
              <LyricList>
                {analysisData.map((item, idx) => (
                  <LyricLine
                    key={idx}
                    $active={selectedIndex === idx}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    {item.part}
                  </LyricLine>
                ))}
              </LyricList>
            ) : (
              <p>AI 감정 분석 결과가 여기에 표시됩니다.</p>
            )}
          </ResultBox>

          <ResultBox>
            <h3>🤖 AI 보컬 가이드</h3>

            {selectedPart ? (
              <CoachingBox>
                <OpenAIIcon>🌀</OpenAIIcon>
                <p>{selectedPart.coaching}</p>
              </CoachingBox>
            ) : (
              <p>가사 한 줄을 클릭하면 보컬 가이드가 표시됩니다.</p>
            )}
          </ResultBox>
        </ResultPanel>
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
  gap: 40px;
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
const ResultPanel = styled(Panel)``;

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

const ResultBox = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  margin-bottom: 20px;
  flex-shrink: 0;

  h3 {
    margin-bottom: 15px;
  }
`;

const LyricList = styled.div`
  background: #111;
  color: white;
  border-radius: 12px;
  padding: 8px;
  max-height: 260px;
  overflow-y: auto;

  /* 🔥 부모(ResultBox) padding 때문에 튀어나오는 문제 해결 */
  margin: 0 5px; 
`;

const LyricLine = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: ${(p) => (p.$active ? "#4285f4" : "#222")};
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    background: ${(p) => (p.$active ? "#357ae8" : "#333")};
  }
`;


const CoachingBox = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  line-height: 1.6;
  display: flex;
  gap: 12px;
`;

const OpenAIIcon = styled.div`
  font-size: 26px;
  margin-top: 4px;
`;
