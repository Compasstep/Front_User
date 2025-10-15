// src/components/Header.jsx

import styled, { css } from 'styled-components'; // css import 추가
import { Link, useLocation } from 'react-router-dom';
import useUserStore from '../store/userStore.js';

function Header() {
  const { isLoggedIn, logout, user, toggleNav } = useUserStore();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  // 배경이 헤더 덮게
  const isOverlayPage = 
    location.pathname === '/discovery/keyword' || 
    location.pathname === '/analysis/reputation';


  return (
    // isSearchPage 값에 따라 다른 스타일을 적용하기 위해 prop 전달
    <HeaderContainer $isOverlay={isOverlayPage}>
      {isHomePage ? (
        <Logo to="/">
          <img src="/logo_name.png" alt="Compassstep Logo" />
        </Logo>
      ) : (
        <SmallLogo to="/">
          <img src="/logo.png" alt="Compassstep Small Logo" />
        </SmallLogo>
      )}

      <NavIcons>
        {isHomePage && (
          <>
            {isLoggedIn ? (
              <>
                <UserLink to="/mypage">{user.name}님</UserLink>
                <LogoutButton onClick={logout}>로그아웃</LogoutButton>
              </>
            ) : (
              <LoginLink to="/login">로그인</LoginLink>
            )}
          </>
        )}
        <HamburgerButton onClick={toggleNav}>☰</HamburgerButton>
      </NavIcons>
    </HeaderContainer>
  );
}

// --- styled-components ---

const HeaderContainer = styled.header`
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  background-color: #1D2123;
  position: relative;
  z-index: 100;

  /* ✨ isSearchPage가 true일 때만 아래 스타일을 덧붙입니다. */
  ${(props) =>
    props.$isOverlay &&
    css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background-color: transparent;
      border-bottom: none;
    `}
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  img {
    height: 150px;
    width: auto;
    margin-top: 56px;
  }
`;

const SmallLogo = styled(Link)`
  display: flex;
  align-items: center;
  img {
    height: 50px;
    width: auto;
  }
`;

const NavIcons = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const UserLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  &:hover {
    color: #FACD66;
  }
`;

const LoginLink = styled(Link)`
  color: #fff;
  text-decoration: none;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

export default Header;