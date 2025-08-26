import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Profile(){
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/user/profile').then(r => setUser(r.data.user)).catch(()=>{});
  }, []);

  if (!user) return <p>Loading profile...</p>;

  async function save() {
    setMsg('');
    try {
      await api.put('/user/profile', user);
      setMsg('Saved');
    } catch (e) {
      setMsg('Save failed');
    }
  }

  return (
    <div className="card">
      <h2>Profile</h2>
      <input value={user.name||''} onChange={e=>setUser({...user, name:e.target.value})} />
      <input value={user.age||''} onChange={e=>setUser({...user, age: Number(e.target.value)||''})} placeholder="Age" />
      <select value={user.gender||'other'} onChange={e=>setUser({...user, gender:e.target.value})}>
        <option value="male">male</option>
        <option value="female">female</option>
        <option value="other">other</option>
      </select>
      <input value={user.height||''} onChange={e=>setUser({...user, height:Number(e.target.value)||''})} placeholder="Height (cm)" />
      <input value={user.weight||''} onChange={e=>setUser({...user, weight:Number(e.target.value)||''})} placeholder="Weight (kg)" />
      <select value={user.activityLevel||'moderate'} onChange={e=>setUser({...user, activityLevel:e.target.value})}>
        <option value="low">low</option>
        <option value="moderate">moderate</option>
        <option value="high">high</option>
      </select>
      <h3>Goals</h3>
      <select value={user.goals?.goalType||'maintain'} onChange={e=>setUser({...user, goals:{...user.goals, goalType:e.target.value}})}>
        <option value="lose">lose</option>
        <option value="maintain">maintain</option>
        <option value="gain">gain</option>
      </select>
      <input value={user.goals?.calories||''} onChange={e=>setUser({...user, goals:{...user.goals, calories:Number(e.target.value)||''}})} placeholder="Calories" />
      <input value={user.goals?.protein||''} onChange={e=>setUser({...user, goals:{...user.goals, protein:Number(e.target.value)||''}})} placeholder="Protein (g)" />
      <input value={user.goals?.carbs||''} onChange={e=>setUser({...user, goals:{...user.goals, carbs:Number(e.target.value)||''}})} placeholder="Carbs (g)" />
      <input value={user.goals?.fat||''} onChange={e=>setUser({...user, goals:{...user.goals, fat:Number(e.target.value)||''}})} placeholder="Fat (g)" />
      <button onClick={save}>Save</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
