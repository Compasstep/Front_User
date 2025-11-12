// src/pages/profile/ProfileEditPage.jsx
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore.js';
import Modal from '../../components/Modal.jsx';

function ProfileEditPage() {
  const navigate = useNavigate();
  const store = useUserStore();
  const user = store?.user ?? {};

  // 폼 상태
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoUrl, setPhotoUrl] = useState(user?.avatarUrl || '');

  // UI 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);

  // 모달 미리보기
  const [modalPreview, setModalPreview] = useState('');
  const fileInputRef = useMemo(() => ({ current: null }), []);

  // user 값 변하면 폼 초기화
  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhotoUrl(user?.avatarUrl || '');
  }, [user?.name, user?.email, user?.avatarUrl]);

  // 변경 여부 추적
  useEffect(() => {
    const changed =
      (user?.name || '') !== name ||
      (user?.email || '') !== email ||
      (user?.avatarUrl || '') !== photoUrl; // ✅ avatarUrl로 비교
    setDirty(changed);
  }, [name, email, photoUrl, user?.name, user?.email, user?.avatarUrl]); // ✅ avatarUrl로 비교

  // 페이지 이탈(새로고침/닫기) 경고
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  // 모달 열기/닫기
  const openModal = () => {
    setModalPreview(photoUrl || '');
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // 파일 선택 트리거
  const handleChooseFile = () => fileInputRef.current?.click();

  // ✅ 파일을 Data URL(Base64)로 변환하는 헬퍼
  const readAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ✅ 파일 선택 처리 (Data URL로 저장)
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readAsDataURL(file);
      setModalPreview(dataUrl);
      setPhotoUrl(dataUrl);
      setMessage('프로필 사진이 임시로 적용되었습니다. 저장을 눌러 확정하세요.');
    } catch (err) {
      console.error(err);
      setMessage('이미지 로딩 중 오류가 발생했습니다.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 뒤로가기(취소) 동작
  const handleBack = () => {
    if (!dirty) return navigate(-1);
    if (confirm('저장하지 않은 변경 사항이 있습니다. 나가시겠어요?')) {
      navigate(-1);
    }
  };

  // 저장
  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await Promise.resolve(store.updateProfile({
        name,
        email,
        avatarUrl: photoUrl, // ✅ store는 avatarUrl을 표준키로 사용
      }));

    setMessage('저장되었습니다.');
    setTimeout(() => navigate(-1), 600);
  } catch (err) {
    console.error(err);
    setMessage('저장 중 오류가 발생했습니다.');
  } finally {
    setIsSaving(false);
  }
};


  // --- 🚨 여기가 수정되었습니다 ---
  // 변경 취소
  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhotoUrl(user?.avatarUrl || ''); // ✅ photoUrl -> avatarUrl
    setMessage('변경 사항을 취소했습니다.');
  };

  return (
    <Container>
      <EditBox>
        {/* 상단 바: 뒤로가기 + 제목 */}
        <TopBar>
          <BackButton type="button" onClick={handleBack} aria-label="뒤로가기">⬅︎</BackButton>
          <Title>프로필 수정</Title>
          <Spacer />
        </TopBar>

        {/* 아바타 */}
        <ProfileImageContainer onClick={openModal} title="프로필 이미지 변경">
          <ProfileImage $src={photoUrl} />
          <EditIcon>✏️</EditIcon>
        </ProfileImageContainer>

        {/* 폼 */}
        <FormGroup>
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
          />
        </FormGroup>

        {message && <HelperText>{message}</HelperText>}

        <Actions>
          <SecondaryButton type="button" onClick={handleCancel} disabled={isSaving}>
            취소
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중…' : '저장'}
          </PrimaryButton>
        </Actions>
      </EditBox>

      {/* 이미지 업로드 모달 */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="프로필 수정">
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

          <UploadButton type="button" onClick={handleChooseFile}>
            Upload
          </UploadButton>
        </UploaderBox>
      </Modal>
    </Container>
  );
}

/* ===================== styled-components (기존과 동일) ===================== */

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

/* ====== Modal 내부 업로더 ====== */

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