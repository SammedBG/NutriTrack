import React, { createContext, useEffect, useState } from "react";
import { me, logout as apiLogout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // fetch current user on load
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await me();
        setUser(res.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      // ignore
    }
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
