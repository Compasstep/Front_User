// src/pages/user/MyPage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore.js";
import api from "../../api/client";
import axios from "axios";

const asArray = (v) => (Array.isArray(v) ? v : []);
const asBool = (v) => v === true || v === "true";

// 취소 판별(컴포넌트 측 보조)
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

  // 로그인 가드용
  const { user, isLoggedIn } = useUserStore();
  const displayName = useMemo(() => (user?.name || "사용자").trim(), [user]);

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
        id: r.id ?? r.postId ?? r.shareId,
        title: r.title ?? r.filename ?? "무제.zip",
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
        id: r.id ?? r.analysisId,
        title: r.title ?? r.fileName ?? "파일",
        artist: r.artist ?? r.artistName ?? "",
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

        // ✅ StrictMode에서 일부 요청 취소돼도 전체 실패 방지
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

        // 데이터 설정(성공한 것만 반영)
        if (repRes) {
          const repRaw = repRes?.data?.result ?? repRes?.data ?? [];
          setRepList(normReputation(repRaw));
        }
        if (peerRes) {
          const peerRaw = peerRes?.data?.result ?? peerRes?.data ?? [];
          setPeerList(normPeer(peerRaw));
        }
        if (lyricsRes) {
          const lyricsRaw = lyricsRes?.data?.result ?? lyricsRes?.data ?? [];
          setLyricsList(normLyrics(lyricsRaw));
        }

        // 하나라도 "실패"이고, 그 실패가 '취소'가 아닐 때만 경고
        const nonCanceledErrors = settled
          .filter((s) => s.status === "rejected")
          .map((s) => s.reason)
          .filter((e) => !isCanceled(e));

        if (nonCanceledErrors.length > 0) {
          // 401이면 로그인으로 보냄(첫 건 기준)
          const first = nonCanceledErrors[0];
          if (first?.status === 401) {
            navigate("/login", { replace: true, state: { from: "/mypage" } });
            return;
          }
          console.error("[MyPage] fetch partial error:", nonCanceledErrors);
          alert("마이페이지 일부 데이터를 불러오지 못했습니다.");
        }
      } catch (e) {
        // 여기까지 오면 진짜 코드 레벨 예외
        if (isCanceled(e)) return; // 취소는 무시
        if (e?.status === 401) {
          navigate("/login", { replace: true, state: { from: "/mypage" } });
          return;
        }
        console.error(
          "[MyPage] fetch error:",
          e?.response?.data || e.message || e
        );
        alert("마이페이지 데이터를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ctrl.abort();
    };
  }, [isLoggedIn, normLyrics, normPeer, normReputation, navigate]);

  const handlePeerReviewClick = (item) => {
    const analyzed = asBool(item.analyzed);
    if (analyzed) navigate(`/analysis/unreleased/result/${item.id}`);
    else alert("아직 분석이 완료되지 않았습니다. 잠시 후 다시 시도해주세요.");
  };

  const confirmDelete = async (fn) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return false;
    await fn();
    return true;
  };

  const deleteReputation = async (row) => {
    const ok = await confirmDelete(() =>
      api.delete(`/user/mypage/reputation-history/${row.id}`)
    );
    if (ok) setRepList((prev) => prev.filter((x) => x.id !== row.id));
  };

  const deletePeerPost = async (row) => {
    const ok = await confirmDelete(() =>
      api.delete(`/user/mypage/posts/${row.id}`)
    );
    if (ok) setPeerList((prev) => prev.filter((x) => x.id !== row.id));
  };

  const openLyricsResult = () => {
    alert("가사 분석 상세는 라우트 연결 후 이동합니다.");
  };

  const deleteLyrics = async (row) => {
    const ok = await confirmDelete(() =>
      api.delete(`/user/mypage/lyrics-analyses/${row.id}`)
    );
    if (ok) setLyricsList((prev) => prev.filter((x) => x.id !== row.id));
  };

  return (
    <MyPageContainer>
      <TitleRow>
        <TitleLeft>
          <PageTitle>MY PAGE</PageTitle>
          <Greeting aria-live="polite">{displayName}님 환영합니다</Greeting>
        </TitleLeft>
        <RightActions>
          <HeaderLink to="/profile/edit">프로필 수정</HeaderLink>
          <HeaderLink to="/account/withdraw">탈퇴하기</HeaderLink>
        </RightActions>
      </TitleRow>

      <CardsRow>
        <Card>
          <CardHeader>발매곡 평판 분석 조회</CardHeader>
          {loading ? (
            <List>
              <ListItem>
                <ItemText>
                  <strong>불러오는 중…</strong>
                </ItemText>
              </ListItem>
            </List>
          ) : (
            <List>
              {repList.length === 0 && (
                <ListItem>
                  <ItemText>
                    <strong>내역이 없습니다.</strong>
                  </ItemText>
                </ListItem>
              )}
              {repList.map((item) => (
                <ListItem key={String(item.id)}>
                  <ItemText>
                    <strong>{item.title}</strong>
                    <Sub>{item.artist}</Sub>
                  </ItemText>
                  <BtnGroup>
                    <GhostButton
                      onClick={() =>
                        alert("평판 재확인은 상세 화면에서 지원됩니다.")
                      }
                    >
                      평판 재확인
                    </GhostButton>
                    <GhostButton onClick={() => deleteReputation(item)}>
                      삭제
                    </GhostButton>
                  </BtnGroup>
                </ListItem>
              ))}
            </List>
          )}
        </Card>

        <Card>
          <CardHeader>미발매곡 - 지인평가 조회</CardHeader>
          {loading ? (
            <List>
              <ListItem>
                <ItemText>
                  <strong>불러오는 중…</strong>
                </ItemText>
              </ListItem>
            </List>
          ) : (
            <List>
              {peerList.length === 0 && (
                <ListItem>
                  <ItemText>
                    <strong>내역이 없습니다.</strong>
                  </ItemText>
                </ListItem>
              )}
              {peerList.map((item) => (
                <ListItem key={String(item.id)}>
                  <ItemText>
                    <strong>{item.title}</strong>
                  </ItemText>
                  <BtnGroup>
                    <GhostButton onClick={() => handlePeerReviewClick(item)}>
                      {asBool(item.analyzed) ? "결과 확인" : "분석 중"}
                    </GhostButton>
                    <GhostButton onClick={() => deletePeerPost(item)}>
                      삭제
                    </GhostButton>
                  </BtnGroup>
                </ListItem>
              ))}
            </List>
          )}
        </Card>
      </CardsRow>

      <Card>
        <CardHeader>가사 분석 결과 조회</CardHeader>
        {loading ? (
          <List>
            <ListItem>
              <ItemText>
                <strong>불러오는 중…</strong>
              </ItemText>
            </ListItem>
          </List>
        ) : (
          <List>
            {lyricsList.length === 0 && (
              <ListItem>
                <ItemText>
                  <strong>내역이 없습니다.</strong>
                </ItemText>
              </ListItem>
            )}
            {lyricsList.map((item) => (
              <ListItem key={String(item.id)}>
                <ItemText>
                  <strong>{item.title}</strong>
                  <Sub>{item.artist}</Sub>
                </ItemText>
                <BtnGroup>
                  <GhostButton onClick={() => openLyricsResult(item)}>
                    조회
                  </GhostButton>
                  <GhostButton onClick={() => deleteLyrics(item)}>
                    삭제
                  </GhostButton>
                </BtnGroup>
              </ListItem>
            ))}
          </List>
        )}
      </Card>
    </MyPageContainer>
  );
}

