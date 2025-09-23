import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const doLogout = async () => {
    await logout();
    nav("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/upload", label: "Add Meal", icon: "📸" },
    { path: "/history", label: "History", icon: "📋" },
    { path: "/profile", label: "Profile", icon: "👤" }
  ];

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="container">
        <div className="flex-between">
          {/* Logo */}
          <Link 
            to="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              color: '#667eea',
              fontWeight: '700',
              fontSize: '20px'
            }}
          >
            <span style={{ fontSize: '24px' }}>🍎</span>
            NutriTrack
          </Link>

          {/* Desktop Navigation */}
          <div className="flex" style={{ gap: '24px', alignItems: 'center' }}>
        {user ? (
          <>
                {/* Desktop Menu */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: isActive(link.path) ? '#667eea' : '#6b7280',
                        background: isActive(link.path) ? '#f0f4ff' : 'transparent',
                        fontWeight: isActive(link.path) ? '600' : '500',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{link.icon}</span>
                      <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* User Menu */}
                <div className="flex" style={{ gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#667eea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <span style={{ 
                      color: '#374151', 
                      fontWeight: '500',
                      display: window.innerWidth < 768 ? 'none' : 'inline'
                    }}>
                      Hi, {user.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={doLogout}
                    style={{
                      background: 'transparent',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#ef4444';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#ef4444';
                    }}
                  >
                    Logout
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{
                    display: 'none',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                  className="mobile-menu-btn"
                >
                  ☰
                </button>
          </>
        ) : (
              <div className="flex" style={{ gap: '12px' }}>
                <Link
                  to="/login"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#6b7280',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#667eea',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && user && (
          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div className="flex-column" style={{ gap: '12px' }}>
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive(link.path) ? '#667eea' : '#6b7280',
                    background: isActive(link.path) ? '#f0f4ff' : 'transparent',
                    fontWeight: isActive(link.path) ? '600' : '500'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

        <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          
          nav > div > div > div:first-child {
            display: none !important;
          }
          
          nav > div > div > div:last-child > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
