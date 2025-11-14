// src/pages/reputation/PeerReview.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import StarRating from '../../components/StarRating.jsx';
import Comment from '../../components/Comment.jsx';
import useUserStore from '../../store/userStore.js';

function PeerReview() {
  const { reviewId } = useParams();
  const { user } = useUserStore();

  const [myRating, setMyRating] = useState(0);
  const [myNickname, setMyNickname] = useState('');
  const [myComment, setMyComment] = useState('');

  const [reviewData, setReviewData] = useState({
    artistName: user?.name || '아티스트',
    artistImage: user?.avatarUrl || '',
    songUrl: '',
    comments: [],
  });

  useEffect(() => {
    console.log('게시글 ID:', reviewId);

    setReviewData((prev) => ({
      ...prev,
      artistName: user?.name || '아티스트',
      artistImage: user?.avatarUrl || '',
      songUrl:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    }));
  }, [reviewId, user]);

  const handleSubmit = () => {
    if (myRating === 0) return alert('별점 평가를 진행해주세요.');
    if (!myNickname.trim()) return alert('닉네임을 입력해주세요.');
    if (!myComment.trim()) return alert('코멘트를 입력해주세요.');

    alert(`ID: ${reviewId} 게시글에 평가가 제출되었습니다.`);

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
            <ArtistImage
              src={
                reviewData.artistImage ||
                'https://via.placeholder.com/150'
              }
            />

            <ArtistDetails>
              <ArtistName>{reviewData.artistName}</ArtistName>

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
            <StarRatingSubText>
              {reviewData.artistName}님 음악에 대한 평점
            </StarRatingSubText>
          </StarRatingContainer>
        </Section>

        <Section>
          <SectionTitle>자유 코멘트</SectionTitle>
          <CommentInput
            placeholder="아티스트의 음악과 스타일..."
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
          <SubmitButton onClick={handleSubmit}>
            평가 제출하기
          </SubmitButton>
        </SubmitForm>

        <Section>
          <SectionTitle>다른 사람들의 평가</SectionTitle>
          <CommentsList>
            {reviewData.comments.map((c) => (
              <Comment key={c.id} comment={c} />
            ))}
          </CommentsList>
        </Section>
      </ReviewPanel>
    </PageContainer>
  );
}

export default PeerReview;

/* ---- styled components 그대로 유지 ---- */

const PageContainer = styled.div`
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #1d2123;
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
  flex-shrink: 0;
`;

const ArtistDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const ArtistName = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: #333;
`;

const AudioPlayer = styled.audio`
  width: 100%;
  height: 40px;
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
`;

const SubmitForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
`;

const NicknameInput = styled.input`
  width: 100%;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 12px;
  color: #333;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  font-size: 1.1rem;
`;