export default MyPage;

/* styles */
const MyPageContainer = styled.div`
  padding: 60px 48px 80px;
`;
const TitleRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 24px;
  margin-bottom: 28px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;
const TitleLeft = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  min-width: 0;
`;
const PageTitle = styled.h1`
  font-size: 72px;
  line-height: 0.9;
  margin: 0;
  color: #f6cd66;
  white-space: nowrap;
`;
const Greeting = styled.span`
  font-size: 16px;
  color: #cfd4d9;
  white-space: nowrap;
  transform: translateY(-2px);
`;
const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding-right: 6px;
  @media (max-width: 800px) {
    justify-content: flex-start;
    padding-right: 0;
  }
`;
const HeaderLink = styled(Link)`
  font-size: 16px;
  color: #cfd4d9;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;
const CardsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled.section`
  background: #f5f6f7;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
`;
const CardHeader = styled.h2`
  margin: 6px 8px 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e1e3e6;
  font-size: 22px;
  color: #212529;
`;
const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 6px;
`;
const ListItem = styled.li`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 14px 8px;
  border-bottom: 1px solid #e9ecef;
  &:last-child {
    border-bottom: none;
  }
`;
const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  strong {
    font-size: 16px;
    color: #212529;
  }
`;
const Sub = styled.span`
  font-size: 12px;
  color: #6c757d;
`;
const BtnGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  &:hover {
    background: #f0f3f5;
  }
`;
