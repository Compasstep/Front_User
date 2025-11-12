// src/pages/reputation/Unreleased.jsx

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

function Unreleased() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: file.name + Date.now(),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      status: 'completed',
      progress: 100,
      fileObject: file,
    }));
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleDeleteFile = (fileId) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  const handleUpload = () => {
    if (uploadedFiles.length === 0) {
      alert('업로드할 파일을 선택해주세요.');
      return;
    }
    
    setIsUploading(true);

    // --- 수정된 부분 ---
    // 2. API가 "shareId"를 반환한다고 가정 (시뮬레이션)
    // (향후 실제 API 응답 response.data.shareId를 사용)
    const fakeShareId = 'new-post-id-12345'; 
    
    setTimeout(() => {
      // 3. shareId를 쿼리 파라미터로 결과 페이지에 전달
      navigate(`/analysis/unreleased/result?shareId=${fakeShareId}`);
    }, 3000);
    // ---
  };

  // 업로드(로딩) 중일 경우 LoadingSpinner를 전체 화면에 표시
  if (isUploading) {
    return <LoadingSpinner title="UPLOADING" time="잠시만 기다려주세요..." />;
  }

  return (
    <PageContainer>
      <PageTitle>YOUR REPUTATION</PageTitle>
      <PageSubtitle>지인에게 내 곡을 평가받으세요</PageSubtitle>

      <UploadPanel>
        <UploaderHeader>
          <div>
            <h3>Upload files</h3>
            <p>Select and upload the files of your choice</p>
          </div>
          <CloseButton>&times;</CloseButton>
        </UploaderHeader>
        
        <FileDropZone onClick={handleChooseFile}>
          <p>Choose a file or drag & drop it here</p>
          <small>MP3 or MP4 formats, up to 50MB</small>
          <BrowseButton>Browse File</BrowseButton>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple style={{ display: 'none' }} />
        </FileDropZone>
        
        <FileList>
          {uploadedFiles.map((file) => (
            <FileItem key={file.id}>
              <FileIcon>ZIP</FileIcon>
              <FileInfo>
                <FileName>{file.name}</FileName>
                <FileMeta>{file.size} • {file.status}</FileMeta>
                {file.status === 'uploading' && (
                  <ProgressBar>
                    <Progress width={file.progress} />
                  </ProgressBar>
                )}
              </FileInfo>
              {file.status === 'uploading' ? 
                <CancelButton>&times;</CancelButton> : 
                <DeleteButton onClick={() => handleDeleteFile(file.id)}>🗑️</DeleteButton>
              }
            </FileItem>
          ))}
        </FileList>

        <UploadButton onClick={handleUpload}>Upload</UploadButton>
      </UploadPanel>
    </PageContainer>
  );
}

// --- styled-components (기존과 동일) ---
const PageContainer = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
// ... (이하 모든 styled-components는 기존과 동일)
const PageTitle = styled.h1`
  font-family: 'Anton', sans-serif;
  font-size: 3rem;
  color: #fff;
`;

const PageSubtitle = styled.p`
  font-family: 'Quicksand', sans-serif;
  color: #aaa;
  margin-bottom: 30px;
`;

const UploadPanel = styled.div`
  background-color: #fff;
  color: #1D2123;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 600px;
`;

const UploaderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  h3 { font-weight: bold; font-size: 18px; }
  p { color: #868e96; font-size: 14px; }
`;

const CloseButton = styled.button`
  background: none; border: none; font-size: 24px;
  color: #adb5bd; cursor: pointer;
`;

const FileDropZone = styled.div`
  border: 2px dashed #DDE2EC;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 20px;
  p { font-weight: bold; }
  small { color: #868e96; display: block; margin: 5px 0 15px; }
`;

const BrowseButton = styled.button`
  background-color: #F1F3F5;
  color: #495057;
  border: 1px solid #DDE2EC;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
`;

const FileList = styled.div`
  margin-bottom: 20px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #e9ecef;
  &:last-child { border-bottom: none; }
`;

const FileIcon = styled.div`
  background-color: #E9ECEF; color: #495057;
  padding: 15px 10px; border-radius: 8px;
  font-size: 14px; font-weight: bold;
`;

const FileInfo = styled.div`
  flex-grow: 1;
`;

const FileName = styled.p` font-weight: bold; `;
const FileMeta = styled.small` color: #868e96; margin: 3px 0; display: block;`;

const ProgressBar = styled.div`
  background-color: #e9ecef;
  border-radius: 10px;
  height: 6px;
  width: 100%;
  overflow: hidden;
`;

const Progress = styled.div`
  width: ${(props) => props.width}%;
  height: 100%;
  background-color: #4285F4;
`;

const DeleteButton = styled.button`
  background: none; border: none; color: #ADB5BD;
  cursor: pointer; font-size: 18px;
`;

const CancelButton = styled(CloseButton)``;

const UploadButton = styled.button`
  background-color: #4285F4;
  color: white;
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  padding: 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background-color: #357ae8; }
`;

export default Unreleased;