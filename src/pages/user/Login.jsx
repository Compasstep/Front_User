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

  const handleLoginWithGoogleToken = useCallback(async (googleIdToken) => {
    if (loading) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/user/auth/login', { googleToken: googleIdToken }, {
        headers: { 'Content-Type': 'application/json' },
      });

      // 캡처 기준 응답: { code: 200, message: "성공입니다.", result: { csrfToken: "..." } }
      const data = res?.data || {};
      const csrfToken =
        data?.result?.csrfToken ||
        data?.csrfToken ||
        null;

      if (csrfToken) {
        sessionStorage.setItem('csrfToken', csrfToken);
        localStorage.setItem('csrfToken', csrfToken);
      }

      // (옵션) 바디에 토큰이 있을 때만 저장
      const accessToken =
        data?.result?.accessToken || data?.accessToken || null;
      const refreshToken =
        data?.result?.refreshToken || data?.refreshToken || null;

      setLoginState({ isLoggedIn: true, csrfToken, accessToken, refreshToken });
      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [loading, navigate, setLoginState]);

  useEffect(() => {
    const CLIENT_ID =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      document.querySelector('meta[name="google-signin-client_id"]')?.getAttribute('content') ||
      '';

    function initGoogle() {
      if (!window.google?.accounts?.id) return;
      if (!CLIENT_ID) { setErrorMsg('Google client_id가 설정되지 않았습니다.'); return; }

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: ({ credential }) => {
          if (!credential) { setErrorMsg('구글 토큰을 받지 못했습니다.'); return; }
          handleLoginWithGoogleToken(credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      const btnDiv = document.getElementById('googleBtnContainer');
      if (btnDiv && !btnMountedRef.current) {
        btnDiv.innerHTML = '';
        window.google.accounts.id.renderButton(btnDiv, {
          theme: 'filled_blue',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
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

    return () => {
      try { window.google?.accounts?.id?.cancel(); } catch {}
      btnMountedRef.current = false;
    };
  }, [handleLoginWithGoogleToken]);

  return (
    <LoginContainer>
      <Title>Compassstep</Title>
      <Subtitle>로그인</Subtitle>
      <GoogleLoginBox aria-live="polite">
        {loading ? '로그인 중...' : <div id="googleBtnContainer" />}
      </GoogleLoginBox>
      {errorMsg && <p style={{ color: 'red', marginTop: 20, fontSize: 14 }}>{errorMsg}</p>}
    </LoginContainer>
  );
}

/* styles */
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
  border:none;
  border-radius:8px;
  display:flex;
  align-items:center;
  gap:10px;
  min-height:54px;
  &:hover{ background-color:#1a73e8; }
`;

export default Login;
