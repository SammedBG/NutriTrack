import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Profile(){
  const { user, reloadUser } = useContext(AuthContext);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(()=> {
    if(user) setForm({
      name: user.name || "",
      // if you add more fields on server, include here
    });
  }, [user]);

  const save = async () => {
    try {
      await api.put("/user/me", form);
      setMsg("Saved");
      await reloadUser();
    } catch (err) {
      setMsg("Save failed");
    }
  };

  if(!form) return <div style={{padding:20}}>Loading...</div>;
  return (
    <div style={{padding:20}}>
      <h2>Profile</h2>
      <div style={{display:"grid",gap:8, maxWidth:420}}>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" />
        <button onClick={save}>Save</button>
        {msg && <div>{msg}</div>}
      </div>
    </div>
  );
}
