import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

//import WordCloud from 'react-wordcloud';
import ChartBox from '../../components/ChartBox.jsx';
import { mockDoughnutData, mockBarData, mockWordCloudData } from '../../data/mockReputationData.js';
import WordCloudCompat from '../../components/WordCloudCompat.jsx';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);

const wordCloudOptions = {
  fontFamily: 'Anton',
  fontSizes: [20, 80],
  padding: 1,
  rotations: 2,
  rotationAngles: [0, 90],
};

function UnreleasedAnalysisResult() {
  const { shareId } = useParams();

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
        textStrokeColor: 'black',
        textStrokeWidth: 2,
        formatter: (value) => value
      }
    }
  };

  const barOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    layout: { padding: { right: 40 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#fff',
        font: { weight: 'bold', size: 14 },
        formatter: (value) => `${value}%`,
      }
    },
    scales: {
      y: { ticks: { color: '#fff', font: { size: 14 } }, grid: { display: false }, border: { display: false } },
      x: { max: 100, ticks: { display: false }, grid: { display: false }, border: { display: false } }
    }
  };

  return (
    <ResultContainer>
      <ResultHeader>
        <ResultTitle>지인 평가 분석 결과</ResultTitle>
        <ResultSubTitle>Analysis for Share ID: {shareId}</ResultSubTitle>
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
              <WordCloudCompat
                words={mockWordCloudData}
                options={wordCloudOptions}
                width={600}
                height={600}
              />
            </WordCloudWrapper>
          </ChartBox>
        </RightColumn>
      </ChartGrid>
    </ResultContainer>
  );
}

// --- styled-components ---

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

export default UnreleasedAnalysisResult;