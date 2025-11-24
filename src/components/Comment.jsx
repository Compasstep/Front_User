// src/components/Comment.jsx
import styled from 'styled-components';

function Comment({ comment }) {

  // 별점 렌더링 (rate)
  const renderStars = (rate) => {
    return '★'.repeat(rate) + '☆'.repeat(5 - rate);
  };

  return (
    <CommentCard>
      <CommentHeader>
        <Nickname>{`익명${comment.commentId}`}</Nickname>
        <Stars>{renderStars(comment.rate || 0)}</Stars>
      </CommentHeader>

      <CommentText>{comment.comment}</CommentText>

      <CommentDate>
        {new Date(comment.createdAt).toLocaleString('ko-KR')}
      </CommentDate>
    </CommentCard>
  );
}

export default Comment;

/* styled-components (원본 UI 기반 복원) */

const CommentCard = styled.div`
  background-color: #f1f3f5;  /* 밝은 회색 카드 */
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Nickname = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: #333;
`;

const Stars = styled.span`
  color: #FACD66;
  font-size: 14px;
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #444;
  line-height: 1.5;
`;

const CommentDate = styled.span`
  font-size: 0.75rem;
  color: #999;
  margin-top: 4px;
`;
