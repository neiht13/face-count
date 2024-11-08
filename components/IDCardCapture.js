// components/IDCardCapture.js
import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../components/ui/button';

const IDCardCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const captureIDCard = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode:'environment',
  };

  return (
    <div>
      <h2>Chụp ảnh thẻ nhân viên</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        width={400}
      />
      <Button onClick={captureIDCard}>Chụp ảnh thẻ</Button>
    </div>
  );
};

export default IDCardCapture;
