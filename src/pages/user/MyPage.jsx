// src/pages/user/MyPage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore.js";
import api from "../../api/client";
import axios from "axios";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { showToast } from "../../utils/globalToast";

const asArray = (v) => (Array.isArray(v) ? v : []);
const asBool = (v) => v === true || v === "true";

function isCanceled(e) {
  return (
    axios.isCancel?.(e) ||
    e?.code === "ERR_CANCELED" ||
    e?.message === "canceled" ||
    e?.name === "CanceledError" ||
    e?.cause?.name === "CanceledError"
  );
}

function MyPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserStore();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const confirmDelete = (action) => {
    setConfirmMessage("정말 삭제하시겠습니까?");
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const displayName = useMemo(
    () => (user?.nickname || user?.name || "사용자").trim(),
    [user]
  );

  const [repList, setRepList] = useState([]);
  const [peerList, setPeerList] = useState([]);
  const [lyricsList, setLyricsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const normReputation = useCallback(
    (rows) =>
      asArray(rows).map((r) => ({
        id: r.id ?? r.historyId,
        title: r.title ?? r.songTitle ?? "제목 없음",
        artist: r.artist ?? r.artistName ?? "",
      })),
    []
  );

  const normPeer = useCallback(
    (rows) =>
      asArray(rows).map((r) => ({
        id: r.id ?? r.postId,
        title: r.songTitle || "파일명 없음",
        analyzed:
          r.analyzed ??
          r.isAnalyzed ??
          (r.status === "COMPLETED" || r.analysisStatus === "COMPLETED"),
      })),
    []
  );

    const normLyrics = useCallback(
    (rows) =>
      asArray(rows).map((r) => ({
        id: r.lyricsAnalysisId,
        title: r.lyricsTitle ?? "제목 없음",
        createdAt: r.createdAt,
      })),
    []
  );


  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const settled = await Promise.allSettled([
          api.get("/user/mypage/reputation-history", { signal: ctrl.signal }),
          api.get("/user/mypage/posts/me", { signal: ctrl.signal }),
          api.get("/user/mypage/lyrics-analyses", { signal: ctrl.signal }),
        ]);

        if (!alive) return;

        const pick = (i) =>
          settled[i].status === "fulfilled" ? settled[i].value : null;

        const repRes = pick(0);
        const peerRes = pick(1);
        const lyricsRes = pick(2);

        if (repRes) setRepList(normReputation(repRes?.data?.result ?? []));
        if (peerRes) setPeerList(normPeer(peerRes?.data?.result ?? []));
        if (lyricsRes) setLyricsList(normLyrics(lyricsRes?.data?.result?.analyses ?? []));


        const errors = settled
          .filter((s) => s.status === "rejected")
          .map((s) => s.reason)
          .filter((e) => !isCanceled(e));

        if (errors.length > 0) {
          const first = errors[0];
          if (first?.status === 401) {
            navigate("/login", { replace: true, state: { from: "/mypage" } });
            return;
          }
          showToast("마이페이지 일부 데이터를 불러오지 못했습니다.");
        }
      } catch (e) {
        if (!isCanceled(e)) {
          showToast("마이페이지 데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ctrl.abort();
    };
  }, [isLoggedIn, normLyrics, normPeer, normReputation, navigate]);

  /* ----------------------- 버튼 핸들러 ----------------------- */

  const handleReputationClick = async (row) => {
    try {
      const res = await api.get(`/user/mypage/reputation-history/${row.id}`);
      navigate(`/reputation/analysis/${row.id}`, {
        state: { summary: res?.data?.result },
      });
    } catch {
      showToast("분석 데이터를 불러올 수 없습니다.");
    }
  };

  const handlePeerReviewView = (row) => {
    navigate(`/review/${row.id}`);
  };

  const handlePeerReviewAnalysis = async (row) => {
    try {
      const res = await api.get(`/user/mypage/posts/${row.id}/analysis`);
      navigate(`/analysis/unreleased/result/${row.id}`, {
        state: { summary: res.data.result },
      });
    } catch {
      showToast("아직 분석 결과가 없습니다.");
    }
  };

  const deletePeerPost = (row) => {
    confirmDelete(async () => {
      await api.delete(`/user/mypage/posts/${row.id}`);
      setPeerList((prev) => prev.filter((x) => x.id !== row.id));
    });
  };

  const deleteReputation = (row) => {
    confirmDelete(async () => {
      await api.delete(`/user/mypage/reputation-history/${row.id}`);
      setRepList((prev) => prev.filter((x) => x.id !== row.id));
    });
  };

  const deleteLyrics = (row) => {
    confirmDelete(async () => {
      await api.delete(`/user/mypage/lyrics-analyses/${row.id}`);
      setLyricsList((prev) => prev.filter((x) => x.id !== row.id));
    });
  };

  return (
    <MyPageContainer>
      <ConfirmModal
        open={confirmOpen}
        message={confirmMessage}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          confirmAction();
          setConfirmOpen(false);
        }}
      />

      <TitleRow>
        <TitleLeft>
          <PageTitle>MY PAGE</PageTitle>
          <Greeting>{displayName}님 환영합니다</Greeting>
        </TitleLeft>

        <RightActions>
          <HeaderLink to="/profile/edit">프로필 수정</HeaderLink>
          <HeaderLink to="/account/withdraw">탈퇴하기</HeaderLink>
        </RightActions>
      </TitleRow>

      {/* ------------------------- 발매곡 ------------------------- */}
      <CardsRow>
        <Card>
          <CardHeader>발매곡 평판 조회</CardHeader>
          <List>
            {repList.length === 0 && <Sub>기록이 없습니다.</Sub>}

            {repList.map((row) => (
              <ListItem key={row.id}>
                <ItemText>
                  <strong>{row.title}</strong>
                  <Sub>{row.artist}</Sub>
                </ItemText>

                <BtnGroup>
                  <GhostButton onClick={() => handleReputationClick(row)}>
                    보기
                  </GhostButton>
                  <GhostButton onClick={() => deleteReputation(row)}>
                    삭제
                  </GhostButton>
                </BtnGroup>
              </ListItem>
            ))}
          </List>
        </Card>

        {/* ------------------------- 지인 평가 ------------------------- */}
        <Card>
          <CardHeader>미발매곡 평판 조회</CardHeader>
          <List>
            {peerList.length === 0 && <Sub>작성한 게시글이 없습니다.</Sub>}

            {peerList.map((row) => (
              <ListItem key={row.id}>
                <ItemText>
                  <strong>{row.title}</strong>
                </ItemText>

                <BtnGroup>
                  <GhostButton onClick={() => handlePeerReviewView(row)}>
                    지인 평판 확인
                  </GhostButton>

                  <GhostButton onClick={() => handlePeerReviewAnalysis(row)}>
                    분석
                  </GhostButton>

                  <GhostButton onClick={() => deletePeerPost(row)}>
                    삭제
                  </GhostButton>
                </BtnGroup>
              </ListItem>
            ))}
          </List>
        </Card>
      </CardsRow>

      {/* ------------------------- 가사 ------------------------- */}
      <CardsRow>
        <Card>
          <CardHeader>가사 감정 분석</CardHeader>
          <List>
            {lyricsList.length === 0 && <Sub>분석 내역이 없습니다.</Sub>}

            {lyricsList.map((row) => (
              <ListItem key={row.id}>
                <ItemText>
                  <strong>{row.title}</strong>
                  <Sub>{row.artist}</Sub>
                </ItemText>

                <BtnGroup>
                  <GhostButton onClick={() => navigate(`/analysis/lyrics/result/${row.id}`)}>
                    보기
                  </GhostButton>
                  <GhostButton onClick={() => deleteLyrics(row)}>
                    삭제
                  </GhostButton>
                </BtnGroup>
              </ListItem>
            ))}
          </List>
        </Card>
      </CardsRow>
    </MyPageContainer>
  );
}

