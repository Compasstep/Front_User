// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle.jsx';
import Layout from './components/Layout.jsx';
import SideNav from './components/SideNav.jsx';         // ⬅️ 추가
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Lyrics from './pages/Lyrics.jsx';
import Login from './pages/user/Login.jsx';
import MyPage from './pages/user/MyPage.jsx';
import ProfileEditPage from './pages/user/ProfileEditPage.jsx';
import Released from './pages/reputation/Released.jsx';
import Unreleased from './pages/reputation/Unreleased.jsx';
import KeywordSearch from './pages/discovery/KeywordSearch.jsx';
import Rankings from './pages/discovery/Rankings.jsx';
import KeywordSearchResults from './pages/discovery/KeywordSearchResults.jsx';
import UnreleasedResult from './pages/reputation/UnreleasedResult.jsx';
import PeerReview from './pages/reputation/PeerReview.jsx';
import ReputationResult from './pages/reputation/ReputationResult.jsx';
import Withdraw from './pages/user/withdraw.jsx';
import UnreleasedAnalysisResult from './pages/reputation/UnreleasedAnalysisResult.jsx';

// ⬇️ Layout을 감싸서 SideNav를 전역 마운트
function LayoutWithSideNav() {
  return (
    <>
      <Layout />       {/* 기존 레이아웃(헤더+Outlet 포함) */}
      <SideNav />      {/* 사이드 내비 항상 렌더 */}
    </>
  );
}

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        {/* 헤더/사이드바가 없는 독립 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/review/:reviewId" element={<PeerReview />} />

        {/* 헤더/사이드바가 있는 나머지 페이지 */}
        <Route element={<LayoutWithSideNav />}>
          {/* 공개 라우트 */}
          <Route path="/" element={<Home />} />

          {/* 보호 라우트 그룹 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/account/withdraw" element={<Withdraw />} />

            <Route path="/analysis/reputation" element={<Released />} />
            <Route path="/analysis/reputation/result" element={<ReputationResult />} />
            <Route path="/analysis/lyrics" element={<Lyrics />} />

            <Route path="/analysis/unreleased" element={<Unreleased />} />
            <Route path="/analysis/unreleased/result" element={<UnreleasedResult />} />
            <Route path="/analysis/unreleased/result/:shareId" element={<UnreleasedAnalysisResult />} />

            <Route path="/discovery/keyword" element={<KeywordSearch />} />
            <Route path="/discovery/keyword/results" element={<KeywordSearchResults />} />

            <Route path="/rankings" element={<Rankings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
