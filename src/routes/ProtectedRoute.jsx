// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useUserStore from '../store/userStore';

/**
 * 인증이 필요한 라우트를 보호합니다.
 * - 로컬 상태 복원(hydrated)과 세션 체크(authChecked)가 끝날 때까지는 로딩만 표시합니다.
 * - 세션이 유효하면 통과, 아니면 /login 으로 리다이렉트합니다.
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const { isLoggedIn, hydrated, authChecked, bootstrapAuth } = useUserStore((s) => ({
    isLoggedIn: s.isLoggedIn,
    hydrated: s.hydrated,
    authChecked: s.authChecked,
    bootstrapAuth: s.bootstrapAuth,
  }));

  // 스토어가 복원되면 세션 핑을 딱 1회 수행
  useEffect(() => {
    if (!hydrated) return;
    if (!authChecked) bootstrapAuth();
  }, [hydrated, authChecked, bootstrapAuth]);

  // 아직 판단 불가 → 로딩만
  if (!hydrated || !authChecked) {
    return <Guard><span>세션 확인 중…</span></Guard>;
  }

  // 최종 판단
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}

const Guard = styled.div`
  min-height: 50vh;
  display: grid;
  place-items: center;
  color: #9aa2a9;
  font-size: 14px;
`;
