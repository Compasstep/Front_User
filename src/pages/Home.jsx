import styled from 'styled-components';
import { Element, scroller } from 'react-scroll';

function Home() {
  const handleScrollDown = () => {
    scroller.scrollTo('introSection', {
      duration: 1500, // 스크롤 지속 시간 (밀리초) 숫자 클수록 느려짐
      delay: 0, 
      smooth: 'easeInOutQuart', // 부드러운 스크롤 애니메이션 종류
      offset: -70, // 헤더 높이만큼 덜 스크롤하여 가려지지 않게 함
    });
  };

  return (
    // ✨ 두 섹션을 감싸는 PageWrapper 추가
    <PageWrapper>
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
          <br />
          <br />
        <DownArrow onClick={handleScrollDown}>▼</DownArrow>
      </HeroSection>

        {/* ✨ 3. FeatureSection을 Element로 감싸고 이름을 지정합니다. */}
      <Element name="introSection">
        <FeatureSection>
          <SectionTitle>READ THE PUBLIC'S MIND</SectionTitle>
          <FeatureWrapper>
            <FeatureItem>
              <FeatureTitle>영감을 담다</FeatureTitle>
              <FeatureDescription>키워드로 새로운 레퍼런스를 찾고,<br />영감의 조각을 모아보세요.</FeatureDescription>
              <FeatureImage src="/1.jpg" alt="영감을 담다" />
            </FeatureItem>
            <FeatureItem>
              <FeatureTitle>감정을 분석하다</FeatureTitle>
              <FeatureDescription>가사를 분석하여 곡의 분위기를<br />객관적인 데이터로 확인하세요.</FeatureDescription>
              <FeatureImage src="/2.jpg" alt="감정을 분석하다" />
            </FeatureItem>
            <FeatureItem>
              <FeatureTitle>함께 검증하다</FeatureTitle>
              <FeatureDescription>팀원, 동료와 의견을 나누고<br />대중의 반응을 미리 예측하세요.</FeatureDescription>
              <FeatureImage src="/3.jpg" alt="함께 검증하다" />
            </FeatureItem>
          </FeatureWrapper>
        </FeatureSection>
      </Element>
    </PageWrapper>
  );
}

// --- styled-components ---

const PageWrapper = styled.div`
  /* 스크롤의 기준이 되는 컨테이너 */
`;

const Section = styled.section`
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 40px;
  background-color: #1D2123;
`;

const HeroSection = styled(Section)`
  position: sticky; /* ✨ 핵심: 스크롤될 때 화면 상단에 붙어있도록 설정 */
  top: 70px; /* 헤더의 높이만큼 아래에 붙도록 */
  z-index: 1; /* 뒤쪽 레이어 */
`;

const HeroText = styled.h1`
  font-family: 'Anton', sans-serif;
  font-size: 5.3rem;
  line-height: 1.1;
`;

const DownArrow = styled.button`
  position: absolute;
  bottom: 30px;
  background: none;
  border: none;
  color: #FACD66;
  font-size: 40px;
  cursor: pointer;
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }
`;

const FeatureSection = styled(Section)`
  position: relative; /* z-index를 적용하기 위해 필요 */
  z-index: 2; /* ✨ 앞쪽 레이어 */
`;

// ✨ SectionTitle 스타일 추가
const SectionTitle = styled.h2`
  font-family: 'Anton', sans-serif;
  font-size: 3rem;
  color: #FACD66;
  margin-bottom: 80px;
  font-weight: normal;
`;

const FeatureWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 50px;
  width: 100%;
  max-width: 1200px;
`;

const FeatureItem = styled.div`
  text-align: center;
  flex: 1;
`;

const FeatureImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 20px;
  border-radius: 12px;
`;

const FeatureTitle = styled.h2`
  font-family: 'Anton', sans-serif;
  font-size: 1.8rem;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 0.9rem;
  color: #aaa;
  line-height: 1.5;
`;

export default Home;