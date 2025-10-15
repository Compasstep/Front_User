import styled from 'styled-components'; // 1. styled-components import
import { useNavigate } from 'react-router-dom'; // 1. useNavigate import
import useUserStore from '../../store/userStore';

function Login() {
  const { login } = useUserStore();
  const navigate = useNavigate(); // 2. navigate 함수 초기화

  const handleLogin = () => {
    login(); // Zustand 상태를 true로 변경

    // 3. 1.1초 후에 마이페이지로 이동
    // (Zustand의 setTimeout이 1초이므로, 그보다 약간 길게 설정)
    setTimeout(() => {
      navigate('/'); 
    }, 1100);
  };
  
  return (
    <LoginContainer>
      <Title>Commmpassstep</Title>
      <Subtitle>로그인</Subtitle>
      <GoogleLoginButton onClick={handleLogin}>
        G Continue with Google
      </GoogleLoginButton>
    </LoginContainer>
  );
}


// --- 여기부터는 styled-components 코드 (이전과 동일) ---

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px); /* 전체 높이에서 헤더 높이(대략 80px)를 뺌 */
  text-align: center;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Subtitle = styled.h2`
  font-size: 24px;
  margin-bottom: 40px;
`;

const GoogleLoginButton = styled.button`
  background-color: #4285F4; /* 구글 브랜드 색상 */
  color: white;
  font-size: 18px;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px; /* 로고와 텍스트 사이 간격 */

  &:hover {
    background-color: #357ae8;
  }
`;

export default Login;