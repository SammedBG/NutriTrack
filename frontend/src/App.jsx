import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold">Nutrition Tracker</Link>
          <div className="space-x-3">
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/register" className="text-sm">Register</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<div className="mt-8 text-center">Welcome — open the dashboard after login.</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}
