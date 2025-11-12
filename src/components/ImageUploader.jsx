import React, { useRef, useState } from 'react';
import styled from 'styled-components';

// 1. 부모로부터 onUpload, onChange props를 받습니다.
function ImageUploader({ onUpload, onChange }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // 내부 미리보기 업데이트
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. 'Upload' 버튼 클릭 시 실행되는 함수
  const handleUpload = () => {
    if (!selectedFile || !preview) {
      alert('이미지를 선택해주세요.');
      return;
    }
    
    // 3. alert 대신, 부모 컴포넌트(ProfileEditPage)의
    //    handleImageFromUploader 함수를 호출합니다.
    if (onUpload) {
      onUpload(preview); // preview (dataURL)을 전달
    }
    if (onChange) {
      onChange(preview); // onChange도 동일하게 전달
    }
    
    // ProfileEditPage의 handleImageFromUploader가
    // setPhotoUrl, setMessage, closeModal을 모두 처리해줄 것입니다.
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
      {/* 4. 이 버튼이 이제 handleUpload를 호출 (기존과 동일) */}
      <UploadButton onClick={handleUpload}>Upload</UploadButton>
    </UploaderContainer>
  );
}

// --- styled-components (기존과 동일) ---

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
  overflow: hidden;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadPlaceholder = styled.div`
  color: #aaa;
  text-align: center;
  font-size: 18px;
`;

const FileInput = styled.input`
  display: none;
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