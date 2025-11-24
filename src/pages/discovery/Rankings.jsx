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
          <PlaylistTitle>Curated playlist</PlaylistTitle>
          <Top100>TOP 50</Top100>
          <GenreTitle>KPOP HITS!</GenreTitle>
          <GenreDescription>
            All mine, Lie again, Pretty, call me everyday, Out of time, Like a movie, Bad habit, and so much more
          </GenreDescription>

          <FilterRow>
            <label>
              Genre
              <Input
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                placeholder="예: kpop, k-hip hop, korean r&b"
              />
            </label>
            <label>
              Market
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
              {status === 'loading' ? 'Loading…' : 'Reload'}
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

/* ---------- styled-components ---------- */
const RankingsContainer = styled.div`padding: 0 40px 40px;`;
const ChartHeader = styled.div`
  background-color: #609EAF; border-radius: 16px; padding: 30px;
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 40px; color: #fff;
`;
const HeaderContent = styled.div`max-width: 60%;`;
const PlaylistTitle = styled.p`font-size: 14px; margin-bottom: 20px;`;
const Top100 = styled.h1`font-family: 'Anton', sans-serif; font-size: 4rem; margin-bottom: 20px;`;
const GenreTitle = styled.h2`font-family: 'Anton', sans-serif; font-size: 2rem; margin-bottom: 10px;`;
const GenreDescription = styled.p`font-family: 'Quicksand', sans-serif; font-size: 14px; color: #eee; line-height: 1.5;`;

const FilterRow = styled.div`
  display:flex; gap:12px; align-items:center; margin-top:16px; flex-wrap:wrap;
  label { display:flex; flex-direction:column; font-size:12px; color:#e9f6fb; }
`;
const Input = styled.input`
  height:32px; padding:0 10px; border-radius:8px; border:none; margin-top:4px;
`;
const ReloadBtn = styled.button`
  height:32px; padding:0 12px; border-radius:8px; border:none; background:#1b3e45; color:#fff; cursor:pointer;
  opacity: ${(p) => (p.disabled ? 0.7 : 1)}; margin-top: 20px;
`;

const PromoImage = styled.img`
  width: 200px; height: 200px; border-radius: 12px; object-fit: cover;
`;

const InfoRow = styled.p`color:#eee; margin: 12px 4px 0;`;
const ErrorRow = styled.p`color:#fdd; margin: 12px 4px 0;`;

const SongList = styled.ul`list-style: none; padding: 0;`;
const SongListItem = styled.li`
  display: flex; align-items: center; margin-bottom: 20px; padding: 10px;
  border-radius: 8px; transition: background-color 0.2s ease-in-out;
  &:hover { background-color: #2a2f32; }
`;
const RankNumber = styled.span`font-size: 18px; font-weight: bold; color: #aaa; width: 40px; text-align: center;`;
const AlbumArt = styled.img`width: 50px; height: 50px; border-radius: 8px; object-fit: cover; margin-right: 20px;`;
const SongInfo = styled.div`display:flex; flex-direction:column; gap:2px; flex-grow: 1;`;
const SongTitle = styled.p`font-size: 16px; font-weight: bold; color: #fff; margin:0;`;
const ArtistName = styled.p`font-size: 14px; color: #aaa; margin:0;`;
const Spacer = styled.span`flex:0 0 30px;`;
const YoutubeButton = styled.a`
  background-color: #FF0000; color: #fff; border: none; border-radius: 5px;
  width: 30px; height: 22px; display: flex; justify-content: center; align-items: center;
  text-decoration: none; font-size: 12px;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  pointer-events: ${(p) => (p.disabled ? 'none' : 'auto')};
`;
