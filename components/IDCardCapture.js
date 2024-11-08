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
      const worker = Tesseract.createWorker({
        logger: m => console.log(m), // Theo dõi tiến trình OCR
        langPath: '/tesseract-lang', // Đường dẫn tới thư mục chứa tệp ngôn ngữ
      });

      await worker.load();
      await worker.loadLanguage('vie');
      await worker.initialize('vie');

      const { data: { text } } = await worker.recognize(imageSrc);

      await worker.terminate();

      console.log('Text recognized:', text);

      // Xử lý văn bản để lấy tên nhân viên
      const extractedName = extractNameFromText(text);
      setName(extractedName);

      // Trả về ảnh và tên nhân viên
      onCapture(imageSrc, extractedName);
    } catch (error) {
      console.error('Error during OCR:', error);
      alert('Không thể trích xuất tên từ thẻ. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }12
  };

  // Hàm để xử lý văn bản và lấy tên nhân viên
  const extractNameFromText = (text) => {
    // Giả sử tên nhân viên nằm trên dòng có từ "Name" hoặc "Tên"
    const lines = text.split('\n');
    for (let line of lines) {
      console.log('line ', line );
      
      if (line.toLowerCase().includes('name') || line.toLowerCase().includes('tên')) {
        // Lấy phần sau từ "Name" hoặc "Tên"
        const nameLine = line.split(':')[1] || line.split(' ')[1] || line;
        return nameLine.trim();
      }
    }
    // Nếu không tìm thấy, trả về dòng đầu tiên
    return lines[0].trim();
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
