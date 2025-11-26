// src/pages/discovery/Rankings.jsx
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import api from '../../api/client';
import { showToast } from "../../utils/globalToast";

const BASE_URL = import.meta.env.BASE_URL;

// ── Spotify 장르 키워드 보정: 사용자가 kpop/k pop/k-pop 등 입력해도 "k-pop" 으로 변환
const normalizeGenre = (raw) => {
  const g = (raw || '').trim().toLowerCase();
  const map = {
    'kpop': 'k-pop',
    'k-pop': 'k-pop',
    'k pop': 'k-pop',
    'khiphop': 'k-hip hop',
    'k-hiphop': 'k-hip hop',
    'k-hip hop': 'k-hip hop',
    'k hip hop': 'k-hip hop',
    'khh': 'k-hip hop',
    'krnb': 'korean r&b',
    'k-r&b': 'korean r&b',
    'korean r&b': 'korean r&b',
    'k-indie': 'k-indie',
    'kindie': 'k-indie',
    'k-indie rock': 'k-indie rock',
    'k-rock': 'k-rock',
    'k rock': 'k-rock',
    'k-rap': 'k-rap',
    'k rap': 'k-rap',
  };
  return map[g] || g;
};

function Rankings() {
  const [genreInput, setGenreInput] = useState('pop'); // 사용자 입력값
  const [market, setMarket] = useState('KR');
  const [limit, setLimit] = useState(30);
  const [list, setList] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | error | empty
  const [ytLoadingId, setYtLoadingId] = useState(null); // 유튜브 링크 조회 중인 rank

  const genreForServer = useMemo(() => normalizeGenre(genreInput), [genreInput]);

  // 랭킹 호출
  const fetchRankings = async () => {
    setStatus(true ? 'loading' : 'idle');
    try {
      const { data } = await api.get('/user/rankings', {
        params: {
          genre: genreForServer || undefined,
          market: (market || '').trim() || undefined, // 빈값이면 제외
          limit: Math.max(1, Math.min(50, Number.isFinite(+limit) ? +limit : 10)),
        },
      });
      const rows = Array.isArray(data?.result) ? data.result : [];
      setList(rows);
      setStatus(rows.length ? 'idle' : 'empty');
    } catch (e) {
      console.error('[Rankings] fetch error:', e);
      setStatus('error');
    }
  };

  // 유튜브 링크 열기
  const openYoutube = async (song) => {
    if (ytLoadingId) return; // 중복 클릭 방지
    setYtLoadingId(song.rank);
    try {
      const { data } = await api.get('/user/youtube-link', {
        params: { title: song?.songTitle, artist: song?.artistName },
      });
      const url =
        data?.result?.url ||
        data?.result?.videoUrl ||
        data?.result?.link ||
        (typeof data?.result === 'string' ? data.result : '');

      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        showToast('해당 곡의 유튜브 링크를 찾지 못했습니다.');
      }
    } catch (e) {
      console.error('[Rankings] youtube-link error:', e);
      showToast('유튜브 링크 조회 중 오류가 발생했습니다.');
    } finally {
      setYtLoadingId(null);
    }
  };

  useEffect(() => {
    // 최초 로드 1회
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchRankings();
  }, []);

  return (
    <RankingsContainer>
      <ChartHeader>
        <HeaderContent>
          <PlaylistTitle>추천 플레이리스트</PlaylistTitle>
          <Top100>TOP 50</Top100>
          <GenreDescription>
            지금 가장 사랑받는 인기곡을 한곳에서 만나보세요
          </GenreDescription>

          <FilterRow>
            <label>
              장르
              <Input
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                placeholder="예: kpop, k-hip hop, korean r&b"
              />
            </label>
            <label>
              국가
              <Input
                value={market}
                onChange={(e) => setMarket(e.target.value.toUpperCase())}
                placeholder="KR / US / JP ..."
                maxLength={2}
              />
            </label>
            <label>
              Limit
              <Input
                type="number"
                min={1}
                max={50}
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </label>
            <ReloadBtn onClick={fetchRankings} disabled={status === 'loading'}>
              {status === 'loading' ? 'Loading…' : '불러오기'}
            </ReloadBtn>
          </FilterRow>
        </HeaderContent>

          <PromoImage src={`${BASE_URL}golden.png`} alt="Promo" />
      </ChartHeader>

      {status === 'loading' && <InfoRow>불러오는 중…</InfoRow>}
      {status === 'error' && <ErrorRow>랭킹을 불러오지 못했습니다.</ErrorRow>}
      {status === 'empty' && (
        <InfoRow>
          결과가 없습니다. 장르를 <code>k-pop</code>, <code>k-hip hop</code>, <code>korean r&amp;b</code> 등으로
          시도해 보세요.
        </InfoRow>
      )}

      <SongList>
        {list.map((song) => (
          <SongListItem key={song.rank}>
            <RankNumber>{song.rank}</RankNumber>
            <AlbumArt src={song.albumImageUrl || `${BASE_URL}golden.png`} alt={song.songTitle} />
            <SongInfo>
              <SongTitle>{song.songTitle}</SongTitle>
              <ArtistName>{song.artistName}</ArtistName>
            </SongInfo>
            <Spacer />
            <YoutubeButton
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openYoutube(song);
              }}
              aria-label="Play on YouTube"
              disabled={ytLoadingId === song.rank}
              title="유튜브 뮤직비디오 열기"
            >
              {ytLoadingId === song.rank ? '…' : '▶'}
            </YoutubeButton>
          </SongListItem>
        ))}
      </SongList>
    </RankingsContainer>
  );
}

