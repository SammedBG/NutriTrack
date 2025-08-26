import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register(){
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/auth/register', form);
      nav('/');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to register');
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <h2>Create account</h2>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
      <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
      {err && <p className="error">{err}</p>}
      <button>Register</button>
    </form>
  );
}
