// src/pages/reputation/PeerReview.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import StarRating from "../../components/StarRating.jsx";
import Comment from "../../components/Comment.jsx";
import { showToast } from "../../utils/globalToast";

function PeerReview() {
  const { reviewId } = useParams();

  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");

  const [loading, setLoading] = useState(true);

  const [reviewData, setReviewData] = useState({
    artistName: "",
    artistImage: "",
    songUrl: "",
    comments: [],
    songTitle: "",
  });

  /* -----------------------------------------------------------
     1) 게시글 상세 조회 + presigned download URL 발급
  ----------------------------------------------------------- */
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 상세 조회
        const detailRes = await fetch(`/posts/${reviewId}`);
        const detailJson = await detailRes.json();
        const data = detailJson?.result;

        if (!data) throw new Error("게시글 조회 실패");

        const {
          songTitle,
          artistName,
          artistProfileImage,
          s3FileKey,
          comments,
        } = data;

        // presigned 음원 파일
        const dlRes = await fetch("/api/user/files/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileKey: s3FileKey,
            originalFileName: songTitle || "audio",
          }),
        });
        const dlJson = await dlRes.json();
        const audioUrl = dlJson?.result?.presignedUrl;

        // presigned 이미지 파일
        let artistImageUrl = "";
        if (artistProfileImage) {
          const imgRes = await fetch("/api/user/files/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileKey: artistProfileImage,
              originalFileName: artistProfileImage,
            }),
          });
          const imgJson = await imgRes.json();
          artistImageUrl = imgJson?.result?.presignedUrl || "";
        }

        const sortedComments = [...comments].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setReviewData({
          artistName,
          artistImage: artistImageUrl,
          songUrl: audioUrl,
          comments: sortedComments,
          songTitle,
        });
      } catch (err) {
        console.error("[PeerReview] 상세 조회 실패", err);
        showToast("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [reviewId]);

  /* -----------------------------------------------------------
      2) 댓글 작성
  ----------------------------------------------------------- */
  const handleSubmit = async () => {
    if (!myRating) return showToast("별점을 입력해주세요.");
    if (!myComment.trim()) return showToast("댓글을 입력해주세요.");

    try {
      await fetch(`/posts/${reviewId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: myComment,
          rate: myRating,
        }),
      });

      const res = await fetch(`/posts/${reviewId}`);
      const json = await res.json();

      const sorted = [...json?.result?.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setReviewData((prev) => ({ ...prev, comments: sorted }));
      setMyRating(0);
      setMyComment("");
    } catch (err) {
      console.error("[댓글 작성 실패]", err);
      showToast("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <Container>
        <Panel>로딩 중...</Panel>
      </Container>
    );
  }

  return (
    <Container>
      <Panel>
        <Title>아티스트 평가하기</Title>
        <Subtitle>{reviewData.artistName}님 음악에 대한 평점</Subtitle>

        {/* 아티스트 + 오디오 */}
        <ArtistBox>
          <ArtistImage
            src={reviewData.artistImage || "https://via.placeholder.com/150"}
          />
          <ArtistRight>
            <ArtistName>{reviewData.artistName}</ArtistName>
            {reviewData.songUrl && (
              <Audio controls src={reviewData.songUrl} crossOrigin="anonymous" />
            )}
          </ArtistRight>
        </ArtistBox>

        {/* 별점 */}
        <Section>
          <SecTitle>별점 평가</SecTitle>

          <StarWrap>
            <StarRating rating={myRating} setRating={setMyRating} />
            <StarSub>{reviewData.artistName}님 음악에 대한 평점</StarSub>
          </StarWrap>
        </Section>

        {/* 코멘트 */}
        <Section>
          <SecTitle>자유 코멘트</SecTitle>
          <CommentBox
            placeholder="아티스트 음악을 듣고 느낀 점을 자유롭게 적어주세요"
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
          />
        </Section>

        {/* 제출 */}
        <SubmitButton onClick={handleSubmit}>평가 제출하기</SubmitButton>

        {/* 댓글 리스트 */}
        <Section>
          <SecTitle>다른 사람들의 평가</SecTitle>
          <CommentList>
            {reviewData.comments.map((item) => (
              <Comment key={item.commentId} comment={item} />
            ))}
          </CommentList>
        </Section>
      </Panel>
    </Container>
  );
}

export default PeerReview;

/* ===========================
   기존 디자인 그대로 스타일
   =========================== */

const Container = styled.div`
  padding: 40px 20px;
  min-height: 100vh;
  background: #1d2123;
  color: #fff;
  display: flex;
  justify-content: center;
`;

const Panel = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  width: 500px;
  color: #111;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  text-align: center;
  font-family: "Anton", sans-serif;
  font-size: 2rem;
  margin: 0;
  color: #111;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin: 0;
`;

const ArtistBox = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
`;

const ArtistImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const ArtistRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const ArtistName = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const Audio = styled.audio`
  width: 100%;
`;

const Section = styled.div`
  background: #fafafa;
  padding: 16px;
  border-radius: 12px;
`;

const SecTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.1rem;
`;

const StarWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StarSub = styled.p`
  margin: 0;
  color: #888;
  font-size: 0.9rem;
`;

const CommentBox = styled.textarea`
  width: 100%;
  height: 120px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  resize: none;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s ease;

  &:focus {
    border: 1px solid #1976d2;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 0;
  background: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 350px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 8px;
  }
`;