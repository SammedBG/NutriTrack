import React, { useState, useContext } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { reloadUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/auth/login", form);
      await reloadUser();
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{display:"grid",gap:10, maxWidth:400}}>
        <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {err && <div style={{color:"crimson"}}>{err}</div>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
