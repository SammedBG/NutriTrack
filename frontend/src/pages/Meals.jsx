import { useState, useEffect } from 'react';
import api from '../api/axios';
import CameraCapture from '../components/CameraCapture';

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await api.get('/meals');
    setMeals(r.data.meals || []);
  }

  async function startCapture() {
    setCapturing(true);
  }

  async function onCapture(blob) {
    setCapturing(false);
    // 1) create meal metadata -> get uploadUrl + publicUrl
    const create = await api.post('/meals', { takenAt: new Date().toISOString(), source: 'IMAGE' });
    const { mealId, uploadUrl, publicUrl } = create.data;
    // 2) Upload - backend stub expects external upload; here we simulate by uploading to backend endpoint if you implement it.
    // For now we will call a placeholder endpoint to accept binary if server supports it (not implemented in stub).
    // Instead, call ingest directly (since server's storage is stubbed and the photoUrl already set to a publicUrl)
    await api.post(`/meals/${mealId}/ingest`);
    await load();
  }

  return (
    <div>
      <h2>Meals</h2>
      <button onClick={startCapture}>Add Meal (Photo)</button>
      {capturing && <CameraCapture onCapture={onCapture} />}
      <ul>
        {meals.map(m => (
          <li key={m._id}>
            <div>
              <small>{new Date(m.takenAt).toLocaleString()}</small>
              <p>Items: {m.items?.map(it=>it.foodName).join(", ") || "—"}</p>
              {m.photoUrl && <img src={m.photoUrl} style={{maxWidth:200, borderRadius:8}} alt="meal" />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
