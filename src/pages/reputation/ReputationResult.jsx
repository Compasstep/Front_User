import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

//import WordCloud from 'react-wordcloud';

import ChartBox from '../../components/ChartBox.jsx';
import { mockDoughnutData, mockBarData, mockWordCloudData } from '../../data/mockReputationData.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);

const wordCloudOptions = {
  colors: ['#FACD66', '#FFC107', '#4CAF50', '#2196F3', '#F44336', '#9C27B0', '#fff', '#eee'],
  fontFamily: 'Anton', 
  fontSizes: [20, 80],
  padding: 1,
  rotations: 2, 
  rotationAngles: [0, 90],
  scale: 'sqrt', 
  enableTooltip: false, 
  shape: 'circle',
  deterministic: true,
};


function ReputationResult() {
  const [searchParams] = useSearchParams();
  const singer = searchParams.get('singer');
  const title = searchParams.get('title');
  
  // (doughnutOptions, barOptions는 기존과 동일)
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
        font: {
          size: 14,
          weight: 'bold',
        },
        textStrokeColor: 'black',
        textStrokeWidth: 2,
        formatter: (value) => {
          return value;
        }
      }
    }
  };
  
  const barOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 40
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value) => `${value}%`,
      }
    },
    scales: {
      y: { ticks: { color: '#fff', font: {size: 14} }, grid: { display: false }, border: { display: false } },
      x: { 
        max: 100,
        ticks: { display: false }, 
        grid: { display: false }, 
        border: { display: false } 
      }
    }
  };

  return (
    <ResultContainer>
      <ResultHeader>
        <ResultTitle>음악 평판 분석</ResultTitle>
        <ResultSubTitle>Analyzing "{title}" by {singer}</ResultSubTitle>
      </ResultHeader>
      
      <ChartGrid>
        <LeftColumn>
          <ChartBox title="Sentiment Analysis">
            <Doughnut data={mockDoughnutData} options={doughnutOptions} />
          </ChartBox>
          <ChartBox title="Detailed Emotion distribution">
            <Bar data={mockBarData} options={barOptions} />
          </ChartBox>
        </LeftColumn>
        
        <RightColumn>
          <ChartBox title="Top Keywords (Word Cloud)">
            <WordCloudWrapper>
              <WordCloud
                words={mockWordCloudData}
                options={wordCloudOptions}
              />
            </WordCloudWrapper>
          </ChartBox>
        </RightColumn>
      </ChartGrid>
    </ResultContainer>
  );
}

// --- styled-components ---

// (ResultContainer, ResultHeader, ResultTitle, ResultSubTitle, ChartGrid, LeftColumn은 동일)
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

// --- 🚨 여기가 수정되었습니다 ---
const RightColumn = styled.div`
  & > div { /* ChartBox */
    height: calc(450px * 2 + 20px); /* = 920px */
    
    & > div { /* ChartContent (ChartBox.jsx의 스타일을 확장) */
      display: flex;
      align-items: center;
      justify-content: center;
      
      /* ChartBox.jsx의 원본 스타일을 유지합니다. */
      flex-grow: 1; 
      position: relative; 
    }
  }
`;

const WordCloudWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1; /* 너비와 높이를 1:1 비율(정사각형)로 강제 */
  margin: auto; /* flex 컨테이너 안에서 중앙 정렬 */
`;

export default ReputationResult;