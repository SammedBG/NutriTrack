import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function UploadMeal() {
  const nav = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) { setMessage("Select a photo first"); return; }
    const form = new FormData();
    form.append("photo", file);
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/meals/upload", form, { headers: { "Content-Type": "multipart/form-data" }});
      setMessage("Meal added!");
      setTimeout(()=> nav("/"), 800);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Add meal (photo)</h2>
      <form onSubmit={submit} style={{display:"grid",gap:12, maxWidth:420}}>
        <input
          accept="image/*"
          capture="environment"
          type="file"
          onChange={(e)=> setFile(e.target.files?.[0] || null)}
        />
        <button disabled={loading} type="submit">{loading ? "Uploading..." : "Upload & Analyze"}</button>
      </form>
      {message && <div style={{marginTop:12}}>{message}</div>}
    </div>
  );
}
