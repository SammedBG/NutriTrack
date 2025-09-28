// frontend/src/components/FoodDetection.js
import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const FoodDetection = ({ onFoodDetected, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [detectedFood, setDetectedFood] = useState(null);
  const [error, setError] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);

  // Common food classes for detection
  const FOOD_CLASSES = [
    'apple', 'banana', 'bread', 'broccoli', 'cake', 'carrot', 'coffee', 'donut',
    'egg', 'french fries', 'hamburger', 'hot dog', 'ice cream', 'orange', 'pizza',
    'sandwich', 'strawberry', 'waffle', 'pasta', 'rice', 'chicken', 'salad'
  ];

  useEffect(() => {
    loadModel();
    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  const loadModel = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading TensorFlow.js model...');
      
      // Load MobileNet model for image classification
      modelRef.current = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
      setIsModelLoaded(true);
      console.log('✅ Model loaded successfully');
    } catch (error) {
      console.error('❌ Error loading model:', error);
      setError('Failed to load AI model. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('❌ Camera error:', error);
      setError('Camera access denied. Please allow camera access and try again.');
    }
  };

  const captureAndAnalyze = async () => {
    if (!modelRef.current || !videoRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Capture frame from video
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Convert to tensor
      const imageTensor = tf.browser.fromPixels(canvas)
        .resizeNearestNeighbor([224, 224])
        .expandDims(0)
        .div(255.0);

      // Make prediction
      const predictions = await modelRef.current.predict(imageTensor);
      const topPredictions = await predictions.topk(5).data();
      
      // Find food-related predictions
      const foodPredictions = [];
      for (let i = 0; i < topPredictions.length; i++) {
        const classIndex = Math.floor(i / 2);
        const confidence = topPredictions[i + 1];
        
        if (FOOD_CLASSES.includes(FOOD_CLASSES[classIndex]) && confidence > 0.3) {
          foodPredictions.push({
            food: FOOD_CLASSES[classIndex],
            confidence: confidence
          });
        }
      }

      // Clean up tensors
      imageTensor.dispose();
      predictions.dispose();

      if (foodPredictions.length > 0) {
        const bestPrediction = foodPredictions[0];
        setDetectedFood(bestPrediction);
        console.log('🍎 Detected food:', bestPrediction);
      } else {
        setError('No food detected. Please try a clearer photo of food.');
      }

    } catch (error) {
      console.error('❌ Analysis error:', error);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDetection = () => {
    if (detectedFood && onFoodDetected) {
      onFoodDetected(detectedFood.food);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="food-detection-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>🍎 Real-time Food Detection</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="detection-area">
          {!isModelLoaded ? (
            <div className="loading-section">
              <div className="spinner"></div>
              <p>Loading AI model...</p>
            </div>
          ) : (
            <>
              <div className="camera-section">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="camera-feed"
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                <div className="camera-controls">
                  <button 
                    onClick={startCamera}
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    📷 Start Camera
                  </button>
                  
                  <button 
                    onClick={captureAndAnalyze}
                    className="btn btn-success"
                    disabled={isLoading || !videoRef.current?.srcObject}
                  >
                    {isLoading ? '🔄 Analyzing...' : '🔍 Detect Food'}
                  </button>
                </div>
              </div>

              {detectedFood && (
                <div className="detection-result">
                  <h4>🎯 Detected Food:</h4>
                  <div className="food-info">
                    <span className="food-name">{detectedFood.food}</span>
                    <span className="confidence">
                      Confidence: {Math.round(detectedFood.confidence * 100)}%
                    </span>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      onClick={handleConfirmDetection}
                      className="btn btn-primary"
                    >
                      ✅ Use This Food
                    </button>
                    <button 
                      onClick={() => setDetectedFood(null)}
                      className="btn btn-secondary"
                    >
                      🔄 Try Again
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <p>❌ {error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="btn btn-secondary"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <p className="help-text">
            💡 Point your camera at food and tap "Detect Food" for instant recognition!
          </p>
        </div>
      </div>

      <style jsx>{`
        .food-detection-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 20px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .detection-area {
          text-align: center;
        }

        .loading-section {
          padding: 40px 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .camera-section {
          margin-bottom: 20px;
        }

        .camera-feed {
          width: 100%;
          max-width: 400px;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #ddd;
          background: #f5f5f5;
        }

        .camera-controls {
          margin-top: 15px;
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #1e7e34;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #545b62;
        }

        .detection-result {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }

        .food-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .food-name {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          text-transform: capitalize;
        }

        .confidence {
          color: #28a745;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }

        .modal-footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .help-text {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        @media (max-width: 480px) {
          .modal-content {
            width: 95%;
            padding: 15px;
          }
          
          .camera-feed {
            height: 250px;
          }
          
          .camera-controls {
            flex-direction: column;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default FoodDetection;