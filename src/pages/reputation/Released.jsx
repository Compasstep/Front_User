// src/pages/reputation/Released.jsx

import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// --- 가짜 데이터 (결과 화면용) ---
const mockDoughnutData = {
  labels: ['Positive', 'Negative', 'Neutral'],
  datasets: [{ data: [55, 30, 15], backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E'], borderColor: ['#1D2123'], borderWidth: 5 }],
};
const mockBarData = {
    labels: ['Joy', 'Energy', 'Hope', 'Chill'],
    datasets: [{ label: 'Emotion Distribution', data: [100, 33, 55, 49], backgroundColor: ['#FF9800', '#2196F3', '#4CAF50', '#607D8B'] }]
};

function Released() {
  const [singer, setSinger] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success'
  
  const handleAnalysis = () => {
    if (!singer || !title) {
      alert('가수와 제목을 모두 입력해주세요.');
      return;
    }
    setStatus('loading');
    setTimeout(() => { setStatus('success'); }, 3000);
  };

  // --- 상태에 따라 다른 UI 렌더링 ---
  if (status === 'loading') {
    return (
      <Container>
        <LoadingText>SEARCH</LoadingText>
        <Spinner /> 
        <LoadingTime>5s ~ 10s</LoadingTime>
      </Container>
    );
  }

  if (status === 'success') {
    return (
        <ResultContainer>
            <ResultHeader>
                <ResultTitle>음악 평판 분석</ResultTitle>
                <ResultSubTitle>Analyzing "{title}" by {singer}</ResultSubTitle>
            </ResultHeader>
            <ChartGrid>
                <ChartBox><h3>Sentiment Analysis</h3><Doughnut data={mockDoughnutData} options={{ maintainAspectRatio: false }} /></ChartBox>
                <ChartBox><h3>Top Keywords (Word Cloud)</h3><p>워드 클라우드</p></ChartBox>
                <ChartBox><h3>Detailed Emotion distribution</h3><Bar data={mockBarData} options={{ maintainAspectRatio: false }} /></ChartBox>
            </ChartGrid>
        </ResultContainer>
    );
  }

  // --- 기본 입력 화면 ---
  return (
    <Container>
      <Content>
        <Title>가수와 제목을 입력하고 평판을 확인하세요</Title>
        <SearchWrapper>
          <DecorativeImage src="/keyword.png" alt="decorative" />
          <InputContainer>
            <InputGroup>
              <SearchInput
                type="text"
                placeholder="Singer"
                value={singer}
                onChange={(e) => setSinger(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <SearchInput
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </InputGroup>
          </InputContainer>
          <SearchButton onClick={handleAnalysis}>→</SearchButton>
        </SearchWrapper>
      </Content>
    </Container>
  );
}

// --- styled-components ---

const fadeInDown = keyframes`/* ... */`;
const fadeInUp = keyframes`/* ... */`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/background.png');
  background-size: cover;
  background-position: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  font-family: 'Quicksand', sans-serif;
  color: #FACD66;
  font-size: 30px;
  margin-bottom: 40px;
  animation: ${fadeInDown} 0.8s ease-out;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const DecorativeImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 24px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(40, 40, 40, 0.8);
  border-radius: 50px;
  padding: 10px 25px;
  backdrop-filter: blur(5px);
  transition: box-shadow 0.3s ease-in-out;
  &:focus-within {
    box-shadow: 0 0 0 2px #FACD66;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  width: 450px;
  outline: none;
  &::placeholder { color: #888; }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  padding-left: 15px;
  transition: color 0.3s ease-in-out;
  &:hover { color: #FACD66; }
`;

// --- 로딩 및 결과 화면 스타일 ---
const LoadingText = styled.h1` font-size: 4rem; `;
const Spinner = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #FACD66;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: 40px 0;
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
const LoadingTime = styled.p` color: #aaa; `;
const ResultContainer = styled.div` padding: 40px; max-width: 1200px; margin: 0 auto; `;
const ResultHeader = styled.div`
  background-color: #FACD66;
  color: #1D2123;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 40px;
`;
const ResultTitle = styled.h1` font-family: 'Anton', sans-serif; `;
const ResultSubTitle = styled.p` font-family: 'Quicksand', sans-serif; `;
const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
`;
const ChartBox = styled.div`
  background-color: #2a2f32;
  padding: 20px;
  border-radius: 12px;
  height: 400px;
  h3 { margin-bottom: 20px; }
`;

export default Released;