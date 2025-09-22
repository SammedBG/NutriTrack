import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadMeal from "./pages/UploadMeal";
import History from "./pages/History";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/" element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Dashboard/>
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <UploadMeal/>
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <History/>
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Profile/>
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