export default Rankings;

/* ---------- styled-components (Refined) ---------- */

/* 전체 컨테이너: 정렬 개선 */
const RankingsContainer = styled.div`
  padding: 0 40px 60px;
  max-width: 1200px;
  margin: 0 auto;
`;

/* 헤더 카드 */
const ChartHeader = styled.div`
  background-color: #5e99a9;
  border-radius: 22px;
  padding: 40px 40px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  color: #fff;
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 850px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeaderContent = styled.div`
  max-width: 60%;

  @media (max-width: 850px) {
    max-width: 100%;
  }
`;

const PlaylistTitle = styled.p`
  font-size: 14px;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
  opacity: 0.9;
`;

const Top100 = styled.h1`
  font-family: 'Anton', sans-serif;
  font-size: 4.2rem;
  margin-bottom: 14px;
  line-height: 1;
`;

const GenreDescription = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 15px;
  color: #f1f8fa;
  line-height: 1.6;
  margin-top: 10px;
  opacity: 0.95;
  max-width: 90%;

  @media (max-width: 850px) {
    max-width: 100%;
  }
`;

/* 필터 영역 */
const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-top: 22px;
  flex-wrap: wrap;

  label {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    font-weight: 600;
    color: #e8f5f7;
    margin-bottom: 6px;
  }
`;

const Input = styled.input`
  height: 36px;
  width: 140px;
  padding: 0 12px;
  border-radius: 10px;
  border: none;
  margin-top: 6px;
  font-size: 14px;
  color: #333;
  background: #fff;

  &:focus {
    outline: 2px solid #14363a;
  }
`;

const ReloadBtn = styled.button`
  height: 36px;
  padding: 0 18px;
  border-radius: 10px;
  border: none;
  background: #14363a;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);

  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  pointer-events: ${(p) => (p.disabled ? 'none' : 'auto')};

  transition: background 0.2s ease, transform 0.15s ease;

  &:hover {
    background: #1c4850;
  }

  &:active {
    transform: scale(0.96);
  }
`;

/* 프로모 이미지 */
const PromoImage = styled.img`
  width: 210px;
  height: 210px;
  border-radius: 18px;
  object-fit: cover;
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);

  @media (max-width: 850px) {
    width: 160px;
    height: 160px;
  }
`;

/* 서브 메시지 */
const InfoRow = styled.p`
  color: #eee;
  margin: 14px 4px 0;
  font-size: 14px;
`;

const ErrorRow = styled.p`
  color: #fbb;
  margin: 14px 4px 0;
  font-size: 14px;
`;

/* 리스트 */
const SongList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

/* 곡 아이템 카드 */
const SongListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  padding: 14px 12px;
  border-radius: 12px;
  transition: background-color 0.22s ease, transform 0.15s ease;
  
  &:hover {
    background-color: #2c3336;
    transform: translateY(-2px);
  }
`;

const RankNumber = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #c7c7c7;
  width: 50px;
  text-align: center;
`;

const AlbumArt = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 18px;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
`;

const SongTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
`;

const ArtistName = styled.p`
  font-size: 14px;
  color: #b0b0b0;
  margin: 0;
`;

const Spacer = styled.span`
  flex: 0 0 30px;
`;

const YoutubeButton = styled.button`
  background-color: #FF0000;
  color: #fff;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;

  box-shadow: 0 4px 12px rgba(255,0,0,0.35);

  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
  pointer-events: ${(p) => (p.disabled ? 'none' : 'auto')};

  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.9);
  }
`;