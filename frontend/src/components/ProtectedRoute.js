import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loadingAuth } = useContext(AuthContext);
  if (loadingAuth) return <div style={{padding:20}}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
