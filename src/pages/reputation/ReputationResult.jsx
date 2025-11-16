import { useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import WordCloudCompat from "../../components/WordCloudCompat";
import ChartBox from "../../components/ChartBox.jsx";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

/* ---------------------------------
   감정 영어 → 한국어 매핑 테이블
----------------------------------- */
const EMOTION_KO = {
  joy_happiness: "기쁨",
  gratitude: "감사",
  admiration: "감탄",
  interest_curiosity: "흥미/호기심",
  approval: "긍정",
  anger_annoyance: "분노/짜증",
  disgust: "혐오",
  sadness_grief: "슬픔",
  fear_nervousness: "두려움/긴장",
  surprise: "놀람",
  realization: "깨달음",
  relief: "안도",
  caring_love: "사랑/배려",
  embarrassment: "당황/창피",
  confusion: "혼란",
  curiosity: "호기심",
  disapproval: "부정",
  resolute: "결연함",
  arrogance: "오만",
  neutral_misc: "중립",
};

const wordCloudOptions = {
  colors: [
    "#FACD66",
    "#FFC107",
    "#4CAF50",
    "#2196F3",
    "#F44336",
    "#9C27B0",
    "#fff",
    "#eee",
  ],
  fontFamily: "Anton",
  fontSizes: [20, 80],
  padding: 1,
  rotations: 2,
  rotationAngles: [0, 90],
  scale: "sqrt",
  deterministic: true,
};

/**이 부분만 수정 계속 했음 */
function ReputationResult() {
  const location = useLocation();

  const initialSummary = location.state?.summary ?? null;
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // summary가 늦게 도착해도 반영
    if (initialSummary) setSummary(initialSummary);
    setLoading(false);
  }, [initialSummary]);

  if (loading) {
    return <LoadingSpinner title="SEARCH" time="잠시만 기다려주세요..." />;
  }

  if (!summary) {
    return <ResultContainer>분석 데이터를 불러오지 못했습니다.</ResultContainer>;
  }

  // 이후 summary 사용

  const singer = summary.artistName;
  const title = summary.songTitle;

  // 안전 처리
  const sentiment = summary.sentimentSummary ?? {};
  const emotions = summary.emotionDetails ?? {};
  const keywords = summary.keywords ?? [];

  const pos = Math.round((sentiment.positive ?? 0) * 100);
  const neg = Math.round((sentiment.negative ?? 0) * 100);
  const neu = Math.round((sentiment.neutral ?? 0) * 100);

  const doughnutData = {
    labels: ["긍정", "부정", "중립"],
    datasets: [
      {
        data: [pos, neg, neu],
        backgroundColor: ["#4CAF50", "#F44336", "#9E9E9E"],
        borderColor: ["#1D2123"],
        borderWidth: 5,
      },
    ],
  };
  /**여기 까지 수정 계속 */

  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#fff",
          font: { size: 14 },
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
        },
      },
      datalabels: {
        color: "#fff",
        font: { size: 14, weight: "bold" },
        formatter: (value) => value,
      },
    },
  };

  /* -------- Emotion TOP5 -------- */
  const top5Emotions = Object.entries(emotions)
    .map(([key, value]) => ({
      key,
      value: Math.round(value * 100),
      label: EMOTION_KO[key] || key,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const barData = {
    labels: top5Emotions.map((e) => e.label),
    datasets: [
      {
        label: "Emotion Distribution",
        data: top5Emotions.map((e) => e.value),
        backgroundColor: [
          "#FF9800",
          "#2196F3",
          "#4CAF50",
          "#607D8B",
          "#9C27B0",
        ],
      },
    ],
  };

  const barOptions = {
    indexAxis: "y",
    maintainAspectRatio: false,
    layout: {
      padding: { right: 40 },
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#fff",
        font: { weight: "bold", size: 14 },
        formatter: (value) => `${value}%`,
      },
    },
    scales: {
      y: {
        ticks: { color: "#fff", font: { size: 14 } },
        grid: { display: false },
      },
      x: {
        ticks: { display: false },
        grid: { display: false },
      },
    },
  };

  const wordCloudData = keywords.map((k) => ({
    text: k,
    value: 50,
  }));

  return (
    <ResultContainer>
      <ResultHeader>
        <ResultTitle>음악 평판 분석</ResultTitle>
        <ResultSubTitle>
          {singer} "{title}" 분석 결과
        </ResultSubTitle>
      </ResultHeader>

      <ChartGrid>
        <LeftColumn>
          <ChartBox title="감성 분포">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </ChartBox>

          <ChartBox title="주요 감정 비율">
            <Bar data={barData} options={barOptions} />
          </ChartBox>
        </LeftColumn>

        <RightColumn>
          <ChartBox title="댓글 키워드 클라우드">
            <WordCloudWrapper>
              <WordCloudCompat
                words={wordCloudData}
                options={wordCloudOptions}
              />
            </WordCloudWrapper>
          </ChartBox>
        </RightColumn>
      </ChartGrid>
    </ResultContainer>
  );
}

/* ---------------- styled-components (절대 수정 안함) ---------------- */

const ResultContainer = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const ResultHeader = styled.div`
  background-color: #facd66;
  color: #1d2123;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
  text-align: center;
`;

const ResultTitle = styled.h1`
  font-family: "Anton", sans-serif;
  margin: 0 0 10px 0;
`;

const ResultSubTitle = styled.p`
  font-family: "Quicksand", sans-serif;
  font-size: 18px;
  margin: 0;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div`
  & > div {
    height: calc(450px * 2 + 20px);

    & > div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      position: relative;
    }
  }
`;

const WordCloudWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  margin: auto;
`;

export default ReputationResult;
