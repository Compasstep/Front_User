import { useState, useEffect } from 'react';
import styled from 'styled-components';

// onSearch: 검색 실행 함수
// initialValue: 검색창에 표시될 초기 키워드
function SearchBar({ onSearch, initialValue = '' }) {
  const [keyword, setKeyword] = useState(initialValue);

  // initialValue prop이 바뀔 때마다 내부 상태도 업데이트
  useEffect(() => {
    setKeyword(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    onSearch(keyword);
  };

  return (
    <InputGroup>
      <SearchInput
        type="text"
        placeholder="#슬픔 #기쁨 #설렘 #분노 #감동"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <SearchButton onClick={handleSearch}>→</SearchButton>
    </InputGroup>
  );
}

// --- styled-components ---

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(40, 40, 40, 0.8);
  border-radius: 50px;
  padding: 10px 15px 10px 25px;
  backdrop-filter: blur(5px);
  transition: box-shadow 0.3s ease-in-out;
  width: 100%;
  max-width: 550px; /* 최대 너비 지정 */

  &:focus-within {
    box-shadow: 0 0 0 2px #FACD66;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  width: 100%; /* 부모 너비에 맞게 꽉 채움 */
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
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #FACD66;
  }
`;

export default SearchBar;