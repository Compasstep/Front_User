// src/pages/discovery/KeywordSearchResults.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import api from '../../api/client';
import EmotionPicker, { EMOTIONS } from '../../components/EmotionPicker.jsx';
import useUserStore from '../../store/userStore';
import axios from 'axios'; // ← 추가: 취소 여부 판별용

const BASE_URL = import.meta.env.BASE_URL;

/* animations */
const fadeInDown = keyframes`from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}`;
const fadeInUp   = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

/* inline placeholder */
const defaultThumb =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
       <rect width="160" height="90" fill="#3a3f43"/>
       <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
             font-family="sans-serif" font-size="10" fill="#9aa3aa">No image</text>
     </svg>`
  );

function ensureHttps(url) {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http://')) return url.replace('http://', 'https://');
  return url;
}
function normalizeItem(raw) {
  const videoId =
    (raw?.videoId && String(raw.videoId)) ||
    (raw?.id && String(raw.id)) ||
    raw?.video?.id || null;

  const title = raw?.title || raw?.videoTitle || raw?.name || '';
  const channelName = raw?.channelName || raw?.channel || raw?.author || '';

  const thumbFromApi =
    raw?.thumbnailUrl || raw?.thumbnail || raw?.thumbnails?.[0]?.url || raw?.thumbnail?.url || '';
  const thumbFromId = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
  const youtubeUrl = raw?.youtubeUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : null);

  const thumbnailUrl = ensureHttps(thumbFromApi || thumbFromId);
  const keyCandidate = (videoId || youtubeUrl || `${title}|${channelName}`).trim();

  return { videoId, title, channelName, youtubeUrl, thumbnailUrl, _key: keyCandidate || String(Math.random()) };
}

export default function KeywordSearchResults() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  const initialKeyword = (searchParams.get('q') || '').trim();
  const initialEmotionLabel = (searchParams.get('e') || '').trim();

  const labelToId = useMemo(() => {
    const map = new Map();
    EMOTIONS.forEach(e => map.set(e.label, e.id));
    return map;
  }, []);

  const [keyword, setKeyword] = useState(initialKeyword);
  const [emotionId, setEmotionId] = useState(
    (initialEmotionLabel && labelToId.get(initialEmotionLabel)) || null
  );
  const selectedEmotionLabel = useMemo(
    () => EMOTIONS.find(e => e.id === emotionId)?.label || '',
    [emotionId]
  );

  const [status, setStatus] = useState('idle');   // idle | loading | error | unauth
  const [results, setResults] = useState([]);

  const ranRef = useRef(false); // StrictMode 중복 방지
  const abortRef = useRef(null); // ← 추가: 진행 중 요청 취소 저장

  useEffect(() => {
    if (location.pathname !== '/discovery/keyword/results') return;
    if (!isLoggedIn) { setStatus('unauth'); return; }
    if (!initialKeyword) return;

    if (import.meta.env.DEV) {
      if (ranRef.current) return;
      ranRef.current = true;
    }

    // 이전 요청이 있으면 취소
    abortRef.current?.abort();

    // 새 요청 컨트롤러 생성
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    (async () => {
      try {
        const res = await api.post(
          '/user/discovery/keyword', 
          { query: initialKeyword, emotion: initialEmotionLabel || null },
          { timeout: 1500000, signal: controller.signal } // ← 추가: signal 전달
        );

        const rawList = Array.isArray(res?.data?.result) ? res.data.result : [];
        const normalized = rawList.map(normalizeItem);

        const seen = new Set();
        const deduped = [];
        for (const it of normalized) {
          if (seen.has(it._key)) continue;
          seen.add(it._key);
          deduped.push(it);
        }

        setResults(deduped);
        setStatus('idle');
      } catch (e) {
        // ← 추가: 취소면 조용히 무시
        if (
          axios.isCancel?.(e) ||
          e?.name === 'CanceledError' ||
          e?.code === 'ERR_CANCELED' ||
          e?.config?.signal?.aborted
        ) {
          return;
        }
        setStatus('error');
        console.error('[Keyword results error]', e);
      }
    })();

    // 언마운트/재호출 시 현재 요청 취소 + StrictMode 플래그 리셋
    return () => {
      abortRef.current?.abort();
      ranRef.current = false;
    };
  }, [location.pathname, isLoggedIn, initialKeyword, initialEmotionLabel]);

  const handleSearch = () => {
    const q = (keyword || '').trim();
    if (!q) { alert('키워드를 입력해주세요.'); return; }
    const qs = new URLSearchParams();
    qs.set('q', q);
    if (selectedEmotionLabel) qs.set('e', selectedEmotionLabel);
    navigate(`/discovery/keyword/results?${qs.toString()}`);
  };

  // 🔥 로딩 중인 동안은 무조건 전체 로딩 스피너 유지
  if (status === 'loading' || results.length === 0) {
    return <LoadingSpinner title="SEARCH" time="유튜브 데이터를 불러오는 중입니다..." />;
  }

  return (
  <Container>
    <Content>

      <Title>키워드를 입력하고 인사이트를 확인하세요</Title>

      <SearchWrapper>
          <DecorativeImage src={`${BASE_URL}keyword.png`} alt="decorative" />
        <div>
          <InputGroup>
            <SearchInput
              type="text"
              placeholder="#슬픔 #기쁨 #설렘 #분노 #감동"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchButton onClick={handleSearch}>→</SearchButton>
          </InputGroup>

          <InlinePickerWrap>
            <EmotionPicker
              value={emotionId}
              onChange={setEmotionId}
              onPick={(_, label) => setKeyword(label)}
              size="sm"
              columns={6}
              showHeader={false}
            />
          </InlinePickerWrap>
        </div>
      </SearchWrapper>

    </Content>

    {/* ------------ 로딩 스피너 ------------ */}
    {status === 'loading' && <LoadingSpinner />}

    {/* ------------ 결과 출력 ------------ */}
    {status === 'idle' && results.length > 0 && (
      <ThumbSection>
        <ThumbGrid>
          {results.slice(0, 4).map((item, idx) => {
            const themes = ['blue', 'pink', 'orange', 'green'];
            const theme = themes[idx % themes.length];
            return (
              <ThumbCard key={`${item._key}-${idx}`} $theme={theme}>
                <ThumbHeader>
                  <ThumbTitle>{item.title}</ThumbTitle>
                  <ThumbSubtitle>{item.channelName}</ThumbSubtitle>
                </ThumbHeader>
                <ThumbBody>
                  <ThumbImage src={item.thumbnailUrl || defaultThumb} />
                  <ThumbDesc>
                    {item.youtubeUrl ? 'YouTube 링크로 이동합니다.' : '링크가 없습니다.'}
                  </ThumbDesc>
                  {item.youtubeUrl && (
                    <ThumbButton href={item.youtubeUrl} target="_blank">보러가기</ThumbButton>
                  )}
                </ThumbBody>
              </ThumbCard>
            );
          })}
        </ThumbGrid>
      </ThumbSection>
    )}

    {/* ------------ 결과 없음 ------------ */}
    {status === 'idle' && results.length === 0 && (
      <Empty>검색 결과가 없습니다.</Empty>
    )}

    {/* ------------ 오류 문구 (진짜 실패일 때만) ------------ */}
    {status === 'error' && (
      <Hint>요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.</Hint>
    )}
  </Container>
);
}

/* styles (동일) */
const Container = styled.div`
  min-height: 100vh;
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 40px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -70px;
    width: 100%;
    height: calc(100% + 70px);
      background-image: url('${BASE_URL}background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
    pointer-events: none;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h2`
  font-family: 'Quicksand', sans-serif;
  color: #FACD66;
  font-size: 20px;
  margin: 0 0 32px;
  animation: ${fadeInDown} 0.8s ease-out;
`;
const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  animation: ${fadeInUp} 0.8s ease-out;
  width: 100%;
  max-width: 1080px;   /* 가운데 영역 폭 제한 */
`;
const DecorativeImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 24px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
  &:hover { transform: scale(1.05); }
`;
const InputGroup = styled.div`
  position: relative;                     /* 버튼 절대배치 기준 */
  display: block;                         /* flex → block */
  background-color: rgba(40, 40, 40, 0.8);
  border-radius: 50px;
  padding: 12px 20px;                     /* 좌우 기본 패딩 */
  backdrop-filter: blur(5px);
  transition: box-shadow 0.3s ease-in-out;
  width: 70%;                            /* 가로 꽉 채우기 */
  &:focus-within { box-shadow: 0 0 0 2px #FACD66; }
`;
const SearchInput = styled.input`
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  outline: none;
  padding-right: 56px;                    /* 버튼 공간 확보 */
  &::placeholder { color: #888; }
`;

const SearchButton = styled.button`
  position: absolute;
  top: 50%;
  right: 14px;                            /* 항상 우측 고정 */
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
  &:hover { color: #FACD66; background: rgba(255,255,255,0.08); }
  &:active { transform: translateY(-50%) scale(0.98); }

  /* 키보드 포커스 시 접근성 강조 */
  &:focus-visible {
    outline: 2px solid #FACD66;
    outline-offset: 2px;
  }
`;
const InlinePickerWrap = styled.div`
  width: 70%;
  margin-top: 10px;
`;
const Hint = styled.p`
  margin-top: 14px;
  color: #cfd4d9;
  font-size: 14px;
`;
const ThumbSection = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 40px 24px 0;
  display: flex;
  justify-content: center;
`;
const ThumbGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;
const themeColor = (t) =>
  t === 'pink'   ? '#a70063' :
  t === 'blue'   ? '#026277' :
  t === 'orange' ? '#2f4f4f' :
  t === 'green'  ? '#2e003e'  : '#2f4f4f';
const ThumbCard = styled.article`
  background-color: #2a2f32;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  & > header { background-color: ${(p) => themeColor(p.$theme)}; }
`;
const ThumbHeader = styled.header` padding: 12px; `;
const ThumbTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${(p) => p.$ff || 'inherit'};
`;
const ThumbSubtitle = styled.p`
  margin: 0;
  font-size: 11px;
  color: #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ThumbBody = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ThumbImage = styled.img`
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
`;
const ThumbDesc = styled.p`
  margin: 0;
  font-size: 12px;
  color: #aaa;
  line-height: 1.45;
`;
const ThumbButton = styled.a`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #d0d5db;
  background: #fff;
  color: #111;
  text-decoration: none;
  font-size: 12px;
  cursor: pointer;
  &:hover { background:#f0f3f5; }
`;
const Empty = styled.div`
  grid-column: 1 / -1;
  color: #cfd4d9;
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
`;
