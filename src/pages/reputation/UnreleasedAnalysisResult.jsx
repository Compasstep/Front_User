// src/pages/reputation/UnreleasedAnalysisResult.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import WordCloudCompat from "../../components/WordCloudCompat.jsx";
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
   감정 영어 → 한국어 매핑
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

function UnreleasedAnalysisResult() {
  const { shareId } = useParams();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  /* ---------------------------------
     TODO 실제 API 호출 (shareId 기반)
     아래 더미를 이후에 실제 API로 교체하면 됨
  ----------------------------------- */
  useEffect(() => {
    async function fetchData() {
      try {
        // 🔥 shareId 로 AI 분석 데이터를 불러오는 API 예정
        // const res = await api.get(`/analysis/unreleased/${shareId}`);
        // setSummary(res.data.result);

        // --- MOCK SAMPLE ---
        const mock = {
          sentimentSummary: {
            positive: 0.42,
            negative: 0.12,
            neutral: 0.46,
          },
          emotionDetails: {
            joy_happiness: 0.22,
            sadness_grief: 0.11,
            caring_love: 0.18,
            admiration: 0.14,
            anger_annoyance: 0.04,
            disgust: 0.01,
            fear_nervousness: 0.03,
            gratitude: 0.08,
            confusion: 0.07,
            neutral_misc: 0.12,
          },
          keywords: ["멜로디", "보컬", "감성", "화음", "코러스", "분위기"],
        };
        setSummary(mock);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [shareId]);

  if (loading) {
    return <LoadingSpinner title="AI ANALYSIS" time="지인 평가 분석 중입니다..." />;
  }

  if (!summary) {
    return (
      <ResultContainer>
        분석 데이터가 없습니다. (shareId={shareId})
      </ResultContainer>
    );
  }

  /* -------- Sentiment Data -------- */
  const sentiment = summary.sentimentSummary;
  const emotions = summary.emotionDetails;
  const keywords = summary.keywords || [];

  const doughnutData = {
    labels: ["긍정", "부정", "중립"],
    datasets: [
      {
        data: [
          Math.round(sentiment.positive * 100),
          Math.round(sentiment.negative * 100),
          Math.round(sentiment.neutral * 100),
        ],
        backgroundColor: ["#4CAF50", "#F44336", "#9E9E9E"],
        borderColor: ["#1D2123"],
        borderWidth: 5,
      },
    ],
  };

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
        <ResultTitle>지인 평가 분석 결과</ResultTitle>
        <ResultSubTitle>Share ID: {shareId}</ResultSubTitle>
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

/* ---------------- styled-components (ReputationResult와 동일) ---------------- */

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

export default UnreleasedAnalysisResult;
