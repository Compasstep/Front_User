// src/components/Layout.jsx

import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import SideNav from './SideNav.jsx';
import styled from 'styled-components';
import { useEffect } from 'react';
import useUserStore from '../store/userStore.js';

function Layout() {
  const location = useLocation();

  const bootstrapAuth = useUserStore((s) => s.bootstrapAuth);

  // 🔥 앱이 Layout을 로드할 때마다 user 최신화
  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const isSpecialLayout =
    location.pathname === '/' ||
    location.pathname === '/discovery/keyword' ||
    location.pathname === '/analysis/reputation';

  const hideSideNav = location.pathname === '/login';

  return (
    <Wrapper>
      <Header />

      {!hideSideNav && <SideNav />}

      <MainContent $isSpecial={isSpecialLayout}>
        <Outlet />
      </MainContent>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;  /* ⭐ Scroll 정상작동을 위한 핵심 수정 */
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: ${(props) => (props.$isSpecial ? '0' : '50px')};
`;

export default Layout;
