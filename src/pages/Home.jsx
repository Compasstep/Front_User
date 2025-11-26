import styled from 'styled-components';
import { Element, scroller } from 'react-scroll';

const BASE_URL = import.meta.env.BASE_URL;

function Home() {
  const handleScrollDown = () => {
    scroller.scrollTo('videoSection', {
      duration: 1200,
      smooth: 'easeInOutQuart',
    });
  };

  const goToIntro = () => {
    scroller.scrollTo('introSection', {
      duration: 1200,
      smooth: 'easeInOutQuart',
      offset: -70,
    });
  };

  return (
    <PageWrapper>

      {/* 🔥 1) HERO SECTION */}
        <HeroSection>
          <HeroText>
            음악 속 감정을 해석하고,<br />
            새로운 감정을 발견하세요
          </HeroText>

          <DescriptionText>
            감정 기반 음악 분석 플랫폼

          </DescriptionText>

          <StartButton onClick={goToIntro}>시작하기</StartButton>

          {/*<DownArrow onClick={handleScrollDown}>▼</DownArrow>*/}
        </HeroSection>

        {/* 🔥 2) VIDEO SECTION */}
        <Element name="videoSection">
          <VideoSection>
            <VideoTitle>감정을 읽는 기술</VideoTitle>
            <VideoSubtitle>
              AI가 분석한 음악 감정 데이터를 시각적으로 확인하세요.
            </VideoSubtitle>

            <VideoFrame
              autoPlay
              muted
              loop
              playsInline
              src={`${BASE_URL}Intro-Player.mp4`}
              alt="인트로영상"
            />
          </VideoSection>
        </Element>

        {/* 🔥 3) INTRO SECTION */}
        <Element name="introSection">
          <IntroSection>
            <IntroTitle>당신의 음악을 더 깊게 이해하세요</IntroTitle>

            <SliderContainer>

              <SlideCard>
                <CardIcon src={`${BASE_URL}emotion.png`} alt="감정 분석" />
                <CardTitle>음악 속 감정을 분석합니다</CardTitle>
                <CardDescription>
                  AI 기반 감정 분석으로 곡의 분위기와 감정 흐름을 시각적으로 확인하세요.
                </CardDescription>
              </SlideCard>

              <SlideCard>
                <CardIcon src={`${BASE_URL}inspi.png`} alt="영감 검색" />
                <CardTitle>영감을 위한 레퍼런스를 찾습니다</CardTitle>
                <CardDescription>
                  키워드와 감정 기반 검색으로 <br></br>
                  나만의 음악적 레퍼런스를 발견하세요.
                </CardDescription>
              </SlideCard>

              <SlideCard>
                <CardIcon src={`${BASE_URL}peer.png`} alt="평판 분석" />
                <CardTitle>지인의 평가로 반응을 검증합니다</CardTitle>
                <CardDescription>
                  지인을 초대해 의견을 모으고 <br></br> 
                  미발매곡의 반응을 미리 예측해보세요.
                </CardDescription>
              </SlideCard>
            </SliderContainer>
          </IntroSection>

          {/* 🔥 4) WHY COMPASSSTEP SECTION */}
          <WhySection>
            <WhyTitle>Compasstep이 제공하는 가치</WhyTitle>
          {/*
            <WhyStatsWrapper>

              <WhyStatCard>
                <StatNumber>98%</StatNumber>
                <StatLabel>정확도 기반 감정 분석</StatLabel>
              </WhyStatCard>

              <WhyStatCard>
                <StatNumber>1,200+</StatNumber>
                <StatLabel>AI 분석된 곡 데이터</StatLabel>
              </WhyStatCard>

              <WhyStatCard>
                <StatNumber>500+</StatNumber>
                <StatLabel>지인 평가 사례 누적</StatLabel>
              </WhyStatCard>

            </WhyStatsWrapper>
            */}
            <WhyContentWrapper>
              {/* 왼쪽 텍스트 */}
              <WhyTextBlock>
                <div>
                  <BadgeContainer>
                    <BadgeIcon src={`${BASE_URL}growth.png`} />
                    <BadgeBox>아티스트 성장</BadgeBox>
                  </BadgeContainer>

                  <WhyDescription>
                    아티스트가 더 성장할 수 있도록<br />
                    창작과 커리어 성장을 가속하는 인사이트를<br />
                    하나의 플랫폼에서 제공합니다.
                  </WhyDescription>
                </div>
              </WhyTextBlock>

              {/* 오른쪽 삽화 (너 PNG 넣으면 됨) */}
              <WhyImage
                src={`${BASE_URL}artist.png`}  // ← 네가 넣을 PNG 파일 이름
                alt="Compassstep illustration"
            />
            </WhyContentWrapper>
          </WhySection>
          {/* 🔥 5) TREND INSIGHT SECTION */}
          <TrendSection>
            <TrendContentWrapper>

              {/* 왼쪽: 이미지 */}
              <TrendImage
                src={`${BASE_URL}trend.png`}
                alt="트렌드 분석 이미지"
              />

              {/* 오른쪽: 텍스트 */}
              <TrendTextBlock>
                <div>
                  <TrendBadgeContainer>
                    <TrendBadgeIcon src={`${BASE_URL}popular.png`} />
                    <TrendBadgeBox>업계 트렌드 감지</TrendBadgeBox>
                  </TrendBadgeContainer>

                  <TrendDescription>
                    변동성이 큰 음악 시장에서<br/>
                    아티스트가 기회를 놓치지 않도록<br/>
                    실행 가능한 인사이트를 제공합니다.
                  </TrendDescription>
                </div>
              </TrendTextBlock>
            </TrendContentWrapper>
          </TrendSection>
          {/* 🔥 6) PEER FEEDBACK SECTION */}
          <PeerSection>
            <PeerContentWrapper>

              {/* 왼쪽 텍스트 */}
              <PeerTextBlock>
                <div>
                  <PeerBadgeContainer>
                    <PeerBadgeIcon src={`${BASE_URL}friends.png`} />
                    <PeerBadgeBox>지인 피드백 수집</PeerBadgeBox>
                  </PeerBadgeContainer>

                  <PeerDescription>
                    소규모 레이블과 인디 아티스트가<br/>
                    팬층 없이도 객관적인 의견을 얻을 수 있도록<br/>
                    지인 기반 피드백 수집 기능을 제공합니다.<br/>
                  </PeerDescription>
                </div>
              </PeerTextBlock>

              {/* 오른쪽 이미지 */}
              <PeerImage
                src={`${BASE_URL}peerservice.png`}   // 네가 넣을 PNG 파일
                alt="지인 피드백 수집 이미지"
              />

            </PeerContentWrapper>
          </PeerSection>
        </Element>
    </PageWrapper>
  );
}

