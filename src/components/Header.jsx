// src/components/Header.jsx

import styled, { css } from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore.js';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user, toggleNav } = useUserStore();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isOverlayPage =
    location.pathname.startsWith('/discovery/keyword') ||
    location.pathname.startsWith('/analysis/reputation');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const avatarUrl = user?.avatarUrl || user?.photoUrl || '';
  const displayName = user?.name || '사용자';

  return (
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
        {isHomePage &&
          (isLoggedIn ? (
            <>
              {/* 아바타 클릭하면 프로필 수정 */}
              <AvatarButton type="button" onClick={() => navigate('/profile/edit')}>
                {avatarUrl ? (
                  <AvatarImg src={avatarUrl} alt="프로필" />
                ) : (
                  <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                )}
              </AvatarButton>

              {/* 🔥 유저명은 더 이상 링크 X */}
              <UserName>{displayName}님</UserName>

              {/* 🔥 새로 만든 MY PAGE 버튼 */}
              <MyPageButton to="/mypage">MY PAGE</MyPageButton>

              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </>
          ) : (
            <LoginLink to="/login">로그인</LoginLink>
          ))}

        {/* 햄버거 메뉴 */}
        <HamburgerButton onClick={toggleNav}>☰</HamburgerButton>
      </NavIcons>
    </HeaderContainer>
  );
}

export default Header;

/* ---------------- styles ---------------- */

const HeaderContainer = styled.header`
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  background-color: #1d2123;
  position: relative;
  z-index: 100;

  ${(props) =>
    props.$isOverlay &&
    css`
      position: absolute;
      top: 0;
      width: 100%;
      background-color: transparent;
    `}
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;

  img {
    height: 150px;
    margin-top: 56px;
  }
`;

const SmallLogo = styled(Link)`
  display: flex;
  align-items: center;

  img {
    height: 50px;
  }
`;

const NavIcons = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const AvatarButton = styled.button`
  width: 32px;
  height: 32px;
  border: 0;
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background: #2a2f32;
  display: grid;
  place-items: center;
  margin-right: -6px;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.span`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #facd66;
  color: #111;
  font-weight: 800;
  border-radius: 50%;
  font-size: 14px;
`;

const UserName = styled.span`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
`;

const MyPageButton = styled(Link)`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #facd66;
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
  font-weight: 500;

  &:hover {
    color: #facd66;
  }
`;

const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 27px;
  cursor: pointer;
  margin-top: -7px;
  padding: 0;

  &:hover {
    color: #facd66;
  }
`;
