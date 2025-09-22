import React, { useState, useRef } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function UploadMeal() {
  const nav = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mealType, setMealType] = useState("meal");

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
      setAnalysisResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { 
      setMessage("Please select a photo first"); 
      return; 
    }

    const form = new FormData();
    form.append("photo", file);
    form.append("mealType", mealType);
    
    setLoading(true);
    setMessage("");
    
    try {
      const res = await api.post("/meals/upload", form, { 
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setAnalysisResult(res.data);
      setMessage("🎉 Meal analyzed successfully! Please verify the details below.");
      
      // Auto-navigate after 3 seconds
      setTimeout(() => nav("/"), 3000);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setFile(null);
    setPreview(null);
    setAnalysisResult(null);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>📸 Add Meal</h1>
        <p className="text-muted" style={{ margin: '0 0 24px 0' }}>
          Take a photo of your meal and let AI analyze its nutritional content
        </p>

        {!preview ? (
          <div className="text-center p-4">
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>📷</div>
            <h3 style={{ margin: '0 0 16px 0' }}>Capture Your Meal</h3>
            <p className="text-muted mb-4">
              Take a clear photo of your food for accurate nutritional analysis
            </p>
            
            <form onSubmit={submit}>
              <input
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                type="file"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              <div className="grid grid-2 mb-4">
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  📷 Take Photo
                </button>
                
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  style={{ padding: '16px' }}
                >
                  <option value="breakfast">🌅 Breakfast</option>
                  <option value="lunch">☀️ Lunch</option>
                  <option value="dinner">🌙 Dinner</option>
                  <option value="snack">🍎 Snack</option>
                </select>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {/* Photo Preview */}
            <div className="card mb-4" style={{ padding: '16px' }}>
              <div className="flex-between mb-3">
                <h3 style={{ margin: 0 }}>Photo Preview</h3>
                <button
                  onClick={retakePhoto}
                  style={{
                    background: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Retake
                </button>
              </div>
              
              <div className="text-center">
                <img
                  src={preview}
                  alt="Meal preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb'
                  }}
                />
              </div>
            </div>

            {/* Analysis Result */}
            {analysisResult && (
              <div className="card mb-4">
                <div className="flex-between mb-3">
                  <h3 style={{ margin: 0 }}>🤖 AI Analysis Results</h3>
                  <div className="badge badge-success">
                    {Math.round(analysisResult.confidence * 100)}% Confidence
                  </div>
                </div>
                
                <div className="grid grid-2 mb-3">
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                      Food Name
                    </label>
                    <input
                      type="text"
                      value={analysisResult.name || ""}
                      readOnly
                      style={{ background: '#f9fafb' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                      Meal Type
                    </label>
                    <select value={mealType} disabled style={{ background: '#f9fafb' }}>
                      <option value="breakfast">🌅 Breakfast</option>
                      <option value="lunch">☀️ Lunch</option>
                      <option value="dinner">🌙 Dinner</option>
                      <option value="snack">🍎 Snack</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-4 mb-3">
                  <div className="text-center">
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                      {Math.round(analysisResult.calories || 0)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Calories</div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                      {Math.round(analysisResult.protein || 0)}g
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Protein</div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                      {Math.round(analysisResult.carbs || 0)}g
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Carbs</div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>
                      {Math.round(analysisResult.fat || 0)}g
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Fat</div>
                  </div>
                </div>
                
                {analysisResult.fiber && (
                  <div className="text-muted text-center">
                    Fiber: {Math.round(analysisResult.fiber)}g • 
                    Sugar: {Math.round(analysisResult.sugar || 0)}g • 
                    Sodium: {Math.round(analysisResult.sodium || 0)}mg
                  </div>
                )}
              </div>
            )}

            {/* Upload Button */}
            <form onSubmit={submit}>
              <button 
                disabled={loading} 
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                {loading ? (
                  <div className="flex-center" style={{ gap: '12px' }}>
                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                    Analyzing Food...
                  </div>
                ) : (
                  "🚀 Upload & Analyze"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Messages */}
        {message && (
          <div 
            className="card mt-4"
            style={{
              background: message.includes('successfully') ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${message.includes('successfully') ? '#10b981' : '#ef4444'}`,
              color: message.includes('successfully') ? '#065f46' : '#991b1b'
            }}
          >
            <div className="flex" style={{ alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '20px' }}>
                {message.includes('successfully') ? '✅' : '⚠️'}
              </div>
              <div>{message}</div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="card mt-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>💡 Tips for Better Analysis</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b' }}>
            <li>Take photos in good lighting</li>
            <li>Include the entire meal in the frame</li>
            <li>Avoid blurry or dark images</li>
            <li>Make sure food items are clearly visible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
