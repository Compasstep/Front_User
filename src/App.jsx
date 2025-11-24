// src/App.jsx

import { Routes, Route } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

/* ---------------- Toast Provider ---------------- */
import { ToastProvider } from "./context/ToastContext";

/* ---------------- 페이지 import ---------------- */
import Home from "./pages/Home.jsx";
import Lyrics from "./pages/reputation/Lyrics.jsx";
import LyricsResult from "./pages/reputation/LyricsResult.jsx";

import Login from "./pages/user/Login.jsx";
import MyPage from "./pages/user/MyPage.jsx";
import ProfileEditPage from "./pages/user/ProfileEditPage.jsx";
import Withdraw from "./pages/user/Withdraw.jsx";

/* --- 발매곡 평판 --- */
import Released from "./pages/reputation/Released.jsx";
import ReputationResult from "./pages/reputation/ReputationResult.jsx";

/* --- 미발매곡 평판 --- */
import Unreleased from "./pages/reputation/Unreleased.jsx";
import UnreleasedResult from "./pages/reputation/UnreleasedResult.jsx";
import UnreleasedAnalysisResult from "./pages/reputation/UnreleasedAnalysisResult.jsx";

/* --- Discovery --- */
import KeywordSearch from "./pages/discovery/KeywordSearch.jsx";
import KeywordSearchResults from "./pages/discovery/KeywordSearchResults.jsx";
import Rankings from "./pages/discovery/Rankings.jsx";

/** --- 지인평가 --- */
import PeerReview from "./pages/reputation/PeerReview.jsx";

function App() {
  return (
    <ToastProvider>
      <GlobalStyle />

      <Routes>
        {/* ----------------------- 로그인 ----------------------- */}
        <Route path="/login" element={<Login />} />

        {/* ----------------------- 공유 리뷰 (비로그인 허용) ----------------------- */}
        <Route path="/review/:reviewId" element={<PeerReview />} />

        {/* ------------------------ 공통 레이아웃 ------------------------ */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* ------------------------ 🔒 보호 라우팅 ------------------------ */}
          <Route element={<ProtectedRoute />}>
            {/* ---------------- 마이페이지 ---------------- */}
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/account/withdraw" element={<Withdraw />} />

            {/* ---------------- 발매곡 평판 ---------------- */}
            <Route path="/analysis/reputation" element={<Released />} />
            <Route
              path="/reputation/analysis/:historyId"
              element={<ReputationResult />}
            />
            <Route
              path="/analysis/reputation/result"
              element={<ReputationResult />}
            />

            {/* ---------------- 가사 분석 결과 (먼저 배치!) ---------------- */}
            <Route
              path="/analysis/lyrics/result/:lyricsId"
              element={<LyricsResult />}
            />

            {/* ---------------- 가사 업로드/분석 ---------------- */}
            <Route path="/analysis/lyrics" element={<Lyrics />} />

            {/* ---------------- 미발매곡 ---------------- */}
            <Route path="/analysis/unreleased" element={<Unreleased />} />
            <Route
              path="/analysis/unreleased/result"
              element={<UnreleasedResult />}
            />
            <Route
              path="/analysis/unreleased/result/:shareId"
              element={<UnreleasedAnalysisResult />}
            />

            {/* ---------------- Discovery ---------------- */}
            <Route path="/discovery/keyword" element={<KeywordSearch />} />
            <Route
              path="/discovery/keyword/results"
              element={<KeywordSearchResults />}
            />
            <Route path="/rankings" element={<Rankings />} />
          </Route>
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;