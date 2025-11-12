import styled from 'styled-components';

// Released.jsx의 로딩 UI를 재사용 가능한 컴포넌트로 분리
function LoadingSpinner({ title = 'SEARCH', time = '잠시만 기다려주세요...' }) {
  return (
    <Container>
      <LoadingText>{title}</LoadingText>
      <Spinner />
      <LoadingTime>{time}</LoadingTime>
    </Container>
  );
}

// --- styled-components ---

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1D2123; // 배경을 어둡게 처리
`;

const LoadingText = styled.h1`
  font-family: 'Anton', sans-serif;
  font-size: 4rem;
`;

const Spinner = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #FACD66;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: 40px 0;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingTime = styled.p`
  color: #aaa;
`;

export default LoadingSpinner;