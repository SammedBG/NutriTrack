import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // <-- IMPORTANT: send cookies (httpOnly)
  headers: {
    "Content-Type": "application/json",
  },
});

// register
export const register = (payload) => api.post("/api/auth/register", payload).then(r => r.data);

// login
export const login = (payload) => api.post("/api/auth/login", payload).then(r => r.data);

// me (protected)
export const me = () => api.get("/api/auth/me").then(r => r.data);

// logout
export const logout = () => api.post("/api/auth/logout").then(r => r.data);

export default api;
