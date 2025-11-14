import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { requestPresignedUrl, uploadToS3 } from "../api/s3";  // ★ 추가

function ImageUploader({ onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // presigned URL 요청 + 실제 업로드 + 최종 URL 부모에게 전달
  const handleUpload = async () => {
    if (!selectedFile) return alert("이미지를 선택해주세요.");

    try {
      // 1) presigned URL 요청
      const { presignedUrl, fileUrl } = await requestPresignedUrl(
        selectedFile.name,
        selectedFile.type
      );

      // 2) 파일 업로드
      await uploadToS3(presignedUrl, selectedFile);

      // 3) 업로드 완료 후 부모에게 최종 이미지 URL 전달
      if (onUploadComplete) {
        onUploadComplete(fileUrl);
      }
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <UploaderContainer>
      <Title>프로필 사진 업로드</Title>

      <PreviewBox onClick={() => document.getElementById('fileInput').click()}>
        {preview ? <ImagePreview src={preview} /> : (
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

const UploaderContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 20px;
`;
const Title = styled.h2`font-family: 'Anton', sans-serif;`;
const PreviewBox = styled.div`
  width: 250px; height: 250px; background: #3e4448;
  border-radius: 12px; display: flex; justify-content: center; align-items: center;
  cursor: pointer; overflow: hidden;
`;
const ImagePreview = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`;
const UploadPlaceholder = styled.div`color: #aaa; text-align: center; font-size: 18px;`;
const FileInput = styled.input`display: none;`;
const UploadButton = styled.button`
  background-color: #4285F4; color: white; font-size: 18px;
  padding: 12px 100px; border: none; border-radius: 8px; cursor: pointer;
  &:hover { background-color: #357ae8; }
`;

export default ImageUploader;