export default Home;

/* ---------------- styled-components ---------------- */

const PageWrapper = styled.div``;

/* 🔥 HERO SECTION */
const HeroSection = styled.section`
  min-height: auto;
  background: #1D2123;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;   /* 👈 위쪽에 붙게 변경 */
  align-items: center;
  text-align: center;
  padding-top: 50px;            /* 👈 위쪽으로 올림 */
  padding-bottom: 40px;
`;


const HeroText = styled.h1`
  font-family: 'Anton';
  font-size: 3rem;
  line-height: 1.1;
  color: white;
`;

const DescriptionText = styled.p`
  color: #ccc;
  font-size: 1.1rem;
  margin-top: 20px;
`;

const StartButton = styled.button`
  margin-top: 30px;
  padding: 12px 32px;
  font-size: 1.2rem;
  border-radius: 10px;
  background: #FACD66;
  border: none;
  cursor: pointer;
  font-weight: 700;
`;

/* 🔥 VIDEO SECTION */
const VideoSection = styled.section`
  background: #1D2123;
  padding: 40px 20px;
  text-align: center;
`;

const VideoTitle = styled.h2`
  color: #FACD66;
  font-size: 2rem;
  font-family: 'Anton';
`;

const VideoSubtitle = styled.p`
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 30px;
`;

const VideoFrame = styled.video`
  width: 100%;
  max-width: 960px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.25);

  object-fit: cover;   /* 또는 contain */
`;


/* ---------------- INTRO SECTION (REVISED) ---------------- */

const IntroSection = styled.section`
  background: #1D2123;
  padding: 120px 0 60px;
  color: white;
  margin-bottom: 110px;
`;

const IntroTitle = styled.h2`
  font-family: 'Anton';
  font-size: 2.8rem;
  color: #FACD66;
  text-align: center;
  margin-bottom: 120px;
`;

const SliderContainer = styled.div`
  display: flex;
  justify-content: center;      /* 🎯 중앙 정렬 */
  align-items: flex-start;
  gap: 40px;                    /* 카드 간격 */
  padding: 0 40px;
  flex-wrap: wrap;              /* 화면 좁으면 아래로 내려감 */

  /* 슬라이더 기능 제거 */
  overflow: visible;
  scroll-snap-type: none;
`;

