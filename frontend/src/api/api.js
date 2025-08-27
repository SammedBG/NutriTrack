import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send httpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
