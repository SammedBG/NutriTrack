import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const doLogout = async () => {
    await logout();
    nav("/login");
  };

  return (
    <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12, padding:12, borderBottom:"1px solid #eee"}}>
      <div>
        <Link to="/" style={{marginRight:10}}>Dashboard</Link>
        <Link to="/upload" style={{marginRight:10}}>Add Meal</Link>
        <Link to="/history" style={{marginRight:10}}>History</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{marginRight:10}}>Hi, {user.name}</span>
            <button onClick={doLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{marginRight:8}}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
