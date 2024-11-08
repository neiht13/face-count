// components/IDCardCapture.js
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../components/ui/button';
import Tesseract from 'tesseract.js';

const IDCardCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState('');

  const captureIDCard = async () => {
    setIsProcessing(true);
    const imageSrc = webcamRef.current.getScreenshot();

    try {
      // Thực hiện OCR
      const { data: { text } } = await Tesseract.recognize(imageSrc, 'vie', {
        logger: (m) => console.log(m), 
      });

      console.log('OCR Text:', text);

      // Trích xuất tên từ kết quả OCR
      const extractedName = extractNameFromText(text);
      setName(extractedName);

      // Trả về ảnh và tên nhân viên
      onCapture(imageSrc, extractedName);
    } catch (error) {
      console.error('Error during OCR:', error);
      alert('Không thể trích xuất tên từ thẻ. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Hàm để xử lý văn bản và lấy tên nhân viên
  const extractNameFromText = (text) => {
    const lines = text.split('\n').map((line) => line.trim()).filter((line) => line);
    console.log('Lines:', lines);

    // Tìm dòng có từ "NHÂN VIÊN" hoặc dòng trên nó
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toUpperCase().includes('NHÂN VIÊN')) {
        return lines[i - 1] || ''; // Lấy dòng phía trên
      }
    }

    // Nếu không tìm thấy, trả về dòng đầu tiên
    return lines.length > 0 ? lines[0] : '';
  };

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: 'environment',
  };

  return (
    <div>
      <h2 className='m-8'>Chụp ảnh thẻ nhân viên</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        width={400}
      />
      <Button className='m-4' onClick={captureIDCard} disabled={isProcessing}>
        {isProcessing ? 'Đang xử lý...' : 'Chụp ảnh thẻ'}
      </Button>
      {name && <p>Tên nhân viên: {name}</p>}
    </div>
  );
};

export default IDCardCapture;
