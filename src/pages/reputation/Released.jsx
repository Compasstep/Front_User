// src/pages/reputation/Released.jsx

import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

function Released() {
  const [singer, setSinger] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleAnalysis = async () => {
    if (!singer || !title) {
      alert('가수와 제목을 모두 입력해주세요.');
      return;
    }

    setStatus('loading');

    try {
      const res = await api.post('/user/analyze/youtube', {
        songTitle: title,
        artistName: singer,
      });

      const summary = res?.data?.result?.summary;
      if (!summary) throw new Error("summary 없음");

      navigate(
        `/analysis/reputation/result?singer=${encodeURIComponent(singer)}&title=${encodeURIComponent(title)}`,
        { state: { summary } }
      );
    } catch (err) {
      console.error("평판 분석 오류:", err);
      alert("평판 분석 중 오류가 발생했습니다.");
      setStatus('idle');
    }
  };

  /** ⭐ LoadingSpinner.jsx만 사용 */
  if (status === 'loading') {
    return <LoadingSpinner title="SEARCH" time="5s ~ 10s" />;
  }

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
const fadeInDown = keyframes`from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}`;
const fadeInUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

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
  transition: transform 0.3s;
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
  &:hover { color: #FACD66; }
`;

const LoadingText = styled.h1` font-size: 4rem; color: #fff; `;
const Spinner = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #FACD66;
  border-radius: 50%;
  width: 120px; height: 120px;
  animation: spin 2s linear infinite;
  margin: 40px 0;
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
const LoadingTime = styled.p` color: #aaa; `;

export default Released;
