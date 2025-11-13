// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle.jsx';
import Layout from './components/Layout.jsx';
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

function App() {
  return (
    <>
      <GlobalStyle />

      <Routes>
        {/* 🔹 로그인 페이지는 Header/SideNav 없는 독립 페이지 */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 리뷰 공유 페이지도 독립 렌더링 */}
        <Route path="/review/:reviewId" element={<PeerReview />} />

        {/* 🔹 나머지 모든 페이지는 Layout에 포함됨 */}
        <Route element={<Layout />}>

          {/* 공개 라우트 */}
          <Route path="/" element={<Home />} />

          {/* 보호 라우트 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/account/withdraw" element={<Withdraw />} />

            <Route path="/analysis/reputation" element={<Released />} />
            <Route path="/analysis/reputation/result" element={<ReputationResult />} />
            <Route path="/analysis/lyrics" element={<Lyrics />} />

            <Route path="/analysis/unreleased" element={<Unreleased />} />
            <Route path="/analysis/unreleased/result" element={<UnreleasedResult />} />
            <Route
              path="/analysis/unreleased/result/:shareId"
              element={<UnreleasedAnalysisResult />}
            />

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
