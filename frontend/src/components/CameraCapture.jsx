import { useRef, useState, useEffect } from 'react';

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return () => {
      // stop camera on unmount
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }});
    videoRef.current.srcObject = stream;
    await videoRef.current.play();
    setReady(true);
  }

  function snap() {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (blob) onCapture(blob);
    }, 'image/jpeg', 0.9);
  }

  return (
    <div style={{display:'grid', gap:8}}>
      <video ref={videoRef} playsInline style={{maxWidth:'100%', borderRadius:12}} />
      <div style={{display:'flex', gap:8}}>
        <button onClick={start}>{ready ? 'Restart' : 'Start Camera'}</button>
        <button onClick={snap} disabled={!ready}>Snap Photo</button>
      </div>
    </div>
  );
}
