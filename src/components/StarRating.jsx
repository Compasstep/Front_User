import { useState } from 'react';
import styled from 'styled-components';

// 별점 입력을 위한 재사용 컴포넌트
function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <StarContainer>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
            />
            <Star
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              $isActive={ratingValue <= (hover || rating)}
            >
              ★
            </Star>
          </label>
        );
      })}
    </StarContainer>
  );
}

// --- styled-components ---

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;

  input[type='radio'] {
    display: none;
  }
`;

const Star = styled.span`
  cursor: pointer;
  font-size: 40px;
  color: ${(props) => (props.$isActive ? '#FACD66' : '#ccc')};
  transition: color 0.2s ease-in-out;
`;

export default StarRating;