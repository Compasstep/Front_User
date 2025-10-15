// src/components/Layout.jsx

import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import SideNav from './SideNav.jsx';
import styled from 'styled-components';

function Layout() {
  const location = useLocation();
  const isSpecialLayout = 
    location.pathname === '/' || 
    location.pathname === '/discovery/keyword' ||
    location.pathname === '/analysis/reputation';

  return (
    <div>
      <Header />
      <SideNav />
      <MainContent $isSpecial={isSpecialLayout}>
        <Outlet />
      </MainContent>
    </div>
  );
}

const MainContent = styled.main`
  padding-top: ${(props) => (props.$isSpecial ? '0' : '50px')};
`;

export default Layout;