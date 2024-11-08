// components/FaceCapture.js
import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../components/ui/button';

const FaceCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const captureFace = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  return (
    <div>
      <h2  className='m-4' >Chụp ảnh khuôn mặt hiện tại</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
      />
      <Button className='m-4' onClick={captureFace}>Chụp ảnh khuôn mặt</Button>
    </div>
  );
};

export default FaceCapture;
