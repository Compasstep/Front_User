import { useState } from 'react'; // 1. useState import
import styled from 'styled-components';
import useUserStore from '../../store/userStore.js';
import Modal from '../../components/Modal.jsx'; // 2. Modal 컴포넌트 import
import ImageUploader from '../../components/ImageUploader.jsx';

function ProfileEditPage() {
    const { user } = useUserStore();
    const [isModalOpen, setIsModalOpen] = useState(false); // 3. 모달 상태 추가

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <Container>
      <EditBox>
        <Title>프로필 수정</Title>
        {/* 4. 이미지 컨테이너 클릭 시 openModal 함수 실행 */}
        <ProfileImageContainer onClick={openModal}>
          <ProfileImage />
          <EditIcon>✏️</EditIcon>
        </ProfileImageContainer>
        <UserName>{user?.name || '사용자 이름'}</UserName>
        <UserEmail>{user?.email || 'user@example.com'}</UserEmail>
      </EditBox>
      
      {/* 5. Modal 컴포넌트 추가 */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ImageUploader />
      </Modal>
    </Container>
  );
}

// --- styled-components ---

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
`;

const EditBox = styled.div`
  width: 400px;
  background-color: #2a2f32;
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 30px;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  cursor: pointer;
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #555;
  /* 나중에 실제 이미지로 교체 */
`;

const EditIcon = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #fff;
  color: #000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserName = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const UserEmail = styled.p`
  font-size: 16px;
  color: #aaa;
`;


export default ProfileEditPage;