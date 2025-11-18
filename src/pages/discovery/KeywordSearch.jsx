import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmotionPicker, { EMOTIONS } from '../../components/EmotionPicker.jsx';

const BASE_URL = import.meta.env.BASE_URL;
function KeywordSearch() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('idle');
  const [emotionId, setEmotionId] = useState(null);
  const navigate = useNavigate();

  const selectedLabel = useMemo(
    () => EMOTIONS.find(e => e.id === emotionId)?.label || '',
    [emotionId]
  );

  const handleSearch = () => {
    const q = (keyword || '').trim();
    if (!q) return alert('키워드를 입력해주세요.');
    setStatus('loading');

    const qs = new URLSearchParams();
    qs.set('q', q);
    if (selectedLabel) qs.set('e', selectedLabel);

    setTimeout(() => {
      navigate(`/discovery/keyword/results?${qs.toString()}`);
    }, 200);
  };

  if (status === 'loading') return <LoadingSpinner />;

  return (
    <Container>
      <Content>
        <Title>키워드를 입력하고 인사이트를 확인하세요</Title>

        <SearchWrapper>
            <DecorativeImage src={`${BASE_URL}keyword.png`} alt="decorative" />
          <InputColumn>
            <InputGroup>
              <SearchInput
                type="text"
                placeholder="# (아티스트/곡/장르)로 레퍼런스를 탐색해보세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <SearchButton onClick={handleSearch} aria-label="검색">→</SearchButton>
            </InputGroup>

            {/* 검색창 바로 아래 인라인 EmotionPicker */}
            <InlinePickerWrap>
              <EmotionPicker
                value={emotionId}
                onChange={setEmotionId}
                onPick={(_, label) => setKeyword(label)} // 클릭하면 검색창에 감정 쓰기
                size="sm"
                columns={6}
                showHeader={false}
              />
            </InlinePickerWrap>
          </InputColumn>
        </SearchWrapper>
      </Content>
    </Container>
  );
}

export default KeywordSearch;

/* styles */
const fadeInDown = keyframes`from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}`;
const fadeInUp   = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;

const Container = styled.div`
  min-height:100vh; display:flex; justify-content:center; align-items:center;
    background-image: url('${BASE_URL}background.png'); background-size:cover; background-position:center;
`;
const Content = styled.div`display:flex; flex-direction:column; align-items:center; position:relative; z-index:1;`;
const Title = styled.h2`
  font-family:'Quicksand',sans-serif; color:#FACD66; font-size:30px; margin-bottom:24px;
  animation:${fadeInDown} .8s ease-out;
`;
const SearchWrapper = styled.div`
  display:flex; flex-direction:row; align-items:flex-start; gap:30px;
  animation:${fadeInUp} .8s ease-out;
`;
const DecorativeImage = styled.img`
  width:300px; height:300px; border-radius:24px; object-fit:cover;
  transition:transform .3s ease-in-out; &:hover{ transform:scale(1.05); }
`;
const InputColumn = styled.div`
  display:flex; flex-direction:column; align-items:stretch; gap:12px; width:min(820px, 92vw);
`;
const InputGroup = styled.div`
  display:flex; align-items:center; background-color:rgba(40,40,40,.8); border-radius:50px;
  padding:10px 15px 10px 25px; backdrop-filter:blur(5px); transition:box-shadow .3s ease-in-out;
  &:focus-within { box-shadow:0 0 0 2px #FACD66; }
`;
const SearchInput = styled.input`
  background:transparent; border:none; color:#fff; font-size:18px; width:100%; min-width:360px; outline:none;
  &::placeholder{ color:#888; }
`;
const SearchButton = styled.button`
  background:none; border:none; color:#fff; font-size:30px; cursor:pointer; padding-left:15px;
  transition:color .3s; &:hover{ color:#FACD66; }
`;
const InlinePickerWrap = styled.div`width:100%;`;
