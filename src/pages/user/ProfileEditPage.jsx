// src/pages/profile/ProfileEditPage.jsx
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore.js';
import Modal from '../../components/Modal.jsx';
import api from "../../api/client";

// S3 업로드 유틸
import { requestPresignedUrl, uploadToS3 } from "../../api/s3";

function ProfileEditPage() {
  const navigate = useNavigate();
  const store = useUserStore();
  const user = store?.user ?? {};

  const [name, setName] = useState(user?.nickname || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoUrl, setPhotoUrl] = useState(
    user?.profileImageUrl || user?.avatarUrl || ''
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);

  const [modalPreview, setModalPreview] = useState('');
  const fileInputRef = useMemo(() => ({ current: null }), []);

  // 사용자 초기값 반영 (store.user 변경 시 동기화)
  useEffect(() => {
    setName(user?.nickname || user?.name || '');
    setEmail(user?.email || '');
    setPhotoUrl(user?.profileImageUrl || user?.avatarUrl || '');
  }, [user?.nickname, user?.name, user?.email, user?.profileImageUrl, user?.avatarUrl]);

  // 변경 감지
  useEffect(() => {
    const originName = user?.nickname || user?.name || '';
    const originPhoto = user?.profileImageUrl || user?.avatarUrl || '';
    const changed =
      originName !== name ||
      originPhoto !== photoUrl;
    setDirty(changed);
  }, [name, photoUrl, user?.nickname, user?.name, user?.profileImageUrl, user?.avatarUrl]);

  const openModal = () => {
    setModalPreview(photoUrl || '');
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleChooseFile = () => fileInputRef.current?.click();

  /**
   * 프로필 이미지 업로드 절차
   * 1) presigned URL 요청
   * 2) S3 PUT 업로드
   * 3) fileKey(photoUrl) 로 상태 업데이트
   */
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 미리보기
      const reader = new FileReader();
      reader.onloadend = () => setModalPreview(reader.result);
      reader.readAsDataURL(file);

      // 1) Presigned URL 요청 (fileType, contentType 등은 s3.js 에서 구성)
      const { presignedUrl, fileUrl, fileKey } = await requestPresignedUrl(file);

      // 2) S3 업로드
      await uploadToS3(presignedUrl, file);

      // 3) photoUrl 갱신
      //    - 백엔드가 fileKey 를 받으므로, fileKey > fileUrl 순으로 사용
      const key = fileKey || fileUrl;
      setPhotoUrl(key);
      setMessage("프로필 사진이 업로드되었습니다. 저장을 눌러 확정하세요.");
      closeModal();
    } catch (err) {
      console.error(err);
      setMessage("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleBack = () => {
    if (!dirty) return navigate(-1);
    if (confirm('저장하지 않은 변경 사항이 있습니다. 나가시겠어요?')) {
      navigate(-1);
    }
  };

  const handleSave = async () => {
    if (!dirty) {
      setMessage('변경된 내용이 없습니다.');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      // 1) 닉네임 먼저 PATCH
      if (name !== user?.nickname && name !== user?.name) {
        await api.patch("/user/profile/nickname", {
          nickname: name,
        });
      }

      // 2) 이미지 다음에 PATCH
      if (photoUrl && photoUrl !== (user?.profileImageUrl || user?.avatarUrl)) {
        await api.patch("/user/profile/image", {
          fileKey: photoUrl,
        });
      }

      // 3) 최신 프로필 다시 GET
      const res = await api.get("/user/profile/info");
      const updated = res?.data?.result;

      // 4) 전역 상태 갱신
      store.setLoginState({
        isLoggedIn: true,
        user: updated,
      });

      // 5) 로컬 상태도 최신화
      setName(updated?.nickname || updated?.name || "");
      setEmail(updated?.email || "");
      setPhotoUrl(updated?.profileImageUrl || updated?.avatarUrl || "");

      setMessage("저장되었습니다.");
      setTimeout(() => navigate(-1), 600);

    } catch (err) {
      console.error(err);
      setMessage(err?.message || "저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.nickname || user?.name || '');
    setEmail(user?.email || '');
    setPhotoUrl(user?.profileImageUrl || user?.avatarUrl || '');
    setMessage('변경 사항을 취소했습니다.');
  };

  return (
    <Container>
      <EditBox>
        <TopBar>
          <BackButton type="button" onClick={handleBack}>⬅︎</BackButton>
          <Title>프로필 수정</Title>
          <Spacer />
        </TopBar>

        <ProfileImageContainer onClick={openModal}>
          <ProfileImage $src={photoUrl && (user?.profileImageUrl || user?.avatarUrl || photoUrl)} />
          <EditIcon>✏️</EditIcon>
        </ProfileImageContainer>

        <FormGroup>
          <Label>닉네임</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>이메일</Label>
          <Input value={email} disabled />
        </FormGroup>

        {message && <HelperText>{message}</HelperText>}

        <Actions>
          <SecondaryButton onClick={handleCancel} disabled={isSaving}>취소</SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중…' : '저장'}
          </PrimaryButton>
        </Actions>
      </EditBox>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="프로필 사진 변경">
        <UploaderBox>
          <Preview $src={modalPreview}>
            {!modalPreview && <Placeholder>이미지 업로드</Placeholder>}
          </Preview>

          <HiddenFileInput
            ref={(el) => (fileInputRef.current = el)}
            type="file"
            accept="image/*"
            onChange={handleFileSelected}
          />

          <UploadButton onClick={handleChooseFile}>이미지 선택</UploadButton>
        </UploaderBox>
      </Modal>
    </Container>
  );
}

/* ----- styled-components (기존 그대로 유지) ----- */
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 16px;
`;

const EditBox = styled.div`
  width: 420px;
  background-color: #2a2f32;
  border-radius: 16px;
  padding: 24px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
`;

const TopBar = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  margin-bottom: 8px;
`;

const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #3a3f43;
  background: #1d2123;
  color: #facd66;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  &:hover { background: #23282b; }
`;

const Spacer = styled.div``;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  color: #fff;
  text-align: center;
`;

const ProfileImageContainer = styled.button`
  position: relative;
  margin: 8px 0 18px;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 0;

  &:focus-visible {
    outline: 2px solid #facd66;
    outline-offset: 4px;
    border-radius: 50%;
  }
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #555;
  background-image: ${(p) => (p.$src ? `url("${p.$src}")` : 'none')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 3px solid rgba(255,255,255,0.15);
  overflow: hidden;
`;

const EditIcon = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: #fff;
  color: #000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.35);
`;

const FormGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 10px 0;
`;

const Label = styled.label`
  font-size: 13px;
  color: #cbd5e1;
`;

const Input = styled.input`
  height: 42px;
  border-radius: 10px;
  border: 1px solid #40464a;
  background: #1d2123;
  color: #fff;
  padding: 0 14px;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #facd66;
    box-shadow: 0 0 0 3px rgba(250, 205, 102, 0.15);
  }

  &::placeholder {
    color: #7c848b;
  }
`;

const HelperText = styled.p`
  width: 100%;
  margin: 8px 0 0;
  font-size: 12px;
  color: #facd66;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 18px;
  align-self: flex-end;
`;

const PrimaryButton = styled.button`
  background: #facd66;
  color: #111;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const SecondaryButton = styled.button`
  background: #3a3f43;
  color: #e5e7eb;
  border: 1px solid #4a5054;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const UploaderBox = styled.div`
  width: 400px;
  max-width: 80vw;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Preview = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background: #2e3438;
  background-image: ${(p) => (p.$src ? `url("${p.$src}")` : 'none')};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #3b4044;
  display: grid;
  place-items: center;
  color: #9aa2a8;
  overflow: hidden;
`;

const Placeholder = styled.span`
  font-size: 18px;
  color: #9aa2a8;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 10px;
  background: #5c83ff;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:hover { filter: brightness(1.02); }
`;

export default ProfileEditPage;