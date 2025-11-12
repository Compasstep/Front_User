// src/pages/reputation/PeerReview.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import StarRating from '../../components/StarRating.jsx';
import Comment from '../../components/Comment.jsx';
import { mockPeerReviewDetails } from '../../data/mockPeerReviewData.js';
import useUserStore from '../../store/userStore.js';

function PeerReview() {
  const { reviewId } = useParams();
  const { user } = useUserStore();

  const [myRating, setMyRating] = useState(0);
  const [myNickname, setMyNickname] = useState('');
  const [myComment, setMyComment] = useState('');
  
  // --- 1. reviewData state에 songUrl 추가 ---
  const [reviewData, setReviewData] = useState({
    ...mockPeerReviewDetails,
    artistName: user?.name || '아티스트',
    artistImage: user?.avatarUrl || 'https://via.placeholder.com/150',
    songUrl: '', // (초기값)
  });

  useEffect(() => {
    // (추후 작업)
    // 백엔드 API (GET /api/shares/{reviewId})를 호출하여
    // 아티스트 정보(name, avatarUrl)와 **노래 URL(songUrl)**을 받아와야 합니다.
    console.log('게시글 ID:', reviewId, '의 데이터를 불러옵니다.');
    
    // --- 2. (데모용) songUrl에 임시 MP3 주소 추가 ---
    setReviewData(prev => ({
      ...prev,
      artistName: user?.name || '아티스트',
      artistImage: user?.avatarUrl || 'https://via.placeholder.com/150',
      songUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // 실제 API 응답으로 교체 필요
    }));

  }, [reviewId, user]); 

  const handleSubmit = () => {
    if (myRating === 0) {
      alert('별점 평가를 진행해주세요.');
      return;
    }
    if (!myNickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (!myComment.trim()) {
      alert('코멘트를 입력해주세요.');
      return;
    }
    
    alert(`ID: ${reviewId} 게시글에 평가가 성공적으로 제출되었습니다.`);
    
    setMyRating(0);
    setMyNickname('');
    setMyComment('');
  };

  return (
    <PageContainer>
      <ReviewPanel>
        <Header>아티스트 평가하기</Header>
        <SubHeader>{reviewData.artistName}님 음악에 대한 평점</SubHeader>

        <Section>
          <ArtistInfoContainer>
            <ArtistImage src={reviewData.artistImage} alt="아티스트 프로필" />
            
            {/* --- 3. 이름과 오디오 플레이어를 묶는 div 추가 --- */}
            <ArtistDetails>
              <ArtistName>{reviewData.artistName}</ArtistName>
              {/* 4. 오디오 플레이어 추가 */}
              {reviewData.songUrl && (
                <AudioPlayer src={reviewData.songUrl} controls />
              )}
            </ArtistDetails>
          </ArtistInfoContainer>
        </Section>

        <Section>
          <SectionTitle>별점 평가</SectionTitle>
          <StarRatingContainer>
            <StarRating rating={myRating} setRating={setMyRating} />
            <StarRatingSubText>{reviewData.artistName}님 음악에 대한 평점</StarRatingSubText>
          </StarRatingContainer>
        </Section>

        <Section>
          <SectionTitle>자유 코멘트</SectionTitle>
          <CommentInput
            placeholder="아티스트의 음악과 스타일, 강점, 보완할 점 등을 자유롭게 작성해주세요."
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
          />
        </Section>
        
        <SubmitForm>
          <NicknameInput
            type="text"
            placeholder="닉네임"
            value={myNickname}
            onChange={(e) => setMyNickname(e.target.value)}
          />
          <SubmitButton onClick={handleSubmit}>평가 제출하기</SubmitButton>
        </SubmitForm>
        
        <Section>
          <SectionTitle>다른 사람들의 평가</SectionTitle>
          <CommentsList>
            {reviewData.comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </CommentsList>
        </Section>

      </ReviewPanel>
    </PageContainer>
  );
}

// --- styled-components ---

const PageContainer = styled.div`
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #1D2123;
  color: #fff;
`;

const ReviewPanel = styled.div`
  background-color: #f8f9fa;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #333;
`;

const Header = styled.h1`
  text-align: center;
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  margin: 0;
  color: #333;
`;

const SubHeader = styled.p`
  text-align: center;
  color: #6c757d;
  font-size: 1rem;
  margin-top: 5px;
`;

const Section = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ArtistInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
`;

const ArtistImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e9ecef;
  border: 1px solid #dee2e6;
  flex-shrink: 0; /* 플레이어 너비가 늘어나도 찌그러지지 않게 */
`;

// --- 5. 이름과 플레이어를 묶는 스타일 추가 ---
const ArtistDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%; /* 남은 공간을 모두 차지 */
  min-width: 0; /* audio 태그가 넘치는 것을 방지 */
`;

const ArtistName = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: #333;
`;

// --- 6. 오디오 플레이어 스타일 추가 ---
const AudioPlayer = styled.audio`
  width: 100%;
  height: 40px;
  
  /* 기본 HTML 오디오 플레이어 스타일 커스텀 */
  &::-webkit-media-controls-panel {
    background-color: #f0f2f5;
    border-radius: 8px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const StarRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StarRatingSubText = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 100px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 12px;
  color: #333;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;

  &::placeholder {
    color: #adb5bd;
  }
`;

const SubmitForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const NicknameInput = styled.input`
  width: 100%;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 12px;
  color: #333;
  font-size: 1rem;
  box-sizing: border-box;

  &::placeholder {
    color: #adb5bd;
  }
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 12px 0;
  width: 100%;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export default PeerReview;