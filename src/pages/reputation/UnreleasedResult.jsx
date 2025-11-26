import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const base = import.meta.env.BASE_URL || '/';

function UnreleasedResult() {
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState('주소 복사');

  // ⭐ postId로 변경
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('postId');

  // ⭐ 실제 공유 URL은 /review/{postId}
    const shareUrl = `${window.location.origin}${base}review/${postId}`;

    const copyUrlToClipboard = () => {
        if (!shareUrl) return;

        const onSuccess = () => {
            setButtonText('복사 완료!');
            setTimeout(() => setButtonText('주소 복사'), 2000);
        };

        const onFail = () => {
            setButtonText('복사 실패');
            setTimeout(() => setButtonText('주소 복사'), 2000);
        };

        // 🔹 폴백 복사 함수 (http 환경 / 구형 브라우저 대응)
        const fallbackCopy = () => {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = shareUrl;
                textarea.style.position = 'fixed';
                textarea.style.top = '-9999px';
                document.body.appendChild(textarea);

                textarea.focus();
                textarea.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(textarea);

                if (ok) onSuccess();
                else onFail();
            } catch (e) {
                console.error('fallback copy error:', e);
                onFail();
            }
        };

        // 🔹 https + 지원 브라우저면 Clipboard API 우선 사용
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard
                .writeText(shareUrl)
                .then(onSuccess)
                .catch((err) => {
                    console.error('clipboard error, fallback 사용:', err);
                    fallbackCopy();
                });
        } else {
            // http 환경 등에서는 자동으로 폴백
            fallbackCopy();
        }
    };


  return (
    <Container>
      <ResultBox>
        <Title>평가 링크를 공유하세요</Title>
        <UrlContainer>
          <UrlLabel>공유 URL</UrlLabel>
          <UrlInput type="text" value={shareUrl} readOnly />
          <CopyButton onClick={copyUrlToClipboard}>{buttonText}</CopyButton>
        </UrlContainer>
        <ConfirmButton onClick={() => navigate('/mypage')}>확인</ConfirmButton>
      </ResultBox>
    </Container>
  );
}

/* styled-components 동일 */

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const ResultBox = styled.div`
  background-color: #2a2f32;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  width: 500px;
`;

const Title = styled.h1`
  font-family: 'Anton', sans-serif;
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 30px;
`;

const UrlContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
`;

const UrlLabel = styled.span`
  color: #aaa;
  font-size: 16px;
  white-space: nowrap;
`;

const UrlInput = styled.input`
  flex-grow: 1;
  background-color: #3e4448;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 16px;
`;

const CopyButton = styled.button`
  background-color: #555;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: #777;
  }
`;

const ConfirmButton = styled.button`
  background-color: #4285F4;
  color: white;
  font-size: 18px;
  padding: 12px 0;
  width: 100%;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #357ae8;
  }
`;

export default UnreleasedResult;
