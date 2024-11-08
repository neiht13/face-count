// pages/index.js
import React, { useState } from 'react';
import IDCardCapture from '../components/IDCardCapture';
import FaceCapture from '../components/FaceCapture';
import { compareFaces } from '../utils/faceComparison';
import { Button } from '../components/ui/button';

const HomePage = () => {
  const [idCardImage, setIdCardImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleVerification = async () => {
    setResult('Đang xử lý...');
    try {
      const isMatch = await compareFaces(idCardImage, faceImage);
      setResult(isMatch ? 'Khuôn mặt khớp nhau. Điểm danh thành công!' : 'Khuôn mặt không khớp. Vui lòng thử lại.');
    } catch (error) {
      console.error(error);
      setResult('Đã xảy ra lỗi trong quá trình so sánh khuôn mặt.');
    }
  };

  const resetProcess = () => {
    setIdCardImage(null);
    setFaceImage(null);
    setResult(null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Ứng dụng điểm danh nhân viên</h1>
      {!idCardImage ? (
        <IDCardCapture onCapture={setIdCardImage} />
      ) : !faceImage ? (
        <FaceCapture onCapture={setFaceImage} />
      ) : (
        <div>
          <Button onClick={handleVerification}>Xác minh khuôn mặt</Button>
          {result && <p>{result}</p>}
          <Button onClick={resetProcess}>Thử lại</Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
