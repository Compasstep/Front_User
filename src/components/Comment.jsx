import styled from 'styled-components';

// 다른 사람의 평가 댓글 하나를 표시하는 컴포넌트
function Comment({ comment }) {
  // 숫자인 rating을 별 문자로 변환하는 함수
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <CommentContainer>
      <CommentHeader>
        <Nickname>{comment.nickname}</Nickname>
        <Stars>{renderStars(comment.rating)}</Stars>
      </CommentHeader>
      <CommentText>{comment.text}</CommentText>
    </CommentContainer>
  );
}

// --- styled-components ---

const CommentContainer = styled.div`
  background-color: #3e4448;
  border-radius: 8px;
  padding: 15px;
  text-align: left;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Nickname = styled.span`
  font-weight: bold;
  color: #fff;
`;

const Stars = styled.span`
  color: #FACD66;
  font-size: 14px;
`;

const CommentText = styled.p`
  color: #ddd;
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;

export default Comment;