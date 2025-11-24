// Toast 컴포넌트 파일
import { useEffect } from 'react';
import styled from 'styled-components';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2600);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastBox>
      {message}
    </ToastBox>
  );
}

const ToastBox = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4e4e;
  color: white;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 15px;
  z-index: 9999;
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`;
