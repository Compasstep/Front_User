// src/components/SideNav.jsx

import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import useUserStore from '../store/userStore.js';

function SideNav() {
  const { isNavOpen, toggleNav } = useUserStore();
  const [openMenu, setOpenMenu] = useState(null);

  const handleMenuClick = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <>
      <NavOverlay isOpen={isNavOpen} onClick={toggleNav} />
      <NavContainer isOpen={isNavOpen}>
        {/* --- 1. 창작 레퍼런스 탐색 (펼침 기능만 있는 div) --- */}
        <MenuWrapper>
          <MainMenu onClick={() => handleMenuClick('creative')}>
            창작 레퍼런스 탐색
          </MainMenu>
          {openMenu === 'creative' && (
            <SubMenuWrapper>
              <SubMenu to="/discovery/keyword" onClick={toggleNav}>키워드 기반 노래 탐색</SubMenu>
              <SubMenu to="/rankings" onClick={toggleNav}>최신곡 장르별 랭킹</SubMenu>
            </SubMenuWrapper>
          )}
        </MenuWrapper>

        {/* --- 2. 노래 평판 확인 (펼침 기능만 있는 div) --- */}
        <MenuWrapper>
          <MainMenu onClick={() => handleMenuClick('reputation')}>
            노래 평판 확인
          </MainMenu>
          {openMenu === 'reputation' && (
            <SubMenuWrapper>
              <SubMenu to="/analysis/reputation" onClick={toggleNav}>발매곡 평판 분석</SubMenu>
              <SubMenu to="/analysis/unreleased" onClick={toggleNav}>미발매곡 평판 분석</SubMenu>
            </SubMenuWrapper>
          )}
        </MenuWrapper>

        {/* --- 3. 가사 감정 분석 (페이지로 바로 이동하는 Link) --- */}
        <MainMenuLink to="/analysis/lyrics" onClick={toggleNav}>
          가사 감정 분석
        </MainMenuLink>

      </NavContainer>
    </>
  );
}

// --- styled-components ---

const NavOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  z-index: 899;
`;

const NavContainer = styled.nav`
  position: fixed; top: 0;
  right: ${(props) => (props.isOpen ? '0' : '-300px')};
  width: 300px; height: 100vh;
  background-color: #1a1e20;
  padding: 80px 20px;
  transition: right 0.3s ease-in-out;
  z-index: 900;
  display: flex; flex-direction: column; gap: 15px;
`;

const MenuWrapper = styled.div``;

const mainMenuStyles = css`
  color: #fff; font-size: 20px; font-family: 'Quicksand', sans-serif;
  cursor: pointer; padding: 10px 5px; font-weight: bold;
  text-decoration: none; display: block;
  &:hover { color: #FACD66; }
`;

// 소메뉴가 있는 메인메뉴 (클릭 가능한 div)
const MainMenu = styled.div`
  ${mainMenuStyles}
`;

// 소메뉴가 없는 메인메뉴 (클릭 가능한 Link)
const MainMenuLink = styled(Link)`
  ${mainMenuStyles}
`;

const SubMenuWrapper = styled.div`
  padding-left: 15px; margin-top: 10px;
  display: flex; flex-direction: column; gap: 15px;
  border-left: 2px solid #333;
`;

const SubMenu = styled(Link)`
  color: #aaa; text-decoration: none; font-size: 16px;
  font-family: 'Quicksand', sans-serif;
  &:hover { color: #fff; }
`;

export default SideNav;