// src/pages/HomePage.jsx

import { useRef } from 'react';
import styled from 'styled-components';

function HomePage() {
  const featureSectionRef = useRef(null);

  const handleScrollDown = () => {
    featureSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageContainer>
      <HeroSection>
        <HeroText>
          READ
          <br />
          EMOTIONS,
          <br />
          CAPTURE
          <br />
          INSPIRATION
        </HeroText>
        <DownArrow onClick={handleScrollDown}>▼</DownArrow>
      </HeroSection>

      <FeatureSection ref={featureSectionRef}>
        {/* 아이템들을 가로로 묶어줄 Wrapper 추가 */}
          <br />
          <br />
          <br />
          <br />

        <FeatureWrapper>
          <FeatureItem>
            <FeatureTitle>영감을 담다.</FeatureTitle>
            <FeatureDescription>키워드로 새로운 레퍼런스를 찾고,<br />영감의 조각을 모아보세요.</FeatureDescription>
            <br />
            <FeatureImage src="/1.jpg" alt="영감을 담다" />
          </FeatureItem>
          <FeatureItem>
            <FeatureTitle>감정을 분석하다.</FeatureTitle>
            <FeatureDescription>가사를 분석하여 곡의 분위기를<br />객관적인 데이터로 확인하세요.</FeatureDescription>
            <br />
            <FeatureImage src="/2.jpg" alt="감정을 분석하다" />
          </FeatureItem>
          <FeatureItem>
            <FeatureTitle>함께 검증하다.</FeatureTitle>
            <FeatureDescription>팀원, 동료와 의견을 나누고<br />대중의 반응을 미리 예측하세요.</FeatureDescription>
            <br />
            <FeatureImage src="/3.jpg" alt="함께 검증하다" />
          </FeatureItem>
        </FeatureWrapper>
      </FeatureSection>
    </PageContainer>
  );
}

// --- styled-components ---

const PageContainer = styled.div`
  height: calc(100vh - 80px);
  overflow-y: scroll;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Section = styled.section`
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  position: relative;
  background-color: #1D2123;
`;

const HeroSection = styled(Section)``;

const HeroText = styled.h1`
  font-family: 'Anton', sans-serif;
  font-size: 6rem;
  line-height: 1.1;
`;

const DownArrow = styled.button`
  position: absolute;
  bottom: 40px;
  background: none;
  border: none;
  color: #FACD66;
  font-size: 50px;
  cursor: pointer;
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }
`;

// FeatureSection은 이제 Wrapper를 중앙 정렬하는 역할만 합니다.
const FeatureSection = styled(Section)``;

// FeatureItem들을 가로로 정렬할 Wrapper
const FeatureWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 50px;
  width: 100%;
  padding: 0 50px;
`;

const FeatureItem = styled.div`
  text-align: center;
  flex: 1; /* 자식 요소들이 동일한 너비를 갖도록 함 */
  max-width: 400px;
`;

const FeatureImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 20px; /* 설명과의 간격 */
  border-radius: 12px;
`;

const FeatureTitle = styled.h2`
  font-family: 'Anton', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 1.1rem;
  color: #aaa;
  line-height: 1.5;
`;

export default HomePage;