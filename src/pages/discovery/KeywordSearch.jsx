// src/pages/discovery/KeywordSearch.jsx

import { useState } from 'react';
import styled, { keyframes } from 'styled-components'; // keyframes import 추가

function KeywordSearch() {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (!keyword) {
      alert('키워드를 입력해주세요.');
      return;
    }
    alert(`'${keyword}' 키워드로 탐색을 시작합니다.`);
  };

  return (
    <Container>
      <Content>
        <Title>키워드를 입력하고 인사이트를 확인하세요</Title>
        <SearchWrapper>
          <DecorativeImage src="/keyword.png" alt="decorative" />
          <InputGroup>
            <SearchInput
              type="text"
              placeholder="#슬픔 #기쁨 #설렘 #분노 #감동"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>→</SearchButton>
          </InputGroup>
        </SearchWrapper>
      </Content>
    </Container>
  );
}

// --- styled-components ---

// ✨ 애니메이션 효과 정의
const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  /* ✨ 배경 스타일을 새 이미지로 교체하고, 화면 전체를 덮도록 설정 */
  background-image: url('/background.png'); /* public 폴더에 저장한 파일명으로 변경 */
  background-size: cover;
  background-position: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  font-family: 'Quicksand', sans-serif;
  color: #FACD66;
  font-size: 30px;
  margin-bottom: 40px;
  animation: ${fadeInDown} 0.8s ease-out; /* ✨ 등장 애니메이션 적용 */
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  animation: ${fadeInUp} 0.8s ease-out; /* ✨ 등장 애니메이션 적용 */
`;

const DecorativeImage = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 24px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out; /* ✨ 부드러운 전환 효과 */

  &:hover {
    transform: scale(1.05); /* ✨ 마우스 올리면 살짝 확대 */
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(40, 40, 40, 0.8);
  border-radius: 50px;
  padding: 10px 15px 10px 25px;
  backdrop-filter: blur(5px);
  transition: box-shadow 0.3s ease-in-out; /* ✨ 부드러운 전환 효과 */

  /* ✨ 검색창(input)에 포커스가 되면 테두리 강조 */
  &:focus-within {
    box-shadow: 0 0 0 2px #FACD66;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  width: 450px;
  outline: none;

  &::placeholder {
    color: #888;
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  padding-left: 15px;
  transition: color 0.3s ease-in-out; /* ✨ 부드러운 전환 효과 */

  &:hover {
    color: #FACD66; /* ✨ 마우스 올리면 색상 변경 */
  }
`;

export default KeywordSearch;