// src/pages/reputation/LyricsResult.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../../api/client";
import LoadingSpinner from "../../components/LoadingSpinner";
import { showToast } from "../../utils/globalToast";

function LyricsResult() {
  const { lyricsId } = useParams();

  const [analysisData, setAnalysisData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await api.get(`/user/mypage/lyrics-analyses/${lyricsId}`);
        const result = res?.data?.result;

        // 🚀 안정성 강화: 배열인지 확인 후 설정
        const data = result?.analysisResult?.analysisData;
        setAnalysisData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setAnalysisData([]); // 에러시 빈 배열 처리
        showToast("가사 분석 결과를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [lyricsId]);

  if (loading) {
    return (
      <LoadingSpinner
        title="LYRICS"
        time="AI가 분석한 결과를 불러오는 중입니다..."
      />
    );
  }

  const selectedPart =
    selectedIndex !== null ? analysisData[selectedIndex] : null;

  return (
    <Wrapper>
      <Container>
        <ResultPanel>
          <Title>📊 AI 분석 결과</Title>

          {/* ----------------- 가사 리스트 ----------------- */}
          <ResultBox>
            <h3>🎼 가사</h3>
            <br />

            <LyricList>
              {(analysisData ?? []).map((item, idx) => (
                <LyricLine
                  key={idx}
                  $active={selectedIndex === idx}
                  onClick={() => setSelectedIndex(idx)}
                >
                  {item.part}
                </LyricLine>
              ))}
            </LyricList>
          </ResultBox>

          {/* ----------------- 보컬 가이드 ----------------- */}
          <ResultBox>
            <h3>🤖 AI 보컬 가이드</h3>
            <br />

            {selectedPart ? (
              <CoachingBox>
                <OpenAIIcon>🎤</OpenAIIcon>
                <p>{selectedPart.coaching}</p>
              </CoachingBox>
            ) : (
              <p>가사 한 줄을 선택하면 보컬 가이드가 표시됩니다.</p>
            )}
          </ResultBox>
        </ResultPanel>
      </Container>
    </Wrapper>
  );
}

export default LyricsResult;

/* ---------------- Styled Components ---------------- */

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

const ResultPanel = styled.div`
  background-color: #eef1f7;
  padding: 30px;
  border-radius: 16px;
  flex: 1;
  color: #1d2123;
`;

const Title = styled.h1`
  font-weight: bold;
  margin-bottom: 20px;
`;

const ResultBox = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  margin-bottom: 20px;
  color: #1d2123;
`;

const LyricList = styled.div`
  background: #111;
  color: #fff;
  padding: 8px;
  border-radius: 12px;
  max-height: 300px;
  overflow-y: auto;
`;

const LyricLine = styled.div`
  padding: 12px;
  background: ${(p) => (p.$active ? "#4285f4" : "#222")};
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    background: ${(p) => (p.$active ? "#357ae8" : "#333")};
  }
`;

const CoachingBox = styled.div`
  background: #f0f6ff;                 /* ✨ Soft blue highlight */
  padding: 28px;
  border-radius: 14px;
  display: flex;
  gap: 18px;
  align-items: flex-start;

  box-shadow: 0 4px 12px rgba(0,0,0,0.06);   /* ✨ subtle shadow */
  border: 1px solid #dce9ff;

  p {
    font-size: 17px;                    /* ✨ 더 가독성 있는 크기 */
    line-height: 1.65;                  /* ✨ 자연스러운 줄간격 */
    margin: 0;
    color: #1d2733;
    font-weight: 500;                   /* ✨ 약간 강조 */
    word-break: keep-all;
  }
`;

const OpenAIIcon = styled.div`
  font-size: 22px;
  background: white;
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;                   /* ✨ 동그란 아이콘 */
  box-shadow: 0 2px 6px rgba(0,0,0,0.1); /* ✨ 입체감 */
  flex-shrink: 0;
`;
