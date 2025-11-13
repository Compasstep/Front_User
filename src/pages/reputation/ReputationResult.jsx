import { useSearchParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import WordCloudCompat from "../../components/WordCloudCompat";
import ChartBox from '../../components/ChartBox.jsx';
import { mockDoughnutData, mockBarData, mockWordCloudData } from "../../data/mockReputationData.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);

const wordCloudOptions = {
  colors: ['#FACD66', '#FFC107', '#4CAF50', '#2196F3', '#F44336', '#9C27B0', '#fff', '#eee'],
  fontFamily: 'Anton',
  fontSizes: [20, 80],
  padding: 1,
  rotations: 2,
  rotationAngles: [0, 90],
  scale: 'sqrt',
  deterministic: true,
};

function ReputationResult() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const singer = searchParams.get('singer');
  const title = searchParams.get('title');

  const { summary } = location.state || {};

  /** 로딩 효과 (UX 통일) */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400); // 0.4초 후 표시
    return () => clearTimeout(t);
  }, []);

  /** ★ summary 없어도 똑같이 로딩 UI 먼저 보여줌 */
  if (loading) {
    return <LoadingSpinner title="SEARCH" time="잠시만 기다려주세요..." />;
  }

  /** API 실패로 summary가 없을 때 */
  if (!summary) {
    return <ResultContainer>요청한 데이터가 없습니다.</ResultContainer>;
  }

  /** 실제 API 데이터 매핑 */
  const sentiment = summary.sentimentSummary;
  const emotions = summary.emotionDetails;
  const keywords = summary.keywords || [];

  const doughnutData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [
          Math.round(sentiment.positive * 100),
          Math.round(sentiment.negative * 100),
          Math.round(sentiment.neutral * 100)
        ],
        backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E'],
        borderColor: ['#1D2123'],
        borderWidth: 5,
      }
    ]
  };

  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#fff',
          font: { size: 14 },
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        }
      },
      datalabels: {
        color: '#fff',
        font: { size: 14, weight: 'bold' },
        formatter: (value) => value,
      }
    }
  };

  const barData = {
    labels: Object.keys(emotions),
    datasets: [
      {
        label: 'Emotion Distribution',
        data: Object.values(emotions).map(v => Math.round(v * 100)),
        backgroundColor: ['#FF9800', '#2196F3', '#4CAF50', '#607D8B'],
      }
    ]
  };

  const barOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    layout: { padding: { right: 40 } },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#fff',
        font: { weight: 'bold', size: 14 },
        formatter: (value) => `${value}%`,
      }
    },
    scales: {
      y: { ticks: { color: '#fff', font: { size: 14 } }, grid: { display: false } },
      x: { max: 100, ticks: { display: false }, grid: { display: false } },
    }
  };

  const wordCloudData = keywords.map(k => ({ text: k, value: 50 }));

  return (
    <ResultContainer>
      <ResultHeader>
        <ResultTitle>음악 평판 분석</ResultTitle>
        <ResultSubTitle>Analyzing "{title}" by {singer}</ResultSubTitle>
      </ResultHeader>

      <ChartGrid>
        <LeftColumn>
          <ChartBox title="Sentiment Analysis">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </ChartBox>

          <ChartBox title="Detailed Emotion distribution">
            <Bar data={barData} options={barOptions} />
          </ChartBox>
        </LeftColumn>

        <RightColumn>
          <ChartBox title="Top Keywords (Word Cloud)">
            <WordCloudWrapper>
              <WordCloudCompat words={wordCloudData} options={wordCloudOptions} />
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
  background-color: #FACD66;
  color: #1D2123;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
  text-align: center;
`;

const ResultTitle = styled.h1`
  font-family: 'Anton', sans-serif;
  margin: 0 0 10px 0;
`;

const ResultSubTitle = styled.p`
  font-family: 'Quicksand', sans-serif;
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
