// src/components/Header.jsx

import styled, { css } from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore.js';

function Header() {
  const navigate = useNavigate();

  const { isLoggedIn, logout, user, toggleNav } = useUserStore();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  // '/discovery/keyword*', '/analysis/reputation*' 구간 투명 헤더
  const isOverlayPage =
    location.pathname.startsWith('/discovery/keyword') ||
    location.pathname.startsWith('/analysis/reputation');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // 아바타 url(스토어 키가 photoUrl/avatarUrl 혼재할 수 있어 양쪽 지원)
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
        {isHomePage && (
          <>
            {isLoggedIn ? (
              <>
                {/* ✅ 추가: 프로필 아바타 버튼 (이름 왼쪽) */}
                <AvatarButton
                  type="button"
                  onClick={() => navigate('/profile/edit')}
                  title="프로필 수정"
                  aria-label="프로필 수정"
                >
                  {avatarUrl ? (
                    <AvatarImg src={avatarUrl} alt={`${displayName} 프로필 사진`} />
                  ) : (
                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                  )}
                </AvatarButton>

                <UserLink to="/mypage">
                  {user?.name ? `${user.name}님` : '마이페이지'}
                </UserLink>
                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
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

// --- styled-components (기존 유지 + 아바타만 추가) ---

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

/* ✅ 추가: 아바타 스타일 */
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

  /* 이름과의 시각적 간격을 자연스럽게 */
  margin-right: -6px; /* 기존 gap(20px) 구조에 살짝 붙여 보이도록 */
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; /* 원 안에 꽉 차게 */
`;

const AvatarFallback = styled.span`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #111;
  background: #facd66;
  font-weight: 800;
  font-size: 14px;
  text-transform: uppercase;
  border-radius: 50%;
`;

const UserLink = styled(Link)`
  color: #fff;
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
`;

const HamburgerButton = styled.button`
  background: none;
  margin-top: -6px;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

export default Header;
