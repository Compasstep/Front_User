import styled from 'styled-components';
import { Link } from 'react-router-dom'; // 1. Link import 추가

// 나중에 API로 받아올 가짜 데이터
const mockReputationData = [
  { id: 1, title: 'LOVE YOURSELF', artist: 'BTS' },
  { id: 2, title: 'Proof', artist: 'BTS' },
  { id: 3, title: '화양연화 Young Forever', artist: 'BTS' },
];

const mockFriendData = [
  { id: 1, title: 'Dynamite.zip' },
  { id: 2, title: '봄날.zip' },
];

const mockLyricsData = [
    { id: 1, title: '꿈과 책과 힘과 벽.zip', artist: '잔나비' },
    { id: 2, title: 'Black Swan.zip', artist: 'BTS' },
];


function MyPage() {
  return (
    <MyPageContainer>
      <TitleContainer> {/* 2. 제목과 링크를 묶을 컨테이너 추가 */}
        <PageTitle>MY PAGE</PageTitle>
        <EditProfileLink to="/profile/edit">프로필 수정</EditProfileLink> {/* 3. 링크 추가 */}
      </TitleContainer>
      <Section>
        <SectionTitle>발매곡 평판 분석 조회</SectionTitle>
        <List>
          {mockReputationData.map((item) => (
            <ListItem key={item.id}>
              <span>{item.title} - {item.artist}</span>
              <div>
                <Button>평판 재확인</Button>
                <Button>삭제</Button>
              </div>
            </ListItem>
          ))}
        </List>
      </Section>
      <Section>
        <SectionTitle>미발매곡 - 지인평가 조회</SectionTitle>
        <List>
          {mockFriendData.map((item) => (
            <ListItem key={item.id}>
              <span>{item.title}</span>
              <div>
                <Button>확인</Button>
                <Button>삭제</Button>
              </div>
            </ListItem>
          ))}
        </List>
      </Section>
       <Section>
        <SectionTitle>가사 분석 결과 조회</SectionTitle>
        <List>
          {mockLyricsData.map((item) => (
            <ListItem key={item.id}>
              <span>{item.title} - {item.artist}</span>
              <div>
                <Button>조회</Button>
                <Button>삭제</Button>
              </div>
            </ListItem>
          ))}
        </List>
      </Section>
    </MyPageContainer>
  );
}

// --- styled-components ---

const MyPageContainer = styled.div`
  padding: 40px;
`;

// 4. 새로운 styled-components 추가
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const PageTitle = styled.h1`
  font-size: 48px;
  margin-bottom: 0; /* TitleContainer에서 margin을 관리하므로 제거 */
`;

const EditProfileLink = styled(Link)`
  color: #aaa;
  font-size: 16px;
  &:hover {
    color: #fff;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  border-bottom: 1px solid #555;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style: none;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #444;

  span {
    font-size: 18px;
  }
`;

const Button = styled.button`
  background-color: #555;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #777;
  }
`;

export default MyPage;