// src/components/LoadingSpinner.jsx

import styled, { keyframes } from 'styled-components';

function LoadingSpinner({ title = "LOADING", time = "5s ~ 10s" }) {
  return (
    <FullScreenWrapper>
      <LoadingTitle>{title}</LoadingTitle>
      <Spinner />
      <LoadingTime>{time}</LoadingTime>
    </FullScreenWrapper>
  );
}

export default LoadingSpinner;

/* ------------------- styled-components ------------------- */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const FullScreenWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #1D2123;
  animation: ${fadeIn} 0.3s ease-out;

  z-index: 99999; /* UI 완전 위 */
`;

const LoadingTitle = styled.h1`
  font-size: 4rem;
  color: #fff;
  margin-bottom: 30px;
`;

const Spinner = styled.div`
  width: 120px;
  height: 120px;
  border: 16px solid #f3f3f3;
  border-top: 16px solid #FACD66;
  border-radius: 50%;
  animation: ${spin} 1.5s linear infinite;
  margin-bottom: 20px;
`;

const LoadingTime = styled.p`
  color: #aaa;
  font-size: 1rem;
`;
