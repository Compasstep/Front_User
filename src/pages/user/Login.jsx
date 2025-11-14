// src/pages/user/Login.jsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import useUserStore from '../../store/userStore';
import api from '../../api/client';

function Login() {
  const navigate = useNavigate();
  const { setLoginState } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const btnMountedRef = useRef(false);

  const LOGIN_URL = '/user/auth/login';

  const handleLoginWithGoogleToken = useCallback(
    async (googleIdToken) => {
      if (loading) return;

      setLoading(true);
      setErrorMsg('');

      try {
        const res = await api.post(
          LOGIN_URL,
          {
            googleToken: googleIdToken,
            idToken: googleIdToken,
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const data = res?.data || {};

        const csrfToken =
          data?.result?.csrfToken ||
          data?.csrfToken ||
          null;

        const user =
          data?.result?.user ||
          data?.user ||
          null;

        setLoginState({
          isLoggedIn: true,
          user,
          csrfToken,     // ★ 프론트는 이거만 관리
        });

        navigate('/');
      } catch (err) {
        console.error('[LOGIN ERROR]', err);
        setErrorMsg(err?.response?.data?.message || '로그인에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [loading, navigate, setLoginState]
  );

  // ========= Google OAuth 초기화 =========
  useEffect(() => {
    const CLIENT_ID =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      document
        .querySelector('meta[name="google-signin-client_id"]')
        ?.getAttribute('content') ||
      '';

    function initGoogle() {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: ({ credential }) =>
          credential
            ? handleLoginWithGoogleToken(credential)
            : setErrorMsg('구글 토큰을 받지 못했습니다.'),
      });

      const btnDiv = document.getElementById('googleBtnContainer');
      if (btnDiv && !btnMountedRef.current) {
        btnDiv.innerHTML = '';
        window.google.accounts.id.renderButton(btnDiv, {
          theme: 'filled_blue',
          size: 'large',
          text: 'continue_with',
          width: 260,
        });
        btnMountedRef.current = true;
      }
    }

    if (window.google?.accounts?.id) initGoogle();
    else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  }, [handleLoginWithGoogleToken]);

  return (
    <LoginContainer>
      <Title>Compassstep</Title>
      <Subtitle>로그인</Subtitle>
      <GoogleLoginBox>
        {loading ? '로그인 중...' : <div id="googleBtnContainer" />}
      </GoogleLoginBox>
      {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
    </LoginContainer>
  );
}

/* =====================================
   Styled Components
===================================== */

const LoginContainer = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  height: calc(100vh - 80px);
  text-align:center;
`;

const Title = styled.h1`
  font-size:48px;
  font-weight:bold;
  margin-bottom:10px;
`;

const Subtitle = styled.h2`
  font-size:24px;
  margin-bottom:40px;
`;

const GoogleLoginBox = styled.div`
  background-color:#1a73e8;
  color:#fff;
  font-size:18px;
  padding:15px 30px;
  border-radius:8px;
  min-height:54px;
  width:260px;
  display:flex;
  align-items:center;
  justify-content:center;
`;

const ErrorText = styled.p`
  color:red;
  margin-top:20px;
`;

export default Login;
