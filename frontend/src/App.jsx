import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Meals from './pages/Meals';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <div className="app-container">
      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/meals">Meals</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/meals" element={<ProtectedRoute><Meals/></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
