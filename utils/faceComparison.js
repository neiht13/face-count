// utils/faceComparison.js

/**
 * Compare two face images using face-api.js
 * @param {string} image1 - Base64 or URL of the first image
 * @param {string} image2 - Base64 or URL of the second image
 * @returns {Promise<boolean>} - Returns true if faces are similar, else false
 */
export const compareFaces = async (image1, image2) => {
    // Ensure this code runs only on the client side
    if (typeof window === 'undefined') {
      throw new Error('Face comparison can only be performed on the client side.');
    }
  
    // Dynamically import face-api.js
    const faceapi = await import('face-api.js');
  
    // Load necessary models
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    ]);
  
    // Convert base64 or URL images to HTMLImageElement
    const img1 = await loadImage(image1);
    const img2 = await loadImage(image2);
  
    // Detect face and get descriptor for each image
    const detections1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor();
    const detections2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor();
  
    // Check if faces are detected in both images
    if (!detections1 || !detections2) {
      throw new Error('Cannot detect face in one of the images.');
    }
  
    // Calculate Euclidean distance between face descriptors
    const distance = faceapi.euclideanDistance(detections1.descriptor, detections2.descriptor);
  
    // Define a threshold for face similarity (lower means more similar)
    const threshold = 0.6;
    return distance < threshold;
  };
  
  /**
   * Convert an image source to an HTMLImageElement
   * @param {string} imageSrc - Base64 or URL of the image
   * @returns {Promise<HTMLImageElement>}
   */
  const loadImage = (imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageSrc;
      img.crossOrigin = 'anonymous'; // Enable CORS if loading from external sources
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };
  