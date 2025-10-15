import styled from 'styled-components';

// Modal 컴포넌트는 `isOpen`, `onClose`, `children` 세 가지를 props로 받습니다.
// isOpen: 모달이 열려있는지 여부 (true/false)
// onClose: 모달을 닫는 함수
// children: 모달 내부에 보여줄 내용
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // isOpen이 false이면 아무것도 렌더링하지 않음

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
}

// --- styled-components ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #2a2f32;
  padding: 20px;
  border-radius: 16px;
  position: relative;
  width: 400px;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
`;

export default Modal;