const SlideCard = styled.div`
  width: 360px;                  /* 🎯 카드 더 크게 */
  background: #111;
  border-radius: 22px;
  padding: 45px 30px;
  box-shadow: 0 12px 35px rgba(0,0,0,0.45);

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CardIcon = styled.img`
  width: 120px;                 /* 🎯 아이콘 크게 */
  height: auto;
  margin-bottom: 28px;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;            /* 🎯 글자 살짝 축소 */
  margin-bottom: 14px;
  color: #fff;
  font-weight: 700;
  line-height: 1.3;
`;

const CardDescription = styled.p`
  font-size: 0.85rem;           /* 🎯 더 작아짐 */
  color: #aaa;
  line-height: 1.45;
  max-width: 90%;
`;

/* ---------------- WHY COMPASSSTEP SECTION ---------------- */

const WhySection = styled.section`
  background: #11181C;
  padding: 120px 20px;
  text-align: center;
  color: white;
`;

const WhyTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #FFF;
  margin-bottom: 120px;
`;
/*
const WhyStatsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 180px;
  flex-wrap: wrap;
  margin-bottom: 150px;
`;

const WhyStatCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatNumber = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: #FACD66;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #aaa;
`;
*/
const WhyContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
`;

const BadgeIcon = styled.img`
  width: 42px;
  height: 42px;
  object-fit: contain;
`;

const BadgeBox = styled.div`
  padding: 12px 26px;
  background: #C7EBFF;      /* 하늘색 박스 */
  border-radius: 30px;
  font-size: 1.15rem;
  font-weight: 600;
  color: #0C2A3A;
  letter-spacing: -0.3px;
  display: inline-flex;
  align-items: center;
`;

const WhyTextBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 500px;   
`;

const WhyDescription = styled.p`
  font-size: 1.3rem;
  color: #ccc;
  line-height: 1.7;
  max-width: 450px;
  text-align: left;

  @media (max-width: 900px) {
    text-align: center;
  }
`;

const WhyImage = styled.img`
  width: 250px;
  height: auto;
  object-fit: contain;

  @media (max-width: 900px) {
    width: 260px;
    margin-top: 20px;
  }
`;

const TrendSection = styled.section`
  background: #11181C;
  padding: 120px 20px;
  color: white;
  margin-top: -20px;
`;

const TrendContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TrendTextBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 500px;
`;

const TrendBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
`;

const TrendBadgeIcon = styled.img`
  width: 42px;
  height: 42px;
  object-fit: contain;
`;

const TrendBadgeBox = styled.div`
  padding: 12px 26px;
  background: #C7EBFF;
  border-radius: 30px;
  font-size: 1.15rem;
  font-weight: 600;
  color: #0C2A3A;
  display: inline-flex;
  align-items: center;
`;

const TrendDescription = styled.p`
  font-size: 1.3rem;
  color: #ccc;
  line-height: 1.7;
  max-width: 450px;
  text-align: left;

  @media (max-width: 900px) {
    text-align: center;
  }
`;

const TrendImage = styled.img`
  width: 300px;
  height: auto;
  object-fit: contain;

  margin-left: 180px;

  @media (max-width: 900px) {
    width: 260px;
    margin-top: 20px;
  }
`;

/* ---------------- PEER FEEDBACK SECTION ---------------- */

const PeerSection = styled.section`
  background: #11181C;
  padding: 120px 20px;
  color: white;
`;

const PeerContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const PeerTextBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 500px;
`;

const PeerBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
`;

const PeerBadgeIcon = styled.img`
  width: 42px;
  height: 42px;
  object-fit: contain;
`;

const PeerBadgeBox = styled.div`
  padding: 12px 26px;
  background: #C7EBFF;
  border-radius: 30px;
  font-size: 1.15rem;
  font-weight: 600;
  color: #0C2A3A;
  letter-spacing: -0.3px;
  display: inline-flex;
  align-items: center;
`;

const PeerDescription = styled.p`
  font-size: 1.3rem;
  color: #ccc;
  line-height: 1.7;
  max-width: 450px;
  text-align: left;

  @media (max-width: 900px) {
    text-align: center;
  }
`;

const PeerImage = styled.img`
  width: 250px;
  height: auto;
  object-fit: contain;

  @media (max-width: 900px) {
    width: 260px;
    margin-top: 20px;
  }
`;
