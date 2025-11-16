import styled from "styled-components";

function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <Backdrop>
      <ModalBox>
        <Message>{message}</Message>

        <BtnRow>
          <CancelBtn onClick={onCancel}>취소</CancelBtn>
          <ConfirmBtn onClick={onConfirm}>확인</ConfirmBtn>
        </BtnRow>
      </ModalBox>
    </Backdrop>
  );
}

export default ConfirmModal;

/* ---------- styled ---------- */

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalBox = styled.div`
  background: #fff;
  width: 360px;
  padding: 32px 28px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Message = styled.p`
  font-size: 18px;
  color: #111;
  margin-bottom: 28px;
  text-align: center;
`;

const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelBtn = styled.button`
  padding: 10px 22px;
  border-radius: 8px;
  background: #e4e6eb;
  border: none;
  font-size: 15px;
  cursor: pointer;

  &:hover { background: #d8dadf; }
`;

const ConfirmBtn = styled.button`
  padding: 10px 22px;
  border-radius: 8px;
  background: #0066ff;
  color: #fff;
  border: none;
  font-size: 15px;
  cursor: pointer;

  &:hover { background: #0057dd; }
`;
