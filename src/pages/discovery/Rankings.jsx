// src/pages/discovery/Rankings.jsx

import styled from 'styled-components';
import { Link } from 'react-router-dom';

// --- 가짜 데이터 (나중에 API 응답으로 대체) ---
const mockSongList = [
  { rank: 1, title: 'Golden', artist: 'HUNTRIX, EJAE, AUDREY NUNA', duration: '3:14', albumArtUrl: '/golden.png', youtubeUrl: 'https://www.youtube.com/watch?v=yebNIHKAC4A' },
  { rank: 2, title: 'back to friends', artist: 'lauren spencer smith', duration: '3:19', albumArtUrl: '/backToFriends.png', youtubeUrl: 'https://www.youtube.com/watch?v=c8zq4kAn_O0' },
  { rank: 3, title: 'Ordinary', artist: 'Alex Warren', duration: '3:06', albumArtUrl: '/ordinary.png', youtubeUrl: 'https://www.youtube.com/watch?v=A8dH4cKGa6s' },
  { rank: 4, title: "Don't Say You Love Me", artist: 'SIO', duration: '3:00', albumArtUrl: '/dontSay.png', youtubeUrl: 'https://www.youtube.com/watch?v=o7BcyAd6rqg' },
  { rank: 5, title: 'Man I Need', artist: 'AUDREY NUNA', duration: '3:06', albumArtUrl: '/manINeed.png', youtubeUrl: 'https://www.youtube.com/watch?v=oIv_Y2RPQ_A' },
  // ... (랭킹 데이터 추가)
];


function Rankings() {
  return (
    <RankingsContainer>
      <ChartHeader>
        <HeaderContent>
          <PlaylistTitle>Currated playlist</PlaylistTitle>
          <Top100>TOP 100</Top100>
          <GenreTitle>KPOP HITS!</GenreTitle>
          <GenreDescription>
            All mine, Lie again, Pretty, call me everyday,
            Out of time, Like a movie, Bad habit,
            and so much more
          </GenreDescription>
        </HeaderContent>
        {/* 이 부분의 이미지 경로를 public 폴더에 넣은 이미지로 수정하세요 */}
        <PromoImage src="golden.png" alt="Promo" />
      </ChartHeader>
      
      <SongList>
        {mockSongList.map(song => (
          <SongListItem key={song.rank}>
            <RankNumber>{song.rank}</RankNumber>
            {/* 이 부분의 이미지 경로를 실제 앨범 아트로 수정하세요 */}
            <AlbumArt src={song.albumArtUrl} alt={song.title} />
            <SongInfo>
              <SongTitle>{song.title}</SongTitle>
              <ArtistName>{song.artist}</ArtistName>
            </SongInfo>
            <SongDuration>{song.duration}</SongDuration>
            <YoutubeButton as="a" href={song.youtubeUrl} target="_blank">
              ▶
            </YoutubeButton>
          </SongListItem>
        ))}
      </SongList>
    </RankingsContainer>
  );
}

// --- styled-components ---

const RankingsContainer = styled.div`
  padding: 0 40px 40px;
`;

const ChartHeader = styled.div`
  background-color: #609EAF; /* 와이어프레임의 청록색 배경 */
  border-radius: 16px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  color: #fff;
`;

const HeaderContent = styled.div`
  max-width: 60%;
`;

const PlaylistTitle = styled.p`
  font-size: 14px;
  margin-bottom: 20px;
`;

const Top100 = styled.h1`
  font-family: 'Anton', sans-serif;
  font-size: 4rem;
  margin-bottom: 20px;
`;

const GenreTitle = styled.h2`
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  margin-bottom: 10px;
`;

const GenreDescription = styled.p`
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  color: #eee;
  line-height: 1.5;
`;

const PromoImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SongListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #2a2f32;
  }
`;

const RankNumber = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #aaa;
  width: 40px;
  text-align: center;
`;

const AlbumArt = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 20px;
`;

const SongInfo = styled.div`
  flex-grow: 1;
`;

const SongTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
`;

const ArtistName = styled.p`
  font-size: 14px;
  color: #aaa;
`;

const SongDuration = styled.span`
  font-size: 14px;
  color: #aaa;
  margin-right: 30px;
`;

const YoutubeButton = styled(Link)`
  background-color: #FF0000;
  color: #fff;
  border: none;
  border-radius: 5px;
  width: 30px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 12px;
`;

export default Rankings;