import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* 브라우저의 기본 스타일을 초기화합니다. */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #1D2123; /* 요청하신 배경색 */
    color: #ffffff; /* 기본 글자색 (오타 수정) */
    font-family: 'Quicksand', sans-serif; /* 기본 텍스트 폰트 */
  }

  /* 제목 태그(h1, h2 등)들은 Anton 폰트를 사용하도록 설정 */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Anton', sans-serif;
  }

  /* 나머지 스타일들 */
  a {
    color: inherit; /* 링크 색상을 부모 요소와 동일하게 */
    text-decoration: none; /* 링크 밑줄 제거 */
  }

  button {
    font-family: inherit; /* 버튼도 기본 폰트를 따르도록 설정 */
  }
`;

export default GlobalStyle;