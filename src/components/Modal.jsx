import styled from 'styled-components';
import { useEffect } from 'react';

// children: 모달 안에 표시될 내용
// isOpen: 모달이 열렸는지 여부
// onClose: 모달을 닫는 함수
function Modal({ children, isOpen, onClose }) {
  // 모달이 열렸을 때, 스크롤바를 숨겨서 배경이 움직이지 않게 함
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    // 모달이 닫힐 때, 스크롤바를 다시 표시
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // isOpen이 false면 아무것도 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  // 모달 뒷배경(Backdrop)을 클릭해도 닫히도록 함
  const handleBackdropClick = (e) => {
    // 모달 컨텐츠(e.currentTarget)가 아닌 배경(e.target)을 클릭했을 때만 닫기
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContainer>
    </Backdrop>
  );
}

/* ---------------- styled-components ---------------- */

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background-color: #2a2f32;
  color: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  min-width: 300px; /* 최소 너비 */
  max-width: 90%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: #888;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #fff;
  }
`;

export default Modal;