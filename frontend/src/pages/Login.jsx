import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login(){
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/auth/login', form);
      nav('/');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <h2>Login</h2>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
      <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
      {err && <p className="error">{err}</p>}
      <button>Login</button>
    </form>
  );
}
