import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore.js';
import api from '../../api/client';   // ★ 추가됨
import { showToast } from "../../utils/globalToast";

const BASE_URL = import.meta.env.BASE_URL;

export default function Withdraw() {
  const [agree, setAgree] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUserStore();

  // 1단계 버튼 클릭 → 확인 모달 오픈
  const handleClickWithdraw = () => {
    if (!agree) return;
    setOpenConfirm(true);
  };

  const handleWithdrawConfirm = async () => {
  try {
    // ★ 실제 서버는 DELETE임 (POST 아님)
    await api.delete('/user/auth/signout');

    await logout();
    localStorage.removeItem('cs-auth');
    navigate('/login', { replace: true });
  } catch (err) {
    console.error(err);
    showToast('탈퇴 중 오류가 발생했습니다.');
  }
};


  return (
    <Wrap>
      <PageTitle>탈퇴하기</PageTitle>

      <Card>
        <LogoBadge>
            <img src={`${BASE_URL}logo.png`} alt="Compassstep" />
        </LogoBadge>

        <CardTitle>Compassstep 탈퇴 전 확인하세요.</CardTitle>

        <CardDesc>
          탈퇴하시면 이용 중인 Compassstep이 폐쇄되며,<br />
          모든 데이터는 복구가 불가능합니다.
        </CardDesc>
      </Card>

      <Bullets>
        <li>평판 분석, 프로필 등 모든 정보가 삭제됩니다.</li>
        <li>다른 아티스트의 댓글은 삭제되지 않으니 미리 확인하세요.</li>
      </Bullets>

      <AgreePanel>
        <AgreeRow htmlFor="withdraw-agree">
          <CheckBox
            id="withdraw-agree"
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <AgreeLabel>안내사항을 모두 확인하였습니다. 이에 동의합니다.</AgreeLabel>
        </AgreeRow>

        <DangerButton
          type="button"
          disabled={!agree}
          aria-disabled={!agree}
          onClick={handleClickWithdraw}
        >
          탈퇴하기
        </DangerButton>
      </AgreePanel>

      {/* 확인 모달 */}
      {openConfirm && (
        <ModalBackdrop onClick={() => setOpenConfirm(false)} aria-hidden="true">
          <ModalCard
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="withdraw-confirm-title"
          >
            <ModalHeader id="withdraw-confirm-title">
              정말 탈퇴하시겠습니까 ?
            </ModalHeader>
            <ModalSub>Compassstep을 떠난다니 아쉬워요🥲</ModalSub>

            <ModalBody>
              <ul>
                <li>탈퇴 즉시 계정 및 데이터가 복구 불가로 삭제됩니다.</li>
                <li>진행 중인 분석, 설정, 프로필 정보도 함께 삭제됩니다.</li>
              </ul>
            </ModalBody>

            <ModalActions>
              <ModalSecondary onClick={() => setOpenConfirm(false)}>
                취소
              </ModalSecondary>
              <ModalDanger onClick={handleWithdrawConfirm}>
                정말 탈퇴하기
              </ModalDanger>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      )}
    </Wrap>
  );
}

/* ==================== styled-components ==================== */

const Wrap = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 56px 20px 80px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 24px;
`;

const Card = styled.section`
  background: #2a2f32;
  border: 1px solid #3a4146;
  border-radius: 12px;
  padding: 28px 24px 26px;
  display: grid;
  justify-items: center;
  row-gap: 18px;
`;

const LogoBadge = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 12px;
  background: #1f2427;
  display: grid;
  place-items: center;
  img {
    width: 44px;
    height: 44px;
    object-fit: contain;
  }
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 220px;
    max-width: 80%;
    height: 2px;
    margin: 10px auto 0;
    background: #ffffff;
    opacity: 0.7;
  }
`;

const CardDesc = styled.p`
  margin: 0;
  text-align: center;
  color: #d1d5db;
  line-height: 1.6;
  font-size: 15px;
`;

const Bullets = styled.ul`
  margin: 24px 0 0;
  padding-left: 20px;
  color: #e5e7eb;
  line-height: 1.75;
  li {
    list-style: disc;
    margin: 6px 0;
  }
`;

const AgreePanel = styled.section`
  margin-top: 18px;
  background: #2a2f32;
  border: 1px solid #3a4146;
  border-radius: 12px;
  padding: 18px;
`;

const AgreeRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  cursor: pointer;
`;

const CheckBox = styled.input`
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid #8b939a;
  background: #1d2123;
  position: relative;

  &:checked {
    border-color: #facd66;
    background: #facd66;
  }

  &:checked::after {
    content: "✓";
    position: absolute;
    top: -1px;
    left: 3px;
    font-size: 14px;
    color: #111;
    font-weight: 800;
    line-height: 18px;
  }
`;

const AgreeLabel = styled.span`
  color: #e5e7eb;
  font-size: 14px;
`;

const DangerButton = styled.button`
  width: 140px;
  height: 42px;
  border: none;
  border-radius: 999px;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
  transition: filter 0.15s ease, opacity 0.15s ease, transform 0.06s ease;
  background: linear-gradient(180deg, #ff6a5a 0%, #e14c3d 100%);
  box-shadow: 0 6px 18px rgba(225, 76, 61, 0.35);

  &:hover { filter: brightness(1.02); }
  &:active { transform: translateY(1px); }

  &[disabled],
  &[aria-disabled="true"] {
    background: #3b4146;
    color: #b8c0c7;
    box-shadow: none;
    cursor: default;
    pointer-events: none;
    opacity: 0.75;
  }
`;

/* ===== 모달 ===== */

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: grid;
  place-items: center;
  z-index: 9999;
`;

const ModalCard = styled.div`
  width: 480px;
  max-width: 92vw;
  background: #2a2f32;
  border: 1px solid #3a4146;
  border-radius: 14px;
  padding: 22px 20px 18px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.35);
`;

const ModalHeader = styled.h3`
  margin: 0 0 8px;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
`;

const ModalSub = styled.p`
  margin: 0 0 12px;
  color: #d1d5db;
`;

const ModalBody = styled.div`
  color: #e5e7eb;
  font-size: 14px;
  line-height: 1.7;
  ul { padding-left: 18px; }
  li { list-style: disc; margin: 4px 0; }
`;

const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ModalSecondary = styled.button`
  min-width: 92px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #4a5054;
  background: #3a3f43;
  color: #e5e7eb;
  cursor: pointer;
  &:hover { filter: brightness(1.03); }
`;

const ModalDanger = styled.button`
  min-width: 120px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #ff6a5a 0%, #e14c3d 100%);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(225, 76, 61, 0.35);
  &:hover { filter: brightness(1.03); }
  &:active { transform: translateY(1px); }
`;