export default MyPage;

/* =============================
   MyPage 스타일 (반응형 적용)
============================= */

const MyPageContainer = styled.div`
  padding: 0px 48px 80px;
  color: #fff;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 0 32px 60px;
  }

  @media (max-width: 768px) {
    padding: 0 16px 40px;
  }
`;

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 24px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const TitleLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const PageTitle = styled.h1`
  font-size: 72px;
  margin: 0;
  color: #f6cd66;

  @media (max-width: 1024px) {
    font-size: 56px;
  }

  @media (max-width: 768px) {
    font-size: 40px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const Greeting = styled.span`
  font-size: 16px;
  color: #cfd4d9;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const HeaderLink = styled(Link)`
  font-size: 16px;
  color: #cfd4d9;
  text-decoration: none;

  &:hover {
    color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const Card = styled.section`
  background: #f5f6f7;
  border-radius: 12px;
  padding: 16px;
  color: #111;

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const CardHeader = styled.h2`
  margin: 6px 8px 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e1e3e6;
  font-size: 22px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 6px;
  max-height: 220px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 0 2px;
  }
`;

const ListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 14px 8px;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 12px 6px;
  }
`;

const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    strong {
      font-size: 14px;
    }
  }
`;

const Sub = styled.span`
  font-size: 12px;
  color: #6c757d;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    gap: 6px;
  }
`;

const GhostButton = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #d0d5db;
  background: #fff;
  color: #111;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;

  &:hover {
    background: #e9ecef;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 13px;
    height: 36px;
  }
`;

