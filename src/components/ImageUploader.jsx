import { useState } from 'react';
import styled from 'styled-components';

function ImageUploader() {
  // 선택된 파일과 미리보기 URL을 저장할 상태
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // FileReader를 사용해 이미지 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('이미지를 선택해주세요.');
      return;
    }
    // 여기에 실제 서버로 파일을 업로드하는 로직이 들어갑니다. (지금은 alert로 대체)
    alert(`${selectedFile.name} 파일을 업로드합니다.`);
  };

  return (
    <UploaderContainer>
      <Title>프로필 수정</Title>
      <PreviewBox onClick={() => document.getElementById('fileInput').click()}>
        {preview ? (
          <ImagePreview src={preview} alt="Preview" />
        ) : (
          <UploadPlaceholder>
            <p>➕</p>
            <p>이미지 업로드</p>
          </UploadPlaceholder>
        )}
      </PreviewBox>
      <FileInput
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <UploadButton onClick={handleUpload}>Upload</UploadButton>
    </UploaderContainer>
  );
}

// --- styled-components ---

const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h2`
  font-family: 'Anton', sans-serif;
`;

const PreviewBox = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 12px;
  background-color: #3e4448;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden; /* 이미지가 상자를 넘어가지 않도록 */
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 상자에 꽉 차도록 */
`;

const UploadPlaceholder = styled.div`
  color: #aaa;
  text-align: center;
  font-size: 18px;
`;

const FileInput = styled.input`
  display: none; /* 실제 input은 숨기고 PreviewBox를 클릭하도록 유도 */
`;

const UploadButton = styled.button`
  background-color: #4285F4;
  color: white;
  font-size: 18px;
  padding: 12px 100px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #357ae8;
  }
`;

export default ImageUploader;