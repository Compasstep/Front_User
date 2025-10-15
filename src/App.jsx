import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// --- 최종 파일 구조에 맞게 경로와 이름을 모두 수정했습니다 ---
import Home from './pages/Home.jsx';
import Lyrics from './pages/Lyrics.jsx'; // `reputation` 폴더에서 `pages` 폴더로 이동
import Login from './pages/user/Login.jsx';
import MyPage from './pages/user/MyPage.jsx';
import ProfileEditPage from './pages/user/ProfileEditPage.jsx'; // 파일 이름 유지
import Released from './pages/reputation/Released.jsx'; // Reputation.jsx -> Released.jsx 로 변경
import Unreleased from './pages/reputation/Unreleased.jsx';
import KeywordSearch from './pages/discovery/KeywordSearch.jsx';
import Rankings from './pages/discovery/Rankings.jsx';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<Layout />}>
          {/* --- 누구나 접근 가능한 페이지 --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* --- 로그인이 필요한 페이지 (element도 새 이름으로 수정) --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/analysis/reputation" element={<Released />} />
            <Route path="/analysis/lyrics" element={<Lyrics />} />
            <Route path="/analysis/unreleased" element={<Unreleased />} />
            <Route path="/discovery/keyword" element={<KeywordSearch />} />
            <Route path="/rankings" element={<Rankings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;