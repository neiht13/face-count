// pages/index.js
import React, { useState } from 'react';
import IDCardCapture from '../components/IDCardCapture';
import FaceCapture from '../components/FaceCapture';
import { compareFaces } from '../utils/faceComparison';
import { Button } from '../components/ui/button';

const HomePage = () => {
  const [idCardImage, setIdCardImage] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [result, setResult] = useState(null);

  const handleIDCardCapture = (image, name) => {
    setIdCardImage(image);
    setEmployeeName(name);
  };

  const handleVerification = async () => {
    setResult('Đang xử lý...');
    try {
      const isMatch = await compareFaces(idCardImage, faceImage);
      setResult(
        isMatch
          ? `Khuôn mặt khớp nhau. Điểm danh thành công cho ${employeeName}!`
          : 'Khuôn mặt không khớp. Vui lòng thử lại.'
      );
    } catch (error) {
      console.error(error);
      setResult('Đã xảy ra lỗi trong quá trình so sánh khuôn mặt.');
    }
  };

  const resetProcess = () => {
    setIdCardImage(null);
    setFaceImage(null);
    setEmployeeName('');
    setResult(null);
  };

  return (
    <div className='text-center gap-4'>
      <h1 className='m-4'>Ứng dụng điểm danh nhân viên</h1>
      {employeeName && <p>Tên nhân viên: {employeeName}</p>}
      {!idCardImage ? (
        <IDCardCapture onCapture={handleIDCardCapture} />
      ) : !faceImage ? (
        <FaceCapture onCapture={setFaceImage} />
      ) : (
        <div>
          <Button  className='m-4' onClick={handleVerification}>Xác minh khuôn mặt</Button>
          {result && <p>{result}</p>}
          <Button  className='m-4' onClick={resetProcess}>Thử lại</Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
